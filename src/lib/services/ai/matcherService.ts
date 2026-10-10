import { AiProvider } from "./aiProvider";

export interface JobMatchResult {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  projectRelevanceScore: number;
  preferenceMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  growthOpportunities: string[];
  explanation: string;
}

export class MatcherService {
  public static async match(student: any, job: any): Promise<JobMatchResult> {
    const studentSkills: string[] = (student?.skills || []).map((s: string) => s.trim().toLowerCase());
    const jobSkills: string[] = (job?.skills || []).map((s: string) => s.trim().toLowerCase());

    // Deterministic skill matching
    const matched: string[] = [];
    const missing: string[] = [];

    for (const js of jobSkills) {
      if (studentSkills.some((ss) => ss.includes(js) || js.includes(ss))) {
        matched.push(js);
      } else {
        missing.push(js);
      }
    }

    // Skills score calculation
    const skillsScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 85;

    // Experience score
    const studentExpCount = student?.experience?.length || 0;
    const requiredExpYears = job?.minExperienceYears || 0;
    let experienceScore = 75;
    if (requiredExpYears === 0) {
      experienceScore = studentExpCount > 0 ? 95 : 85;
    } else {
      experienceScore = Math.min(100, Math.round((studentExpCount / Math.max(1, requiredExpYears)) * 80));
    }

    // Education score
    const studentCgpa = student?.cgpa || 8.0;
    const minCgpa = job?.eligibilityCgpa || 6.0;
    const educationScore = studentCgpa >= minCgpa ? 95 : 65;

    // Project relevance
    const studentProjects = student?.projects || [];
    let projectMatchHits = 0;
    for (const proj of studentProjects) {
      const projTech = (proj.technologies || []).map((t: string) => t.toLowerCase());
      if (jobSkills.some((js) => projTech.some((pt: string) => pt.includes(js) || js.includes(pt)))) {
        projectMatchHits += 1;
      }
    }
    const projectRelevanceScore = studentProjects.length > 0 ? Math.min(95, 60 + projectMatchHits * 15) : 70;

    // Preference match
    let preferenceScore = 80;
    if (student?.workModePreference && job?.workMode) {
      if (student.workModePreference === "any" || student.workModePreference === job.workMode) {
        preferenceScore += 10;
      }
    }
    if (student?.preferredLocations && student.preferredLocations.length > 0 && job?.location) {
      if (student.preferredLocations.some((loc: string) => job.location.toLowerCase().includes(loc.toLowerCase()))) {
        preferenceScore += 10;
      }
    }
    const preferenceMatchScore = Math.min(100, preferenceScore);

    // Weighted Overall Score
    const overallScore = Math.round(
      skillsScore * 0.4 +
      experienceScore * 0.2 +
      educationScore * 0.15 +
      projectRelevanceScore * 0.15 +
      preferenceMatchScore * 0.1
    );

    // Call LLM for personalized explanation
    let aiExplanation = "";
    const prompt = `You are an AI Campus Placement Matchmaking Engine.
Compare candidate Aarav / student with role "${job?.title || 'Engineer'}" at "${job?.companyName || 'Company'}".
Candidate Skills: ${studentSkills.join(", ")}
Required Skills: ${jobSkills.join(", ")}
Overall Match: ${overallScore}%
Matched Skills: ${matched.join(", ")}
Missing Skills: ${missing.join(", ")}

Write a professional 2-3 sentence explanation of why this candidate aligns with the role and what areas to highlight.`;

    try {
      const response = await AiProvider.generateText(prompt, { temperature: 0.3 });
      if (response && response.length > 20) {
        aiExplanation = response.trim();
      }
    } catch (e) {
      // fallback
    }

    if (!aiExplanation) {
      aiExplanation = `Strong profile alignment (${overallScore}% overall). Your background in ${matched.slice(0, 3).join(", ") || "core development"} directly addresses key deliverables for ${job?.title}. Familiarizing yourself with ${missing.slice(0, 2).join(", ") || "supplementary tools"} will optimize your interview readiness.`;
    }

    return {
      overallScore,
      skillsScore,
      experienceScore,
      educationScore,
      projectRelevanceScore,
      preferenceMatchScore,
      matchedSkills: matched.map((s) => s.toUpperCase()),
      missingSkills: missing.map((s) => s.toUpperCase()),
      strengths: [
        `Strong mastery in ${matched.slice(0, 3).join(", ").toUpperCase() || "required technologies"}`,
        `Meets academic eligibility criteria with ${studentCgpa} CGPA (Required: ${minCgpa})`,
        `Demonstrated practical application in project portfolio`,
      ],
      growthOpportunities: missing.length > 0
        ? [`Acquire core proficiency in ${missing.join(", ").toUpperCase()}`]
        : ["Deepen system architectural design and scalability practices"],
      explanation: aiExplanation,
    };
  }
}
