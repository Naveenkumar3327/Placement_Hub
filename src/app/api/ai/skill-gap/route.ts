import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { SkillGapService } from "@/lib/services/ai/skillGapService";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getCurrentUser(req);
    const body = await req.json();
    const { targetRole = "Full Stack Developer", skills } = body;

    const studentSkills = skills || user?.skills || [
      "React",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Node.js",
    ];

    const analysis = await SkillGapService.analyze(studentSkills, targetRole);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
