import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import type { AiPromptOptions } from "@/lib/services/ai/aiProvider";
import { ResumeService, type ResumeDraft } from "@/lib/services/ai/resumeService";

export const runtime = "nodejs";

const text = (value: unknown, limit: number): string =>
  typeof value === "string" ? value.trim().slice(0, limit) : "";

function rows(
  value: unknown,
  keys: string[],
): Record<string, string>[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row: Record<string, string> = {};
    for (const key of keys) row[String(key)] = text((entry as Record<string, unknown>)[String(key)], 1200);
    return [row];
  });
}

function makeDraft(value: unknown): ResumeDraft {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const skills = Array.isArray(input.skills)
    ? input.skills.filter((skill): skill is string => typeof skill === "string").map((skill) => skill.trim()).filter(Boolean).slice(0, 40)
    : [];

  return {
    name: text(input.name, 120),
    headline: text(input.headline, 180),
    email: text(input.email, 180),
    phone: text(input.phone, 80),
    location: text(input.location, 160),
    github: text(input.github, 240),
    linkedin: text(input.linkedin, 240),
    portfolio: text(input.portfolio, 240),
    summary: text(input.summary, 1800),
    skills,
    experience: rows(input.experience, ["title", "company", "period", "highlights"]) as unknown as ResumeDraft["experience"],
    education: rows(input.education, ["institution", "degree", "period", "details"]) as unknown as ResumeDraft["education"],
    projects: rows(input.projects, ["title", "tech", "description"]) as unknown as ResumeDraft["projects"],
    certifications: rows(input.certifications, ["name", "issuer", "period"]) as unknown as ResumeDraft["certifications"],
    targetRole: text(input.targetRole, 180),
    jobDescription: text(input.jobDescription, 5000),
    sourceResume: text(input.sourceResume, 14000),
  };
}

export async function POST(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Sign in to generate a resume." }, { status: 401 });
    }
    if (payload.role !== "student") {
      return NextResponse.json({ success: false, message: "Resume creation is available to student accounts." }, { status: 403 });
    }

    const body = await req.json();
    if (JSON.stringify(body).length > 32000) {
      return NextResponse.json({ success: false, message: "Resume input is too large. Keep imported text under 14,000 characters." }, { status: 413 });
    }

    const provider: AiPromptOptions["provider"] = body?.provider === "huggingface" ? "huggingface" : "configured";
    const result = await ResumeService.generate(makeDraft(body?.resume), provider);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Resume generation failed:", error);
    return NextResponse.json({ success: false, message: "Resume generation failed. Please try again." }, { status: 500 });
  }
}
