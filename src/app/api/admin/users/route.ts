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

    let users: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const query: any = {};
        if (role) query.role = role;
        const dbUsers = await User.find(query).select("-passwordHash").sort({ createdAt: -1 }).lean();
        if (dbUsers && dbUsers.length > 0) {
          users = dbUsers;
        }
      }
    } catch (e) {
      // fallback
    }

    if (users.length === 0) {
      users = memoryDb.users.map(({ passwordHash, ...u }) => u);
      if (role) {
        users = users.filter((u) => u.role === role);
      }
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

    let updatedUser: any = null;
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { status, updatedAt: new Date() } },
          { new: true }
        ).select("-passwordHash").lean();
      }
    } catch (e) {
      // safely handled
    }

    const userIdx = memoryDb.users.findIndex((u) => String(u._id) === userId);
    if (userIdx !== -1) {
      memoryDb.users[userIdx].status = status;
      memoryDb.users[userIdx].updatedAt = new Date();
      if (!updatedUser) {
        const { passwordHash, ...safeUser } = memoryDb.users[userIdx];
        updatedUser = safeUser;
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: "admin",
      action: `Changed user status to ${status}`,
      entity: "User",
      entityId: userId,
      metadata: { targetEmail: updatedUser.email, newStatus: status },
    });

    return NextResponse.json({
      success: true,
      message: `User status changed to ${status}.`,
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
