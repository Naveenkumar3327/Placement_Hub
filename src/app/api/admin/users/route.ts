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

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    let users = memoryDb.users.map(({ passwordHash, ...u }) => u);
    if (role) {
      users = users.filter((u) => u.role === role);
    }

    return NextResponse.json({ success: true, count: users.length, users });
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

    const { userId, status } = await req.json();
    const userIdx = memoryDb.users.findIndex((u) => String(u._id) === userId);
    if (userIdx === -1) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    memoryDb.users[userIdx].status = status;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await User.findByIdAndUpdate(userId, { $set: { status } });
      }
    } catch (e) {
      // safely handled
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `Changed user status to ${status}`,
      entity: "User",
      entityId: userId,
      metadata: { targetEmail: memoryDb.users[userIdx].email, newStatus: status },
    });

    return NextResponse.json({
      success: true,
      message: `User status changed to ${status}.`,
      user: memoryDb.users[userIdx],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
