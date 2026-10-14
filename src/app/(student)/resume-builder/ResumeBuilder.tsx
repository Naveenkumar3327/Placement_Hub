"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Plus,
  Printer,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Sidebar } from "@/components/ui/Sidebar";
import type {
  ResumeCertification,
  ResumeDraft,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
} from "@/lib/services/ai/resumeService";

type TemplateStyle = "clean" | "classic" | "minimal";
type ProviderChoice = "configured" | "huggingface";

const EMPTY_RESUME: ResumeDraft = {
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  github: "",
  linkedin: "",
  portfolio: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  targetRole: "",
  jobDescription: "",
  sourceResume: "",
};

const smallFieldClass = "w-full rounded-md border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

function fromProfile(profile: Record<string, any>): ResumeDraft {
  const education: ResumeEducation[] = (profile.education || []).map((item: any) => ({
    institution: item.institution || "",
    degree: [item.degree, item.fieldOfStudy].filter(Boolean).join(" in "),
    period: [item.startYear, item.endYear].filter(Boolean).join(" - "),
    details: item.grade || "",
  }));
  const experience: ResumeExperience[] = (profile.experience || []).map((item: any) => ({
    title: item.title || "",
    company: item.company || "",
    period: [item.startDate, item.endDate || (item.current ? "Present" : "")].filter(Boolean).join(" - "),
    highlights: item.description || "",
  }));
  const projects: ResumeProject[] = (profile.projects || []).map((item: any) => ({
    title: item.title || "",
    tech: Array.isArray(item.technologies) ? item.technologies.join(", ") : "",
    description: item.description || "",
  }));
  const certifications: ResumeCertification[] = (profile.certifications || []).map((item: any) => ({
    name: item.name || "",
    issuer: item.issuer || "",
    period: item.issueDate || "",
  }));

  return {
    ...EMPTY_RESUME,
    name: profile.name || "",
    headline: profile.headline || "",
    email: profile.email || "",
    phone: profile.phone || "",
    location: profile.location || "",
    github: profile.socialLinks?.github || "",
    linkedin: profile.socialLinks?.linkedin || "",
    portfolio: profile.socialLinks?.portfolio || "",
    summary: profile.bio || "",
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    education,
    experience,
    projects,
    certifications,
  };
}

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character] || character);
}

function resumeAsWordHtml(resume: ResumeDraft): string {
  const paragraph = (value: string) => value ? `<p>${escapeHtml(value)}</p>` : "";
  const heading = (value: string) => `<h2>${escapeHtml(value)}</h2>`;
  const experience = resume.experience.filter((item) => item.title || item.company || item.highlights)
    .map((item) => `<div class="entry"><p><strong>${escapeHtml([item.title, item.company].filter(Boolean).join(" | "))}</strong>${item.period ? ` | ${escapeHtml(item.period)}` : ""}</p>${paragraph(item.highlights)}</div>`).join("");
  const education = resume.education.filter((item) => item.institution || item.degree || item.details)
    .map((item) => `<div class="entry"><p><strong>${escapeHtml(item.institution)}</strong>${item.period ? ` | ${escapeHtml(item.period)}` : ""}</p>${paragraph(item.degree)}${paragraph(item.details)}</div>`).join("");
  const projects = resume.projects.filter((item) => item.title || item.description)
    .map((item) => `<div class="entry"><p><strong>${escapeHtml(item.title)}</strong>${item.tech ? ` | ${escapeHtml(item.tech)}` : ""}</p>${paragraph(item.description)}</div>`).join("");
  const certifications = resume.certifications.filter((item) => item.name || item.issuer)
    .map((item) => `<p><strong>${escapeHtml(item.name)}</strong>${item.issuer ? ` | ${escapeHtml(item.issuer)}` : ""}${item.period ? ` | ${escapeHtml(item.period)}` : ""}</p>`).join("");
  const contacts = [resume.email, resume.phone, resume.location, resume.github, resume.linkedin, resume.portfolio].filter(Boolean).map(escapeHtml).join(" | ");

  return `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(resume.name || "Resume")}</title><style>body{font-family:Arial,sans-serif;color:#1f2937;max-width:760px;margin:40px auto;line-height:1.45;font-size:11pt}h1{font-size:22pt;margin:0}h2{font-size:11pt;text-transform:uppercase;border-bottom:1px solid #777;padding-bottom:3px;margin:20px 0 7px}.contact{margin-top:7px;color:#444}.entry{margin:8px 0}.entry p{margin:3px 0}</style></head><body><h1>${escapeHtml(resume.name)}</h1>${paragraph(resume.headline)}<p class="contact">${contacts}</p>${resume.summary ? `${heading("Professional Summary")}${paragraph(resume.summary)}` : ""}${resume.skills.length ? `${heading("Skills")}${paragraph(resume.skills.join(", "))}` : ""}${experience ? `${heading("Experience")}${experience}` : ""}${education ? `${heading("Education")}${education}` : ""}${projects ? `${heading("Projects")}${projects}` : ""}${certifications ? `${heading("Certifications")}${certifications}` : ""}</body></html>`;
}

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeDraft>(EMPTY_RESUME);
  const [template, setTemplate] = useState<TemplateStyle>("minimal");
  const [provider, setProvider] = useState<ProviderChoice>("configured");
  const [modelUsed, setModelUsed] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [importing, setImporting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadDraft = async () => {
      let initial = EMPTY_RESUME;
      try {
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const data = await response.json();
          if (data.profile) initial = fromProfile(data.profile);
        }
      } catch {
        // The browser-saved draft below remains available without a profile API.
      }

      try {
        const saved = window.localStorage.getItem("campusai-resume-draft");
        if (saved) initial = { ...initial, ...JSON.parse(saved) };
      } catch {
        window.localStorage.removeItem("campusai-resume-draft");
      }

      if (active) {
        setResume(initial);
        setLoadingProfile(false);
      }
    };
    void loadDraft();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!loadingProfile) {
      window.localStorage.setItem("campusai-resume-draft", JSON.stringify(resume));
    }
  }, [resume, loadingProfile]);

  const update = <K extends keyof ResumeDraft>(key: K, value: ResumeDraft[K]) => {
    setResume((current) => ({ ...current, [key]: value }));
  };

  const updateExperience = (index: number, key: keyof ResumeExperience, value: string) => {
    setResume((current) => ({
      ...current,
      experience: current.experience.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };
  const updateEducation = (index: number, key: keyof ResumeEducation, value: string) => {
    setResume((current) => ({
      ...current,
      education: current.education.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };
  const updateProject = (index: number, key: keyof ResumeProject, value: string) => {
    setResume((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };
  const updateCertification = (index: number, key: keyof ResumeCertification, value: string) => {
    setResume((current) => ({
      ...current,
      certifications: current.certifications.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const generateResume = async () => {
    setError("");
    setNotice("");
    if (!resume.name.trim() && !resume.sourceResume.trim()) {
      setError("Add your name and experience, or import a resume before generating.");
      return;
    }
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, provider }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not generate the resume.");
      setResume({ ...EMPTY_RESUME, ...data.resume });
      setModelUsed(data.modelUsed || "Resume assistant");
      setNotice("Resume draft created. Review the wording and edit any field before downloading.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not generate the resume.");
    } finally {
      setGenerating(false);
    }
  };

  const importResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setNotice("");
    setImporting(true);
    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("parseOnly", "true");
      const response = await fetch("/api/ai/ats-check", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not read that document.");
      update("sourceResume", String(data.resumeText || "").slice(0, 14000));
      setNotice(`${file.name} imported. Generate a draft to organize its content into editable sections.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not read that document.");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const content = `FULL NAME\nTarget role / professional headline\nEmail | Phone | City | LinkedIn | GitHub | Portfolio\n\nPROFESSIONAL SUMMARY\n[2-3 factual sentences about your experience and strengths]\n\nSKILLS\n[Relevant skills separated by commas]\n\nEXPERIENCE\nJob title | Company | Dates\n- Achievement, responsibility, or project outcome\n\nEDUCATION\nDegree | Institution | Dates\nGrade or relevant detail\n\nPROJECTS\nProject name | Technologies\n- What you built and the outcome\n\nCERTIFICATIONS\nCertification | Issuer | Date\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ats-resume-template.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const downloadWord = () => {
    const url = URL.createObjectURL(new Blob([resumeAsWordHtml(resume)], { type: "application/msword;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(resume.name || "resume").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "resume"}.doc`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const previewStyle = template === "classic"
    ? "font-serif text-slate-900"
    : template === "minimal"
      ? "font-mono text-slate-900"
      : "font-sans text-slate-800";

  return (
    <div className="flex min-h-screen flex-1 bg-slate-50">
      <Sidebar role="student" />
      <main className="mx-auto flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <header className="no-print flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
              <FileText className="h-5 w-5 text-emerald-800" /> ATS Resume Builder
            </h1>
            <p className="mt-1 text-xs text-slate-600">Build, edit, and download a simple resume that applicant tracking systems can read.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadTemplate} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" /> Blank template
            </button>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-emerald-800 px-3 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-50">
              <Printer className="h-4 w-4" /> Save as PDF
            </button>
            <button type="button" onClick={downloadWord} className="inline-flex items-center gap-2 rounded-lg bg-emerald-900 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800">
              <Download className="h-4 w-4" /> Download Word file
            </button>
          </div>
        </header>

        <div className="resume-builder-layout grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(370px,0.92fr)]">
          <section className="no-print space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Start with your information</h2>
                  <p className="mt-1 text-xs text-slate-500">We prefilled this from your profile when available. Your draft autosaves in this browser.</p>
                </div>
                <a href="/profile" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline">
                  Edit profile <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {loadingProfile ? <p className="mt-4 text-xs text-slate-500">Loading profile…</p> : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">Full name<input className={`${smallFieldClass} mt-1`} value={resume.name} onChange={(event) => update("name", event.target.value)} placeholder="Your name" /></label>
                <label className="text-xs font-semibold text-slate-700">Target role<input className={`${smallFieldClass} mt-1`} value={resume.targetRole} onChange={(event) => update("targetRole", event.target.value)} placeholder="e.g. Data Analyst" /></label>
                <label className="text-xs font-semibold text-slate-700">Professional headline<input className={`${smallFieldClass} mt-1`} value={resume.headline} onChange={(event) => update("headline", event.target.value)} placeholder="Role or specialization" /></label>
                <label className="text-xs font-semibold text-slate-700">Email<input type="email" className={`${smallFieldClass} mt-1`} value={resume.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label>
                <label className="text-xs font-semibold text-slate-700">Phone<input className={`${smallFieldClass} mt-1`} value={resume.phone} onChange={(event) => update("phone", event.target.value)} placeholder="Phone number" /></label>
                <label className="text-xs font-semibold text-slate-700">City / location<input className={`${smallFieldClass} mt-1`} value={resume.location} onChange={(event) => update("location", event.target.value)} placeholder="City, Country" /></label>
                <label className="text-xs font-semibold text-slate-700">LinkedIn<input className={`${smallFieldClass} mt-1`} value={resume.linkedin} onChange={(event) => update("linkedin", event.target.value)} placeholder="linkedin.com/in/you" /></label>
                <label className="text-xs font-semibold text-slate-700">GitHub<input className={`${smallFieldClass} mt-1`} value={resume.github} onChange={(event) => update("github", event.target.value)} placeholder="github.com/you" /></label>
                <label className="text-xs font-semibold text-slate-700">Portfolio<input className={`${smallFieldClass} mt-1`} value={resume.portfolio} onChange={(event) => update("portfolio", event.target.value)} placeholder="your-site.com" /></label>
              </div>
              <label className="mt-3 block text-xs font-semibold text-slate-700">Professional summary<textarea rows={3} className={`${smallFieldClass} mt-1`} value={resume.summary} onChange={(event) => update("summary", event.target.value)} placeholder="A short, factual summary of your background and strengths" /></label>
              <label className="mt-3 block text-xs font-semibold text-slate-700">Skills <span className="font-normal text-slate-500">(comma separated)</span><input className={`${smallFieldClass} mt-1`} value={resume.skills.join(", ")} onChange={(event) => update("skills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} placeholder="Python, SQL, project management" /></label>
              <label className="mt-3 block text-xs font-semibold text-slate-700">Target job description <span className="font-normal text-slate-500">(optional, for relevant wording)</span><textarea rows={3} className={`${smallFieldClass} mt-1`} value={resume.jobDescription} onChange={(event) => update("jobDescription", event.target.value)} placeholder="Paste a job description to tailor your resume wording" /></label>
            </div>

            <SectionEditor title="Experience" onAdd={() => update("experience", [...resume.experience, { title: "", company: "", period: "", highlights: "" }])}>
              {resume.experience.map((item, index) => <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
                <input aria-label="Job title" className={smallFieldClass} value={item.title} onChange={(event) => updateExperience(index, "title", event.target.value)} placeholder="Job title" />
                <div className="flex gap-2"><input aria-label="Company" className={smallFieldClass} value={item.company} onChange={(event) => updateExperience(index, "company", event.target.value)} placeholder="Company" /><button type="button" aria-label="Remove experience" onClick={() => update("experience", resume.experience.filter((_, row) => row !== index))} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
                <input aria-label="Experience dates" className={`${smallFieldClass} sm:col-span-2`} value={item.period} onChange={(event) => updateExperience(index, "period", event.target.value)} placeholder="Dates" />
                <textarea aria-label="Experience achievements" rows={3} className={`${smallFieldClass} sm:col-span-2`} value={item.highlights} onChange={(event) => updateExperience(index, "highlights", event.target.value)} placeholder="Responsibilities and achievements. Include numbers only when they are accurate." />
              </div>)}
            </SectionEditor>

            <SectionEditor title="Education" onAdd={() => update("education", [...resume.education, { institution: "", degree: "", period: "", details: "" }])}>
              {resume.education.map((item, index) => <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
                <input aria-label="Institution" className={smallFieldClass} value={item.institution} onChange={(event) => updateEducation(index, "institution", event.target.value)} placeholder="Institution" />
                <div className="flex gap-2"><input aria-label="Degree" className={smallFieldClass} value={item.degree} onChange={(event) => updateEducation(index, "degree", event.target.value)} placeholder="Degree / field of study" /><button type="button" aria-label="Remove education" onClick={() => update("education", resume.education.filter((_, row) => row !== index))} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
                <input aria-label="Education dates" className={smallFieldClass} value={item.period} onChange={(event) => updateEducation(index, "period", event.target.value)} placeholder="Dates" />
                <input aria-label="Education details" className={smallFieldClass} value={item.details} onChange={(event) => updateEducation(index, "details", event.target.value)} placeholder="Grade or relevant detail" />
              </div>)}
            </SectionEditor>

            <SectionEditor title="Projects" onAdd={() => update("projects", [...resume.projects, { title: "", tech: "", description: "" }])}>
              {resume.projects.map((item, index) => <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
                <input aria-label="Project name" className={smallFieldClass} value={item.title} onChange={(event) => updateProject(index, "title", event.target.value)} placeholder="Project name" />
                <div className="flex gap-2"><input aria-label="Technologies" className={smallFieldClass} value={item.tech} onChange={(event) => updateProject(index, "tech", event.target.value)} placeholder="Technologies" /><button type="button" aria-label="Remove project" onClick={() => update("projects", resume.projects.filter((_, row) => row !== index))} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
                <textarea aria-label="Project description" rows={3} className={`${smallFieldClass} sm:col-span-2`} value={item.description} onChange={(event) => updateProject(index, "description", event.target.value)} placeholder="What you built and what it does" />
              </div>)}
            </SectionEditor>

            <SectionEditor title="Certifications" onAdd={() => update("certifications", [...resume.certifications, { name: "", issuer: "", period: "" }])}>
              {resume.certifications.map((item, index) => <div key={index} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-3">
                <input aria-label="Certification name" className={smallFieldClass} value={item.name} onChange={(event) => updateCertification(index, "name", event.target.value)} placeholder="Certification" />
                <input aria-label="Certification issuer" className={smallFieldClass} value={item.issuer} onChange={(event) => updateCertification(index, "issuer", event.target.value)} placeholder="Issuer" />
                <div className="flex gap-2"><input aria-label="Certification date" className={smallFieldClass} value={item.period} onChange={(event) => updateCertification(index, "period", event.target.value)} placeholder="Date" /><button type="button" aria-label="Remove certification" onClick={() => update("certifications", resume.certifications.filter((_, row) => row !== index))} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div>
              </div>)}
            </SectionEditor>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Upload className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-slate-900">Import a downloaded template or existing resume</h2>
                  <p className="mt-1 text-xs text-slate-500">Upload a text based PDF, Word document, or text file. The extracted text can be organized by the selected AI model.</p>
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    <Upload className="h-4 w-4" /> {importing ? "Reading file…" : "Choose PDF, DOCX, or TXT"}
                    <input className="sr-only" type="file" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onChange={importResume} disabled={importing} />
                  </label>
                  <textarea className={`${smallFieldClass} mt-3`} rows={4} value={resume.sourceResume} onChange={(event) => update("sourceResume", event.target.value)} placeholder="Or paste text from a downloaded template here" />
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <a className="font-semibold text-emerald-800 underline" href="https://word.cloud.microsoft/create/en/ats-templates/" target="_blank" rel="noreferrer">Microsoft ATS templates <ExternalLink className="inline h-3 w-3" /></a>
                    <a className="font-semibold text-emerald-800 underline" href="https://www.jobscan.co/resume-templates/ats-templates" target="_blank" rel="noreferrer">Jobscan downloadable templates <ExternalLink className="inline h-3 w-3" /></a>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-900/10 bg-emerald-50/70 p-5">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="text-xs font-bold text-slate-700">Generation model<select value={provider} onChange={(event) => setProvider(event.target.value as ProviderChoice)} className={`${smallFieldClass} mt-1`}><option value="configured">Configured GenAI (AI_PROVIDER setting)</option><option value="huggingface">Open model: Qwen 2.5 7B via Hugging Face</option></select></label>
                <button type="button" onClick={generateResume} disabled={generating} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
                  <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate ATS resume"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-600">Generation uses the selected model when its API key is configured and falls back to a local writer otherwise. Resume details are sent to the selected model service when generation runs.</p>
            </section>

            {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</p> : null}
            {notice ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">{notice}{modelUsed ? <span className="ml-1 font-semibold">Model: {modelUsed}.</span> : null}</p> : null}
          </section>

          <section className="resume-preview-column min-w-0">
            <div className="resume-preview-sticky sticky top-4 space-y-3">
              <div className="no-print flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <span className="text-xs font-bold text-slate-800">Live preview</span>
                <div className="flex rounded-lg bg-slate-100 p-1" aria-label="Resume template style">
                  {([["minimal", "ATS"], ["clean", "Clean"], ["classic", "Classic"]] as [TemplateStyle, string][]).map(([key, label]) => <button key={key} type="button" onClick={() => setTemplate(key)} className={`rounded-md px-2.5 py-1 text-[11px] font-semibold ${template === key ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600"}`}>{label}</button>)}
                </div>
              </div>
              <ResumePreview resume={resume} className={previewStyle} template={template} />
            </div>
          </section>
        </div>

        <section className="no-print rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
          <p><strong>ATS tips:</strong> Use standard section names, keep the layout to one column, and review the final PDF or Word document. No template can guarantee the same result across every employer’s ATS.</p>
        </section>
      </main>
    </div>
  );
}

function SectionEditor({ title, onAdd, children }: { title: string; onAdd: () => void; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-50"><Plus className="h-3.5 w-3.5" /> Add</button>
    </div>
    <div className="space-y-2">{children}</div>
  </section>;
}

function ResumePreview({ resume, className, template }: { resume: ResumeDraft; className: string; template: TemplateStyle }) {
  const contact = [resume.email, resume.phone, resume.location, resume.linkedin, resume.github, resume.portfolio].filter(Boolean);
  const headingStyle = template === "minimal" ? "border-b border-slate-500 pb-1" : template === "classic" ? "border-b border-slate-300 pb-1 text-center" : "border-b-2 border-emerald-900 pb-1 text-emerald-950";
  const sectionStyle = template === "minimal" ? "mb-1 font-bold uppercase" : "mb-1 font-bold uppercase tracking-wide";
  const section = (title: string, body: ReactNode) => <section className="mt-5 break-inside-avoid" key={title}><h2 className={`${sectionStyle} text-[10px]`}>{title}</h2>{body}</section>;
  return <article className={`resume-page min-h-[850px] border border-slate-200 bg-white px-7 py-8 shadow-lg sm:px-10 ${className}`}>
    <header className={`${headingStyle} pb-3`}>
      <h1 className="text-2xl font-bold">{resume.name || "Your name"}</h1>
      {resume.headline ? <p className="mt-1 text-sm">{resume.headline}</p> : null}
      {contact.length ? <p className="mt-2 break-words text-[10px] leading-relaxed text-slate-600">{contact.join(" | ")}</p> : null}
    </header>
    {resume.summary ? section("Professional Summary", <p className="whitespace-pre-line text-[11px] leading-relaxed">{resume.summary}</p>) : null}
    {resume.skills.length ? section("Skills", <p className="text-[11px] leading-relaxed">{resume.skills.join(", ")}</p>) : null}
    {resume.experience.filter((item) => item.title || item.company || item.highlights).length ? section("Experience", <div className="space-y-3">{resume.experience.filter((item) => item.title || item.company || item.highlights).map((item, index) => <div key={index} className="break-inside-avoid">
      <div className="flex flex-wrap justify-between gap-x-3 text-[11px]"><strong>{[item.title, item.company].filter(Boolean).join(" | ")}</strong><span className="text-slate-600">{item.period}</span></div><p className="mt-0.5 whitespace-pre-line text-[11px] leading-relaxed">{item.highlights}</p>
    </div>)}</div>) : null}
    {resume.education.filter((item) => item.institution || item.degree || item.details).length ? section("Education", <div className="space-y-2">{resume.education.filter((item) => item.institution || item.degree || item.details).map((item, index) => <div key={index} className="break-inside-avoid">
      <div className="flex flex-wrap justify-between gap-x-3 text-[11px]"><strong>{item.institution}</strong><span className="text-slate-600">{item.period}</span></div><p className="text-[11px]">{item.degree}</p>{item.details ? <p className="text-[10px] text-slate-600">{item.details}</p> : null}
    </div>)}</div>) : null}
    {resume.projects.filter((item) => item.title || item.description).length ? section("Projects", <div className="space-y-2">{resume.projects.filter((item) => item.title || item.description).map((item, index) => <div key={index} className="break-inside-avoid">
      <div className="flex flex-wrap justify-between gap-x-3 text-[11px]"><strong>{item.title}</strong><span className="text-slate-600">{item.tech}</span></div><p className="mt-0.5 whitespace-pre-line text-[11px] leading-relaxed">{item.description}</p>
    </div>)}</div>) : null}
    {resume.certifications.filter((item) => item.name || item.issuer).length ? section("Certifications", <ul className="space-y-1 text-[11px]">{resume.certifications.filter((item) => item.name || item.issuer).map((item, index) => <li key={index}>{[item.name, item.issuer, item.period].filter(Boolean).join(" | ")}</li>)}</ul>) : null}
  </article>;
}
