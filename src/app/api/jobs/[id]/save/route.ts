import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
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

    const existingIdx = memoryDb.savedJobs.findIndex(
      (s) => String(s.studentId) === String(payload.userId) && String(s.jobId) === jobId
    );

    let saved = false;
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
    if (!user) {
      return NextResponse.json({ success: true, saved: false });
    }

    const isSaved = memoryDb.savedJobs.some(
      (s) => String(s.studentId) === String(payload?.userId) && String(s.jobId) === jobId
    );

    return NextResponse.json({ success: true, saved: isSaved });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
