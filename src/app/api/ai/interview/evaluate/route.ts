import { NextRequest, NextResponse } from "next/server";
import { InterviewService } from "@/lib/services/ai/interviewService";

export async function POST(req: NextRequest) {
  try {
    const { question, category = "technical", userAnswer, targetRole = "Full Stack Developer" } = await req.json();

    if (!userAnswer || userAnswer.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Answer cannot be empty." },
        { status: 400 }
      );
    }

    const evaluation = await InterviewService.evaluateAnswer(
      question,
      category,
      userAnswer,
      targetRole
    );

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
