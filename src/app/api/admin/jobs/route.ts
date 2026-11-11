import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { memoryDb } from "@/lib/db/memoryDb";
import { connectDB } from "@/lib/db/connect";
import { Job } from "@/lib/db/models/Job";
import { AuditService } from "@/lib/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || payload?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }

    let jobs: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        jobs = await Job.find().sort({ createdAt: -1 }).lean();
      }
    } catch (e) {
      // fallback
    }

    if (jobs.length === 0) {
      jobs = memoryDb.jobs;
    }

    return NextResponse.json({ success: true, count: jobs.length, jobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || payload?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }

    const { jobId, approvalStatus, status } = await req.json();

    const updates: any = { updatedAt: new Date() };
    if (approvalStatus) updates.approvalStatus = approvalStatus;
    if (status) updates.status = status;

    let updatedJob: any = null;
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        updatedJob = await Job.findByIdAndUpdate(
          jobId,
          { $set: updates },
          { new: true }
        ).lean();
      }
    } catch (e) {
      // safely handled
    }

    const jobIdx = memoryDb.jobs.findIndex((j) => String(j._id) === jobId);
    if (jobIdx !== -1) {
      if (approvalStatus) memoryDb.jobs[jobIdx].approvalStatus = approvalStatus;
      if (status) memoryDb.jobs[jobIdx].status = status;
      memoryDb.jobs[jobIdx].updatedAt = new Date();
      if (!updatedJob) updatedJob = memoryDb.jobs[jobIdx];
    }

    if (!updatedJob) {
      return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `${approvalStatus || status} job posting`,
      entity: "Job",
      entityId: jobId,
      metadata: { title: updatedJob.title, approvalStatus, status },
    });

    return NextResponse.json({
      success: true,
      message: `Job updated to ${approvalStatus || status}.`,
      job: updatedJob,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
