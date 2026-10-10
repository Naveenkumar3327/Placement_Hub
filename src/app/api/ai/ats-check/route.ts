import { NextRequest, NextResponse } from "next/server";
import { AtsService } from "@/lib/services/ai/atsService";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export const runtime = "nodejs";

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    let resumeText = "";
    let jobDescription = "";
    let parseOnly = false;

    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      const resume = formData.get("resume");

      if (!(resume instanceof File)) {
        return NextResponse.json(
          { success: false, message: "Choose a PDF, DOCX, or TXT resume to upload." },
          { status: 400 }
        );
      }

      if (resume.size > MAX_RESUME_SIZE) {
        return NextResponse.json(
          { success: false, message: "Resume files must be 5 MB or smaller." },
          { status: 413 }
        );
      }

      const extension = resume.name.toLowerCase().split(".").pop();
      const buffer = Buffer.from(await resume.arrayBuffer());

      if (extension === "pdf") {
        const parsed = await pdf(buffer);
        resumeText = parsed.text;
      } else if (extension === "docx") {
        const parsed = await mammoth.extractRawText({ buffer });
        resumeText = parsed.value;
      } else if (extension === "txt") {
        resumeText = buffer.toString("utf8");
      } else {
        return NextResponse.json(
          { success: false, message: "Unsupported file type. Upload a PDF, DOCX, or TXT file." },
          { status: 415 }
        );
      }

      jobDescription = String(formData.get("jobDescription") || "");
      parseOnly = formData.get("parseOnly") === "true";
    } else {
      const body = await req.json();
      resumeText = body.resumeText || "";
      jobDescription = body.jobDescription || "";
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { success: false, message: "We couldn't find enough text in that resume. Try a text-based PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }

    if (parseOnly) {
      return NextResponse.json({ success: true, resumeText });
    }

    const result = await AtsService.analyzeResume(resumeText, jobDescription);

    return NextResponse.json({
      success: true,
      resumeText,
      analysis: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
