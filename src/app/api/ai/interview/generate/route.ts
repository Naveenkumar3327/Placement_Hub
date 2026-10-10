import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/lib/services/ai/interviewService";

export async function POST(req: NextRequest) {
  try {
    const { role = "Full Stack Developer", difficulty = "mid", type = "mixed", count = 5 } = await req.json();

    const questions = await InterviewService.generateQuestions(
      role,
      difficulty,
      type,
      Math.min(10, Math.max(1, count))
    );

    return NextResponse.json({
      success: true,
      role,
      difficulty,
      type,
      questions,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
