import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { SavedJob } from "@/lib/db/models/SavedJob";
import { memoryDb } from "@/lib/db/memoryDb";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { user, payload } = await getCurrentUser(req);
    if (!user || payload?.role !== "student") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let saved = false;
    let handledInDb = false;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const existing = await SavedJob.findOne({
          studentId: payload.userId,
          jobId,
        });

        if (existing) {
          await SavedJob.deleteOne({ _id: existing._id });
          saved = false;
        } else {
          await SavedJob.create({
            _id: `saved_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            studentId: payload.userId,
            jobId,
          });
          saved = true;
        }
        handledInDb = true;
      }
    } catch (e) {
      // fallback to memory
    }

    // Keep memoryDb synchronized
    const existingIdx = memoryDb.savedJobs.findIndex(
      (s) => String(s.studentId) === String(payload.userId) && String(s.jobId) === jobId
    );

    if (!handledInDb) {
      if (existingIdx !== -1) {
        memoryDb.savedJobs.splice(existingIdx, 1);
        saved = false;
      } else {
        memoryDb.savedJobs.push({
          _id: `saved_${Date.now()}`,
          studentId: payload.userId,
          jobId,
          createdAt: new Date(),
        });
        saved = true;
      }
    } else {
      if (saved && existingIdx === -1) {
        memoryDb.savedJobs.push({
          _id: `saved_${Date.now()}`,
          studentId: payload.userId,
          jobId,
          createdAt: new Date(),
        });
      } else if (!saved && existingIdx !== -1) {
        memoryDb.savedJobs.splice(existingIdx, 1);
      }
    }

    return NextResponse.json({
      success: true,
      saved,
      message: saved ? "Opportunity saved to your bookmarks." : "Opportunity removed from bookmarks.",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: true, saved: false });
    }

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const exists = await SavedJob.exists({
          studentId: payload.userId,
          jobId,
        });
        if (exists) {
          return NextResponse.json({ success: true, saved: true });
        }
      }
    } catch (e) {
      // fallback
    }

    const isSaved = memoryDb.savedJobs.some(
      (s) => String(s.studentId) === String(payload?.userId) && String(s.jobId) === jobId
    );

    return NextResponse.json({ success: true, saved: isSaved });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
