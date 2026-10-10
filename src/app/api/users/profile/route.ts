import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { memoryDb } from "@/lib/db/memoryDb";
import { calculateProfileCompletion } from "@/lib/utils";
import { AuditService } from "@/lib/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, profile: safeUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const updates = await req.json();
    delete updates.passwordHash;
    delete updates._id;
    delete updates.role;
    delete updates.email;

    // Recalculate profile completion if student
    if (payload.role === "student") {
      const mergedProfile = { ...user, ...updates };
      updates.profileCompletion = calculateProfileCompletion(mergedProfile);
    }

    // Update in memoryDb
    const memUserIndex = memoryDb.users.findIndex(
      (u) => String(u._id) === String(payload.userId) || u.email === payload.email
    );
    if (memUserIndex !== -1) {
      memoryDb.users[memUserIndex] = {
        ...memoryDb.users[memUserIndex],
        ...updates,
        updatedAt: new Date(),
      };
    }

    // Update in MongoDB if available
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await User.findByIdAndUpdate(payload.userId, { $set: updates });
      }
    } catch (e) {
      // safely handled
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: payload.role,
      action: "Updated profile information",
      entity: "User",
      entityId: payload.userId,
    });

    const updatedUser = memUserIndex !== -1 ? memoryDb.users[memUserIndex] : { ...user, ...updates };
    const { passwordHash, ...safeUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
