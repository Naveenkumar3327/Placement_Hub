import { NextRequest, NextResponse } from "next/server";
import { AtsService } from "@/lib/services/ai/atsService";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: "Please provide valid resume text or content (minimum 20 characters)." },
        { status: 400 }
      );
    }

    const result = await AtsService.analyzeResume(resumeText, jobDescription);

    return NextResponse.json({
      success: true,
      analysis: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
