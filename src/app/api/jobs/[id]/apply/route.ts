import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Application } from "@/lib/db/models/Application";
import { Job } from "@/lib/db/models/Job";
import { memoryDb } from "@/lib/db/memoryDb";
import { MatcherService } from "@/lib/services/ai/matcherService";
import { AuditService } from "@/lib/services/auditService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { user, payload } = await getCurrentUser(req);

    if (!user || payload?.role !== "student") {
      return NextResponse.json(
        { success: false, message: "Only registered students can apply for opportunities." },
        { status: 403 }
      );
    }

    // Find Job
    let job: any = null;
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        job = await Job.findById(jobId).lean();
      }
    } catch (e) {
      // fallback
    }
    if (!job) {
      job = memoryDb.jobs.find((j) => String(j._id) === jobId);
    }
    if (!job) {
      return NextResponse.json({ success: false, message: "Job opportunity not found." }, { status: 404 });
    }

    // Check if already applied
    const alreadyApplied = memoryDb.applications.some(
      (a) => String(a.jobId) === jobId && String(a.studentId) === String(payload.userId)
    );
    if (alreadyApplied) {
      return NextResponse.json(
        { success: false, message: "You have already applied for this opportunity." },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { coverLetter = "", resumeUrl = user.resumeUrl || "/sample-resume.pdf" } = body;

    // AI Match Evaluation
    const matchAnalysis = await MatcherService.match(user, job);

    const newApp: any = {
      _id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      jobId,
      studentId: payload.userId,
      companyId: String(job.companyId),
      jobTitle: job.title,
      companyName: job.companyName,
      studentName: user.name,
      studentEmail: user.email,
      studentPhone: user.phone || "",
      resumeUrl,
      coverLetter,
      status: "Applied",
      aiMatchScore: matchAnalysis.overallScore,
      aiMatchDetails: matchAnalysis,
      appliedDate: new Date(),
      updatedAt: new Date(),
    };

    memoryDb.applications.unshift(newApp);

    // Update job applicant count
    const jobInMem = memoryDb.jobs.find((j) => String(j._id) === jobId);
    if (jobInMem) jobInMem.applicantsCount = (jobInMem.applicantsCount || 0) + 1;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Application.create(newApp);
        await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });
      }
    } catch (e) {
      // safely handled
    }

    // Auto-create notification for student
    memoryDb.notifications.unshift({
      _id: `notif_${Date.now()}_1`,
      recipientId: payload.userId,
      title: "Application Submitted Successfully",
      message: `Your application for "${job.title}" at ${job.companyName} has been received with a ${matchAnalysis.overallScore}% role compatibility score.`,
      type: "application_status",
      link: "/applications",
      read: false,
      createdAt: new Date(),
    });

    // Auto-create notification for recruiter
    memoryDb.notifications.unshift({
      _id: `notif_${Date.now()}_2`,
      recipientId: String(job.companyId),
      title: "New Candidate Application",
      message: `${user.name} applied for "${job.title}" (${matchAnalysis.overallScore}% match).`,
      type: "application_status",
      link: "/company/applicants",
      read: false,
      createdAt: new Date(),
    });

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "student",
      action: `Applied for ${job.title}`,
      entity: "Application",
      entityId: String(newApp._id),
      metadata: { jobId, companyId: job.companyId, matchScore: matchAnalysis.overallScore },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      application: newApp,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
