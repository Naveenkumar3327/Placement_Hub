import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Application } from "@/lib/db/models/Application";
import { memoryDb } from "@/lib/db/memoryDb";
import { AuditService } from "@/lib/services/auditService";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, payload } = await getCurrentUser(req);
    if (!user || (payload?.role !== "company" && payload?.role !== "admin" && payload?.role !== "student")) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { status, notes, interviewDetails } = body;

    const appIdx = memoryDb.applications.findIndex((a) => String(a._id) === id);
    if (appIdx === -1) {
      return NextResponse.json({ success: false, message: "Application not found." }, { status: 404 });
    }

    const currentApp = memoryDb.applications[appIdx];

    // Students can only withdraw their own application
    if (payload.role === "student") {
      if (status !== "Withdrawn" || String(currentApp.studentId) !== String(payload.userId)) {
        return NextResponse.json({ success: false, message: "Students may only withdraw applications." }, { status: 403 });
      }
    }

    const updates: any = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (interviewDetails !== undefined) updates.interviewDetails = interviewDetails;

    memoryDb.applications[appIdx] = {
      ...memoryDb.applications[appIdx],
      ...updates,
    };

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Application.findByIdAndUpdate(id, { $set: updates });
      }
    } catch (e) {
      // safely handled
    }

    // Auto-create notification for student when recruiter updates status
    if (status && payload.role !== "student") {
      const statusMessages: Record<string, string> = {
        "Under Review": `Your application for "${currentApp.jobTitle}" is currently under review by ${currentApp.companyName}.`,
        "Shortlisted": `Congratulations! You have been shortlisted for "${currentApp.jobTitle}" at ${currentApp.companyName}!`,
        "Interview Scheduled": `An interview has been scheduled for "${currentApp.jobTitle}" at ${currentApp.companyName}. Check your applications tab for meeting details.`,
        "Interview Completed": `Your interview for "${currentApp.jobTitle}" has been recorded as completed.`,
        "Selected": `Fantastic news! You have received a selection offer for "${currentApp.jobTitle}" from ${currentApp.companyName}!`,
        "Rejected": `Update on your application for "${currentApp.jobTitle}" at ${currentApp.companyName}.`,
      };

      memoryDb.notifications.unshift({
        _id: `notif_${Date.now()}`,
        recipientId: String(currentApp.studentId),
        title: `Application Status: ${status}`,
        message: statusMessages[status] || `Your application status changed to ${status}.`,
        type: status === "Interview Scheduled" ? "interview_scheduled" : "application_status",
        link: "/applications",
        read: false,
        createdAt: new Date(),
      });
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: payload.role,
      action: `Updated application status to ${status || "modified"}`,
      entity: "Application",
      entityId: id,
      metadata: { newStatus: status, jobTitle: currentApp.jobTitle },
    });

    return NextResponse.json({
      success: true,
      message: "Application updated successfully.",
      application: memoryDb.applications[appIdx],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
