"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  TrendingUp,
  FileText,
  Search,
  Award,
  HelpCircle,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  FileUp,
  MapPin,
} from "lucide-react";

export default function AtsCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobSearchQuery, setJobSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setJobs(data?.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  const sampleResume = `AARAV SHARMA
Bengaluru, India | aarav@example.com | +91 98765 43210 | github.com/aaravsharma

SUMMARY
Full Stack Engineer with strong foundation in React, TypeScript, Next.js, and Node.js. Experienced in architecting scalable microservices, optimizing database queries, and designing responsive frontends.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Python, SQL
- Frontend: React, Next.js, Redux, Tailwind CSS, HTML5, CSS3
- Backend: Node.js, Express, REST APIs, GraphQL
- Databases & Tools: MongoDB, PostgreSQL, Git, Docker, Jest

EXPERIENCE
Frontend Developer Intern | InnovateTech Labs (May 2025 - August 2025)
- Engineered responsive client dashboard using Next.js and Tailwind CSS, increasing mobile user engagement by 28%.
- Optimized asset bundling and implemented client-side query caching, reducing initial page load latency from 2.4s to 1.1s.
- Collaborated in daily agile sprints and authored comprehensive unit tests achieving 85% coverage.

PROJECTS
Smart Campus Placement Suite (Next.js, TypeScript, MongoDB)
- Developed automated resume ATS scoring system and AI mock interview platform serving university students.
- Implemented JWT authentication and role-based permissions for students, recruiters, and admins.

Distributed Order Processing Service (Node.js, Express, Redis, Docker)
- Architected high-throughput asynchronous job worker queue processing 10,000+ simulated events per minute.
- Configured Docker containerization with multi-stage build optimization.

EDUCATION
National Institute of Technology - B.Tech in Computer Science & Engineering (2022 - 2026) | CGPA: 8.8 / 10.0`;

  const sampleJD = `Senior / Graduate Full Stack Software Engineer
Responsibilities:
- Build modern web interfaces with React, Next.js, and TypeScript.
- Design resilient REST APIs and backend services with Node.js and MongoDB.
- Work with Docker containers and AWS cloud infrastructure for automated CI/CD deployments.
- Collaborate with agile cross-functional engineering teams.
Requirements:
- Bachelor's degree in Computer Science or equivalent.
- Proficiency in React, TypeScript, Node.js, and SQL/NoSQL databases.
- Familiarity with Docker, AWS, and Git version control.`;

  const loadSample = () => {
    setResumeText(sampleResume);
    setJobDescription(sampleJD);
    setJobSearchQuery("Full Stack Engineer");
    setErrorMsg("");
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    setUploadedFile(file.name);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("parseOnly", "true");
      const res = await fetch("/api/ai/ats-check", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Couldn't read this resume. Try another file.");
        setUploadedFile("");
      } else {
        setResumeText(data.resumeText);
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Resume upload failed. Please try again.");
      setUploadedFile("");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setErrorMsg("Please paste or load resume content to analyze.");
      return;
    }

    setAnalyzing(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/ai/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to analyze resume.");
        setAnalyzing(false);
        return;
      }

      setResult(data.analysis);
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const excludedJobTerms = new Set([
    "and", "the", "for", "with", "that", "this", "from", "have", "will", "your",
    "you", "our", "are", "work", "role", "skills", "experience", "requirements",
    "responsibilities", "engineer", "developer",
  ]);
  const jobKeywords = Array.from(new Set(
    `${jobSearchQuery} ${jobDescription} ${resumeText}`.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || []
  )).filter((term) => !excludedJobTerms.has(term));
  const rankedJobs = jobs
    .map((job) => {
      const jobText = `${job.title} ${job.description} ${(job.skills || []).join(" ")}`.toLowerCase();
      return { job, score: jobKeywords.filter((term) => jobText.includes(term)).length };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, 4);
  const marketSearchQuery = jobSearchQuery || jobKeywords.slice(0, 4).join(" ") || "software engineer";

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#143b35] text-white shadow-lg">
          <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-[#d9e9a6] sm:block [clip-path:polygon(35%_0,100%_0,100%_100%,0_100%)]" />
          <div className="relative z-10 max-w-3xl space-y-3 px-6 py-7 sm:px-9 sm:py-9">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#d9e9a6]">
              <Sparkles className="h-4 w-4" /> CAREER TOOLKIT / 01
            </span>
            <h1 className="text-2xl font-bold sm:text-3xl">Make your resume work harder.</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-emerald-50/80">
              Upload your resume, add a target job description, and get practical edits plus relevant openings.
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Text Input */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Resume Content / Plaintext</span>
              </label>
              <button
                type="button"
                onClick={loadSample}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors"
              >
                Load Sample Resume
              </button>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-emerald-700/40 bg-emerald-50/60 px-4 py-3 transition-colors hover:bg-emerald-50">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#143b35] text-white">
                  <FileUp className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-slate-800">{uploading ? "Reading resume..." : uploadedFile || "Upload a resume"}</span>
                  <span className="block text-[11px] text-slate-500">PDF, DOCX or TXT · up to 5 MB</span>
                </span>
              </span>
              <span className="shrink-0 text-xs font-bold text-emerald-900">Browse</span>
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleResumeUpload} disabled={uploading} className="sr-only" />
            </label>
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume or Markdown content here..."
              className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Job Description (Optional) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Target Job Description (Optional for Alignment)</span>
              </label>
            </div>
            <textarea
              rows={12}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job responsibilities & requirements to measure job-specific keyword coverage..."
              className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-8 py-3.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 flex items-center space-x-2 transition-all hover:scale-105 disabled:opacity-50 text-sm"
          >
            {analyzing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze ATS Compatibility</span>
              </>
            )}
          </button>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase text-emerald-800">Explore the market</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Find roles that fit your next move</h2>
              <p className="mt-1 text-xs text-slate-500">Search current openings on LinkedIn or Naukri, or browse roles posted in this portal.</p>
            </div>
            <div className="flex flex-col gap-2 sm:w-[min(100%,28rem)] sm:flex-row">
              <input
                value={jobSearchQuery}
                onChange={(event) => setJobSearchQuery(event.target.value)}
                placeholder="Role, skill, or location"
                aria-label="Job search keywords"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/15"
              />
              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(marketSearchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#143b35] px-3 py-2 text-xs font-bold text-white hover:bg-[#20564c]"
              >
                LinkedIn <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <a
                href={`https://www.naukri.com/jobs-in-india?keyword=${encodeURIComponent(marketSearchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Naukri <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          {rankedJobs.length > 0 && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-3 text-xs font-semibold text-slate-700">Open roles in this portal</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {rankedJobs.map(({ job, score }) => (
                  <a key={job._id} href={`/jobs/${job._id}`} className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 hover:border-emerald-700/40 hover:bg-emerald-50/30">
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-slate-900">{job.title}</span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500">
                        <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" />{job.companyName}</span>
                        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                        <span>{score} matching terms</span>
                      </span>
                    </span>
                    <BriefcaseBusiness className="h-4 w-4 shrink-0 text-emerald-800" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Results Showcase */}
        {result && (
          <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Top Score Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="text-center md:border-r border-slate-200 pr-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Overall ATS Score
                </span>
                <div className="flex items-baseline justify-center space-x-1 mt-2">
                  <span className="text-5xl font-black text-indigo-600">
                    {result.overallScore}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/ 100</span>
                </div>
                <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {result.overallScore >= 80 ? "Interview Ready" : "Optimization Recommended"}
                </span>
              </div>

              {/* Breakdown Gauges */}
              <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Keyword Match</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{result.keywordMatch}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Skills Match</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{result.skillsMatch}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Experience Match</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{result.experienceMatch}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-center">
                  <p className="text-xs text-slate-500 font-semibold">Formatting Quality</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{result.formattingScore}%</p>
                </div>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="p-6 rounded-3xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Hiring Auditor Evaluation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {result.summary}
              </p>
            </div>

            {/* Missing Keywords & Action Verbs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Missing or Recommended Keywords</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Adding these keywords to projects or skills boosts ATS search rankings:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.missingKeywords.map((kw: string) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Action Verb Impact Analysis</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Strong verbs found: {result.actionVerbQuality.strongVerbsFound.join(", ") || "None"}
                </p>
                <div className="pt-1">
                  <p className="text-[11px] font-semibold text-slate-600 mb-1">
                    Suggested high-impact verbs to incorporate:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.actionVerbQuality.suggestedVerbs.map((v: string) => (
                      <span
                        key={v}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Improvement Suggestions */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Actionable Optimization Recommendations
              </h3>

              <div className="space-y-3">
                {result.suggestions.map((sugg: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                        [{sugg.category}] {sugg.issue}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          sugg.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : sugg.severity === "medium"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {sugg.severity} priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{sugg.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 text-center italic">
              {result.disclaimer}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
