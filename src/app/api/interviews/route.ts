import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Interview } from "@/lib/db/models/Interview";
import { memoryDb } from "@/lib/db/memoryDb";
import { InterviewService } from "@/lib/services/ai/interviewService";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    let interviews: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        interviews = await Interview.find({ studentId: payload.userId })
          .sort({ createdAt: -1 })
          .lean();
      }
    } catch (e) {
      // fallback
    }

    if (interviews.length === 0) {
      interviews = memoryDb.interviews.filter(
        (i) => String(i.studentId) === String(payload.userId)
      );
    }

    return NextResponse.json({
      success: true,
      interviews,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      targetRole,
      difficulty,
      type,
      questionsAndAnswers = [],
    } = body;

    const evaluations = questionsAndAnswers.map((qa: any) => ({
      score: qa.score || 75,
      technicalScore: qa.score || 75,
      communicationScore: 80,
      problemSolvingScore: 78,
      strengths: qa.strengths || [],
      improvements: qa.improvements || [],
    }));

    const finalReport = InterviewService.generateFinalReport(evaluations, targetRole);

    const newInterview: any = {
      _id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: payload.userId,
      studentName: user.name,
      targetRole,
      difficulty,
      type,
      totalQuestions: questionsAndAnswers.length,
      completedQuestions: questionsAndAnswers.length,
      overallScore: finalReport.overallScore,
      technicalScore: finalReport.technicalScore,
      communicationScore: finalReport.communicationScore,
      problemSolvingScore: finalReport.problemSolvingScore,
      strengths: finalReport.strengths,
      weaknesses: finalReport.weaknesses,
      recommendations: finalReport.recommendations,
      status: "completed",
      questionsAndAnswers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryDb.interviews.unshift(newInterview);

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Interview.create(newInterview);
      }
    } catch (e) {
      // safely handled
    }

    return NextResponse.json({
      success: true,
      message: "Interview session saved successfully.",
      interview: newInterview,
      finalReport,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
