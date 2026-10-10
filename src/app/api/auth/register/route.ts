import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { memoryDb } from "@/lib/db/memoryDb";
import { signToken } from "@/lib/auth/jwt";
import { AuditService } from "@/lib/services/auditService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role = "student", companyName, headline, skills = [] } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    // Check existing in memoryDb
    const existingInMem = memoryDb.users.find((u) => u.email === emailNormalized);
    if (existingInMem) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists." },
        { status: 409 }
      );
    }

    // Check in MongoDB
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const existingInDb = await User.findOne({ email: emailNormalized });
        if (existingInDb) {
          return NextResponse.json(
            { success: false, message: "User with this email already exists." },
            { status: 409 }
          );
        }
      }
    } catch (e) {
      // safely handled
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newUserObj: any = {
      _id: userId,
      name,
      email: emailNormalized,
      passwordHash,
      role,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      isVerified: true,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (role === "student") {
      newUserObj.headline = headline || "Student / Aspiring Software Professional";
      newUserObj.skills = skills;
      newUserObj.education = [];
      newUserObj.experience = [];
      newUserObj.projects = [];
      newUserObj.profileCompletion = 40;
    } else if (role === "company") {
      newUserObj.companyName = companyName || name;
      newUserObj.companyApproved = true; // Auto-approved for frictionless onboarding, can be managed by admin
      newUserObj.companyWebsite = "";
      newUserObj.industry = "Technology";
    }

    // Save to memoryDb
    memoryDb.users.push(newUserObj);

    // Save to MongoDB if available
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const dbUser = new User(newUserObj);
        await dbUser.save();
      }
    } catch (e) {
      // safely handled
    }

    const token = signToken({
      userId: String(newUserObj._id),
      email: newUserObj.email,
      role: newUserObj.role,
      name: newUserObj.name,
    });

    await AuditService.logAction({
      actorId: String(newUserObj._id),
      actorEmail: newUserObj.email,
      actorRole: newUserObj.role,
      action: "Registered new account",
      entity: "User",
      entityId: String(newUserObj._id),
    });

    const response = NextResponse.json({
      success: true,
      message: "Account registered successfully.",
      user: {
        _id: newUserObj._id,
        name: newUserObj.name,
        email: newUserObj.email,
        role: newUserObj.role,
        avatarUrl: newUserObj.avatarUrl,
        companyName: newUserObj.companyName,
      },
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
      { success: false, message: error.message || "Failed to register user." },
      { status: 500 }
    );
  }
}
