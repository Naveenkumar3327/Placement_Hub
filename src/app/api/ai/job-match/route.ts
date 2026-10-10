import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { MatcherService } from "@/lib/services/ai/matcherService";
import { memoryDb } from "@/lib/db/memoryDb";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentUser(req);
    const body = await req.json();
    const { jobId, studentData, jobData } = body;

    let targetJob = jobData;
    if (!targetJob && jobId) {
      targetJob = memoryDb.jobs.find((j) => String(j._id) === jobId);
    }

    const candidateProfile = studentData || user;

    if (!targetJob || !candidateProfile) {
      return NextResponse.json(
        { success: false, message: "Candidate profile and job opportunity are required." },
        { status: 400 }
      );
    }

    const match = await MatcherService.match(candidateProfile, targetJob);

    return NextResponse.json({
      success: true,
      match,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
