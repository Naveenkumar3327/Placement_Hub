import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Application } from "@/lib/db/models/Application";
import { memoryDb } from "@/lib/db/memoryDb";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let apps: any[] = [];

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const query: any = {};
        if (payload.role === "student") {
          query.studentId = payload.userId;
        } else if (payload.role === "company") {
          query.companyId = payload.userId;
        }
        if (status) query.status = status;

        const dbApps = await Application.find(query).sort({ appliedDate: -1 }).lean();
        if (dbApps && dbApps.length > 0) {
          apps = dbApps;
        }
      }
    } catch (e) {
      // fallback
    }

    if (apps.length === 0) {
      apps = memoryDb.applications.filter((a) => {
        if (payload.role === "student" && String(a.studentId) !== String(payload.userId)) {
          return false;
        }
        if (payload.role === "company" && String(a.companyId) !== String(payload.userId)) {
          return false;
        }
        if (status && a.status !== status) return false;
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      count: apps.length,
      applications: apps,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
