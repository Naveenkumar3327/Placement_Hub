import { AiProvider, type AiPromptOptions } from "./aiProvider";

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  highlights: string;
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  period: string;
  details: string;
}

export interface ResumeProject {
  title: string;
  tech: string;
  description: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  period: string;
}

export interface ResumeDraft {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  targetRole: string;
  jobDescription: string;
  sourceResume: string;
}

const cleanText = (value: unknown, fallback = "", maxLength = 1200): string => {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : fallback;
};

function cleanItems<T extends object>(
  value: unknown,
  keys: (keyof T)[],
  fallback: T[],
): T[] {
  if (!Array.isArray(value)) return fallback;

  const cleaned = value.slice(0, 12).flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const row: Record<string, string> = {};
    for (const key of keys) row[String(key)] = cleanText((entry as Record<string, unknown>)[String(key)], "", 1200);
    if (!Object.values(row).some(Boolean)) return [];
    return [row as unknown as T];
  });
  if (!cleaned.length) return fallback;
  const preserved = fallback.map((item, index) => {
    const generatedItem = cleaned[index] as Record<string, unknown> | undefined;
    const generatedFacts = Object.fromEntries(
      Object.entries(generatedItem || {}).filter(([, value]) => typeof value === "string" && value.trim()),
    );
    return { ...item, ...generatedFacts };
  });
  return [...preserved, ...cleaned.slice(fallback.length)];
}

function parseModelResponse(text: string): Record<string, unknown> | null {
  const withoutFence = text.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "");
  const start = withoutFence.indexOf("{");
  const end = withoutFence.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  try {
    const parsed: unknown = JSON.parse(withoutFence.slice(start, end + 1));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function localDraft(input: ResumeDraft): ResumeDraft {
  const parsedSections: Record<string, string[]> = {};
  const sectionHeadings: Record<string, RegExp> = {
    summary: /^(professional\s+)?(summary|profile|objective)$/i,
    skills: /^(technical\s+)?skills$|^competencies$/i,
    experience: /^(professional\s+|work\s+)?(experience|employment(\s+history)?)$/i,
    education: /^(education|academic\s+background)$/i,
    projects: /^(selected\s+)?projects(\s+and\s+experience)?$/i,
    certifications: /^(certifications|certificates|licenses)$/i,
  };
  let activeSection = "";
  const sourceLines = input.sourceResume.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of sourceLines) {
    const heading = Object.entries(sectionHeadings).find(([, expression]) => expression.test(line));
    if (heading) {
      activeSection = heading[0];
      parsedSections[activeSection] ||= [];
      continue;
    }
    if (activeSection) (parsedSections[activeSection] ||= []).push(line.replace(/^[•*\-–]\s*/, ""));
  }

  const importedText = (section: string) => (parsedSections[section] || []).join("\n").trim();
  const email = input.sourceResume.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = input.sourceResume.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() || "";
  const firstLine = sourceLines.find((line) => !line.includes("@") && !/^(resume|curriculum vitae|cv)$/i.test(line)) || "";
  const importedName = firstLine.split(/[|•]/)[0].trim();
  const importedSkills = importedText("skills").split(/[,;|•\n]/).map((skill) => skill.trim()).filter(Boolean).slice(0, 40);
  const imported = input.sourceResume.trim().length > 0;
  const baseExperience = input.experience.length ? input.experience : importedText("experience") ? [{ title: "", company: "", period: "", highlights: importedText("experience") }] : [];
  const baseEducation = input.education.length ? input.education : importedText("education") ? [{ institution: "", degree: "", period: "", details: importedText("education") }] : [];
  const baseProjects = input.projects.length ? input.projects : importedText("projects") ? [{ title: "", tech: "", description: importedText("projects") }] : [];
  const baseCertifications = input.certifications.length ? input.certifications : importedText("certifications") ? [{ name: importedText("certifications"), issuer: "", period: "" }] : [];
  const skills = (input.skills.length ? input.skills : importedSkills).filter(Boolean).slice(0, 40);
  const role = input.targetRole || input.headline;
  const summaryFacts = [
    role ? `Targeting ${role}` : "",
    baseExperience.length ? `${baseExperience.length} ${baseExperience.length === 1 ? "work experience" : "work experiences"}` : "",
    skills.length ? `Skills include ${skills.slice(0, 8).join(", ")}` : "",
    baseEducation[0] ? `Education includes ${[baseEducation[0].degree, baseEducation[0].institution].filter(Boolean).join(" at ")}` : "",
  ].filter(Boolean);

  return {
    ...input,
    name: input.name || (imported ? importedName : ""),
    email: input.email || email,
    phone: input.phone || phone,
    headline: input.headline || role,
    summary: input.summary || importedText("summary") || (summaryFacts.length ? `${summaryFacts.join(". ")}.` : ""),
    skills,
    experience: baseExperience,
    education: baseEducation,
    projects: baseProjects,
    certifications: baseCertifications,
  };
}

export class ResumeService {
  public static async generate(
    input: ResumeDraft,
    provider: AiPromptOptions["provider"] = "configured",
  ): Promise<{ resume: ResumeDraft; modelUsed: string }> {
    const model = AiProvider.getModelLabel(provider);
    const prompt = `Create an editable, ATS-friendly resume using only the candidate's supplied facts. You may improve clarity, grammar, and keyword alignment for the target role, but never invent employers, schools, dates, skills, credentials, responsibilities, or numeric results. Keep contact details exactly as supplied when present. Leave unknown facts blank. Return only valid JSON matching the schema below.

Target role: ${input.targetRole || "Not specified"}
Target job description:
"""${input.jobDescription.slice(0, 5000)}"""

Candidate form data:
${JSON.stringify({ ...input, sourceResume: undefined }, null, 2)}

Imported resume or template text (may be empty):
"""${input.sourceResume.slice(0, 14000)}"""

Return these keys only, with the same shape and field names: {
  "name": "", "headline": "", "email": "", "phone": "", "location": "", "github": "", "linkedin": "", "portfolio": "",
  "summary": "2-3 concise factual sentences", "skills": ["skill"],
  "experience": [{"title":"", "company":"", "period":"", "highlights":""}],
  "education": [{"institution":"", "degree":"", "period":"", "details":""}],
  "projects": [{"title":"", "tech":"", "description":""}],
  "certifications": [{"name":"", "issuer":"", "period":""}],
  "targetRole": "", "jobDescription": "", "sourceResume": ""
}
Use short, scannable experience highlights. Preserve each role, project, education item, and certification that appears in the supplied data. Convert clearly labeled entries from the imported resume into the matching fields. Do not add a field or section for which there is no supporting information. Keep targetRole and jobDescription unchanged. Return JSON only.`;

    const response = await AiProvider.generateText(prompt, {
      provider,
      temperature: 0.2,
      maxTokens: 2400,
      jsonMode: true,
      systemPrompt: "You are a careful resume editor. Accuracy matters more than persuasive wording. Never fabricate candidate facts.",
    });
    const generated = response ? parseModelResponse(response) : null;

    if (!generated) return { resume: localDraft(input), modelUsed: "Local ATS writer" };

    const modelSkills = Array.isArray(generated.skills)
      ? generated.skills.filter((skill): skill is string => typeof skill === "string").map((skill) => skill.trim()).filter(Boolean).slice(0, 40)
      : input.skills;
    const skills = modelSkills.length ? modelSkills : input.skills;

    return {
      resume: {
        name: cleanText(generated.name, input.name, 120),
        headline: cleanText(generated.headline, input.headline || input.targetRole, 180),
        email: cleanText(generated.email, input.email, 180),
        phone: cleanText(generated.phone, input.phone, 80),
        location: cleanText(generated.location, input.location, 160),
        github: cleanText(generated.github, input.github, 240),
        linkedin: cleanText(generated.linkedin, input.linkedin, 240),
        portfolio: cleanText(generated.portfolio, input.portfolio, 240),
        summary: cleanText(generated.summary, input.summary, 1800),
        skills,
        experience: cleanItems<ResumeExperience>(generated.experience, ["title", "company", "period", "highlights"], input.experience),
        education: cleanItems<ResumeEducation>(generated.education, ["institution", "degree", "period", "details"], input.education),
        projects: cleanItems<ResumeProject>(generated.projects, ["title", "tech", "description"], input.projects),
        certifications: cleanItems<ResumeCertification>(generated.certifications, ["name", "issuer", "period"], input.certifications),
        targetRole: input.targetRole,
        jobDescription: input.jobDescription,
        sourceResume: input.sourceResume,
      },
      modelUsed: model,
    };
  }
}
