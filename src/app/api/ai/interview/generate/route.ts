import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/lib/services/ai/interviewService";
import { getQuestionBank } from "@/lib/services/ai/interviewQuestionBank";

const questionModes = ["dataset", "gemini", "mixed"] as const;

export async function POST(req: NextRequest) {
  try {
    const {
      role = "Full Stack Developer",
      difficulty = "mid",
      type = "mixed",
      count = 5,
      sourceMode = "mixed",
    } = await req.json();

    const result = await InterviewService.generateQuestions(
      role,
      difficulty,
      type,
      Math.min(10, Math.max(1, count)),
      questionModes.includes(sourceMode) ? sourceMode : "mixed"
    );

    return NextResponse.json({
      success: true,
      role,
      difficulty,
      type,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit")) || 12));
  const offset = Math.min(200, Math.max(0, Number(searchParams.get("offset")) || 0));
  const search = (searchParams.get("search") || "").slice(0, 100);
  return NextResponse.json({ success: true, ...getQuestionBank(limit, search, offset) });
}
