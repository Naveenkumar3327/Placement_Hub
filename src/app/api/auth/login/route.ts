import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { memoryDb } from "@/lib/db/memoryDb";
import { signToken } from "@/lib/auth/jwt";
import { AuditService } from "@/lib/services/auditService";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();
    let foundUser: any = null;

    // Check MongoDB first
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        foundUser = await User.findOne({ email: emailNormalized }).lean();
      }
    } catch (e) {
      // safely handled
    }

    // Fallback to memoryDb
    if (!foundUser) {
      foundUser = memoryDb.users.find((u) => u.email.toLowerCase() === emailNormalized);
    }

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (foundUser.status === "suspended") {
      return NextResponse.json(
        { success: false, message: "Your account has been suspended. Please contact administrator." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: String(foundUser._id),
      email: foundUser.email,
      role: foundUser.role,
      name: foundUser.name,
    });

    await AuditService.logAction({
      actorId: String(foundUser._id),
      actorEmail: foundUser.email,
      actorRole: foundUser.role,
      action: "Logged into portal",
      entity: "User",
      entityId: String(foundUser._id),
    });

    const userProfileData = {
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      avatarUrl: foundUser.avatarUrl,
      headline: foundUser.headline,
      skills: foundUser.skills || [],
      companyName: foundUser.companyName,
      companyApproved: foundUser.companyApproved,
      profileCompletion: foundUser.profileCompletion || 70,
    };

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: userProfileData,
      token,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to log in." },
      { status: 500 }
    );
  }
}
