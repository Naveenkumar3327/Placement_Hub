import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Job } from "@/lib/db/models/Job";
import { memoryDb } from "@/lib/db/memoryDb";
import { AuditService } from "@/lib/services/auditService";
import { toAnonymousJob } from "@/lib/jobs/publicJob";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let job: any = null;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        job = await Job.findById(id).lean();
      }
    } catch (e) {
      // fallback
    }

    if (!job) {
      job = memoryDb.jobs.find((j) => String(j._id) === id);
    }

    if (!job) {
      return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
    }

    const { user, payload } = await getCurrentUser(req);
    const isSignedIn = Boolean(user && payload);
    const isOwnerOrAdmin = Boolean(
      user &&
      payload &&
      (payload.role === "admin" ||
        (payload.role === "company" && String(payload.userId) === String(job.companyId)))
    );
    const isPubliclyVisible = job.status === "published" && job.approvalStatus === "approved";

    if (!isPubliclyVisible && !isOwnerOrAdmin) {
      return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      job: isSignedIn ? job : toAnonymousJob(job),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, payload } = await getCurrentUser(req);
    if (!user || (payload?.role !== "company" && payload?.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const updates = await req.json();
    delete updates._id;
    delete updates.createdAt;

    const jobIdx = memoryDb.jobs.findIndex((j) => String(j._id) === id);
    if (jobIdx === -1) {
      return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
    }

    // Ensure company owns this job or is admin
    if (payload.role !== "admin" && String(memoryDb.jobs[jobIdx].companyId) !== String(payload.userId)) {
      return NextResponse.json({ success: false, message: "Forbidden." }, { status: 403 });
    }

    memoryDb.jobs[jobIdx] = {
      ...memoryDb.jobs[jobIdx],
      ...updates,
      updatedAt: new Date(),
    };

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Job.findByIdAndUpdate(id, { $set: updates });
      }
    } catch (e) {
      // safely handled
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: payload.role,
      action: `Updated job details`,
      entity: "Job",
      entityId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Job updated successfully.",
      job: memoryDb.jobs[jobIdx],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, payload } = await getCurrentUser(req);
    if (!user || (payload?.role !== "company" && payload?.role !== "admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 403 });
    }

    const jobIdx = memoryDb.jobs.findIndex((j) => String(j._id) === id);
    if (jobIdx !== -1) {
      memoryDb.jobs.splice(jobIdx, 1);
    }

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Job.findByIdAndDelete(id);
      }
    } catch (e) {
      // safely handled
    }

    return NextResponse.json({ success: true, message: "Job removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
