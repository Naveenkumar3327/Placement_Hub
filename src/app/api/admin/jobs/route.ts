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

    return NextResponse.json({ success: true, count: memoryDb.jobs.length, jobs: memoryDb.jobs });
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
    const jobIdx = memoryDb.jobs.findIndex((j) => String(j._id) === jobId);
    if (jobIdx === -1) {
      return NextResponse.json({ success: false, message: "Job not found." }, { status: 404 });
    }

    if (approvalStatus) memoryDb.jobs[jobIdx].approvalStatus = approvalStatus;
    if (status) memoryDb.jobs[jobIdx].status = status;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Job.findByIdAndUpdate(jobId, { $set: { approvalStatus, status } });
      }
    } catch (e) {
      // safely handled
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `${approvalStatus || status} job posting`,
      entity: "Job",
      entityId: jobId,
      metadata: { title: memoryDb.jobs[jobIdx].title, approvalStatus, status },
    });

    return NextResponse.json({
      success: true,
      message: `Job updated to ${approvalStatus || status}.`,
      job: memoryDb.jobs[jobIdx],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
