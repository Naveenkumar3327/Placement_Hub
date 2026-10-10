"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export default function AtsCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");
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

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/15">
              ATS Parser & Compliance Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI-Powered ATS Resume Auditor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Scan your resume against real enterprise Applicant Tracking System benchmarks. Identify missing keywords, measure formatting compliance, and evaluate action verb impact.
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resume Text Input */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
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
            <textarea
              rows={12}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your plain text resume or Markdown content here..."
              className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Job Description (Optional) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
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
