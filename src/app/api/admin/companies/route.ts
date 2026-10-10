import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { memoryDb } from "@/lib/db/memoryDb";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { AuditService } from "@/lib/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || payload?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }

    const companies = memoryDb.users
      .filter((u) => u.role === "company")
      .map(({ passwordHash, ...u }) => u);

    return NextResponse.json({ success: true, count: companies.length, companies });
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

    const { companyId, approved } = await req.json();
    const compIdx = memoryDb.users.findIndex(
      (u) => String(u._id) === companyId && u.role === "company"
    );

    if (compIdx === -1) {
      return NextResponse.json({ success: false, message: "Company not found." }, { status: 404 });
    }

    memoryDb.users[compIdx].companyApproved = approved;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await User.findByIdAndUpdate(companyId, { $set: { companyApproved: approved } });
      }
    } catch (e) {
      // safely handled
    }

    // Notify company
    memoryDb.notifications.unshift({
      _id: `notif_${Date.now()}`,
      recipientId: companyId,
      title: approved ? "Company Profile Verified" : "Verification Status Update",
      message: approved
        ? "Congratulations! Your recruiter company account has been approved by the placement administration."
        : "Your company profile verification was suspended or rejected.",
      type: "company_approval",
      link: "/company/dashboard",
      read: false,
      createdAt: new Date(),
    });

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `${approved ? "Approved" : "Rejected"} company registration`,
      entity: "User",
      entityId: companyId,
      metadata: { companyName: memoryDb.users[compIdx].companyName, approved },
    });

    return NextResponse.json({
      success: true,
      message: `Company ${approved ? "approved" : "rejected"} successfully.`,
      company: memoryDb.users[compIdx],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
