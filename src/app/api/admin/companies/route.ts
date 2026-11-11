import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { memoryDb } from "@/lib/db/memoryDb";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Notification } from "@/lib/db/models/Notification";
import { AuditService } from "@/lib/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || payload?.role !== "admin") {
      return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
    }

    let companies: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        companies = await User.find({ role: "company" })
          .select("-passwordHash")
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      // fallback
    }

    if (companies.length === 0) {
      companies = memoryDb.users
        .filter((u) => u.role === "company")
        .map(({ passwordHash, ...u }) => u);
    }

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

    let updatedCompany: any = null;
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        updatedCompany = await User.findByIdAndUpdate(
          companyId,
          { $set: { companyApproved: approved, updatedAt: new Date() } },
          { new: true }
        ).select("-passwordHash").lean();
      }
    } catch (e) {
      // safely handled
    }

    const compIdx = memoryDb.users.findIndex(
      (u) => String(u._id) === companyId && u.role === "company"
    );

    if (compIdx !== -1) {
      memoryDb.users[compIdx].companyApproved = approved;
      memoryDb.users[compIdx].updatedAt = new Date();
      if (!updatedCompany) {
        const { passwordHash, ...safeComp } = memoryDb.users[compIdx];
        updatedCompany = safeComp;
      }
    }

    if (!updatedCompany) {
      return NextResponse.json({ success: false, message: "Company not found." }, { status: 404 });
    }

    // Notify company
    const notifObj = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipientId: companyId,
      title: approved ? "Company Profile Verified" : "Verification Status Update",
      message: approved
        ? "Congratulations! Your recruiter company account has been approved by the placement administration."
        : "Your company profile verification was suspended or rejected.",
      type: "company_approval",
      link: "/company/dashboard",
      read: false,
      createdAt: new Date(),
    };

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Notification.create(notifObj);
      }
    } catch (e) {}

    memoryDb.notifications.unshift(notifObj);

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `${approved ? "Approved" : "Rejected"} company registration`,
      entity: "User",
      entityId: companyId,
      metadata: { companyName: updatedCompany.companyName, approved },
    });

    return NextResponse.json({
      success: true,
      message: `Company ${approved ? "approved" : "rejected"} successfully.`,
      company: updatedCompany,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
