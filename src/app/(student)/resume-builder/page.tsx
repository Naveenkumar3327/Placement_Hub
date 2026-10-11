"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  FileText,
  Printer,
  Download,
  Layout,
  Plus,
  Trash2,
  Check,
  Eye,
  Sparkles,
  Share2,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern");
  const [resumeData, setResumeData] = useState({
    name: "Aarav Sharma",
    headline: "Full Stack Engineer & Cloud Developer",
    email: "aarav@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    github: "github.com/aaravsharma",
    linkedin: "linkedin.com/in/aaravsharma",
    summary:
      "Results-oriented computer science graduate with strong foundations in React, Next.js, Node.js, and cloud architectures. Proven experience building high-throughput web applications and optimizing system performance.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS", "Tailwind CSS"],
    education: [
      {
        institution: "National Institute of Technology",
        degree: "B.Tech in Computer Science & Engineering",
        year: "2022 - 2026",
        score: "CGPA: 8.8 / 10.0",
      },
    ],
    experience: [
      {
        title: "Frontend Developer Intern",
        company: "InnovateTech Labs",
        period: "May 2025 - Aug 2025",
        highlights:
          "Architected real-time analytics dashboard with Next.js and Tailwind CSS; reduced initial page load times by 35% through lazy asset loading and server caching.",
      },
    ],
    projects: [
      {
        title: "Campus Placement Platform",
        tech: "Next.js, TypeScript, MongoDB, LLM APIs",
        description:
          "Engineered full-stack recruitment suite with automated ATS score checker and mock interview simulator serving over 500+ candidates.",
      },
      {
        title: "Distributed Microservices Order Engine",
        tech: "Node.js, Redis, Docker, RabbitMQ",
        description:
          "Developed high-concurrency order processing engine handling 12,000 requests/sec with asynchronous worker queues.",
      },
    ],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <div className="no-print">
        <Sidebar role="student" />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Controls Toolbar (Hidden in print) */}
        <div className="no-print p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Interactive ATS Resume Builder</span>
            </h1>
            <p className="text-xs text-slate-500">
              Customize professional templates and export an ATS-compliant PDF
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {/* Template Selector */}
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setTemplate("modern")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  template === "modern"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Modern
              </button>
              <button
                type="button"
                onClick={() => setTemplate("classic")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  template === "classic"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => setTemplate("minimal")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  template === "minimal"
                    ? "bg-white text-indigo-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Minimal ATS
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* 2-Column Interface: Left Form Editor (No-print) | Right Live Resume (Print-area) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Sidebar (5 cols, hidden in print) */}
          <div className="no-print lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Personal Particulars
              </h2>
              <div className="space-y-2">
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })}
                  placeholder="Full Name"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
                <input
                  type="text"
                  value={resumeData.headline}
                  onChange={(e) => setResumeData({ ...resumeData, headline: e.target.value })}
                  placeholder="Headline"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                  />
                  <input
                    type="text"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                    placeholder="Phone"
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Executive Summary
              </h2>
              <textarea
                rows={3}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full text-xs p-3 rounded-lg border border-slate-200"
              />
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Technical Skills (Comma Separated)
              </h2>
              <input
                type="text"
                value={resumeData.skills.join(", ")}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          {/* Live Document Preview (7 cols, becomes full width on print) */}
          <div className="lg:col-span-7 print-area bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-slate-800 min-h-[900px]">
            {/* TEMPLATE 1: MODERN TECH */}
            {template === "modern" && (
              <div className="space-y-6">
                <header className="border-b-2 border-indigo-600 pb-4">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {resumeData.name}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                    {resumeData.headline}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2 font-medium">
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                    <span>•</span>
                    <span>{resumeData.github}</span>
                  </div>
                </header>

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 mb-1.5">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{resumeData.summary}</p>
                </section>

                <section>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900 mb-2">
                    Core Technical Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.map((s) => (
                      <span
                        key={s}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900">
                    Professional Experience
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">
                          {exp.title} — <span className="font-semibold text-indigo-600">{exp.company}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{exp.period}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{exp.highlights}</p>
                    </div>
                  ))}
                </section>

                <section className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900">
                    Featured Software Projects
                  </h2>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-xs text-slate-900">{proj.title}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold">{proj.tech}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </section>

                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-900">
                    Education
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{edu.institution}</p>
                        <p className="text-slate-600 text-[11px]">{edu.degree}</p>
                      </div>
                      <div className="text-right text-[11px]">
                        <p className="font-semibold text-slate-700">{edu.score}</p>
                        <p className="text-slate-400">{edu.year}</p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {/* TEMPLATE 2: CLASSIC EXECUTIVE */}
            {template === "classic" && (
              <div className="space-y-6 font-serif">
                <header className="text-center border-b border-slate-300 pb-4 space-y-1">
                  <h1 className="text-2xl font-bold tracking-wide text-slate-900 uppercase">
                    {resumeData.name}
                  </h1>
                  <p className="text-xs italic text-slate-600 font-sans">{resumeData.headline}</p>
                  <p className="text-xs text-slate-500 font-sans">
                    {resumeData.location} | {resumeData.email} | {resumeData.phone} | {resumeData.github}
                  </p>
                </header>

                <section>
                  <h2 className="text-xs font-bold uppercase border-b border-slate-200 pb-1 mb-2 font-sans tracking-wider">
                    Executive Profile
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">{resumeData.summary}</p>
                </section>

                <section>
                  <h2 className="text-xs font-bold uppercase border-b border-slate-200 pb-1 mb-2 font-sans tracking-wider">
                    Education
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <div>
                        <p className="font-bold">{edu.institution}</p>
                        <p className="italic text-[11px]">{edu.degree}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-sans font-bold">{edu.year}</p>
                        <p className="text-[11px] text-slate-600">{edu.score}</p>
                      </div>
                    </div>
                  ))}
                </section>

                <section className="space-y-3">
                  <h2 className="text-xs font-bold uppercase border-b border-slate-200 pb-1 mb-2 font-sans tracking-wider">
                    Experience
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold">{exp.title}, {exp.company}</span>
                        <span className="font-sans text-[11px] text-slate-500">{exp.period}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{exp.highlights}</p>
                    </div>
                  ))}
                </section>

                <section className="space-y-3">
                  <h2 className="text-xs font-bold uppercase border-b border-slate-200 pb-1 mb-2 font-sans tracking-wider">
                    Projects & Implementations
                  </h2>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold">{proj.title}</span>
                        <span className="font-sans text-[11px] text-slate-500">{proj.tech}</span>
                      </div>
                      <p className="text-xs text-slate-700">{proj.description}</p>
                    </div>
                  ))}
                </section>

                <section>
                  <h2 className="text-xs font-bold uppercase border-b border-slate-200 pb-1 mb-2 font-sans tracking-wider">
                    Technical Skills
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {resumeData.skills.join(" • ")}
                  </p>
                </section>
              </div>
            )}

            {/* TEMPLATE 3: MINIMAL ATS */}
            {template === "minimal" && (
              <div className="space-y-5 font-mono text-xs text-slate-900">
                <header className="border-b border-slate-400 pb-3">
                  <h1 className="text-xl font-bold uppercase">{resumeData.name}</h1>
                  <p className="text-[11px] text-slate-600">{resumeData.headline}</p>
                  <p className="text-[10px] text-slate-500">
                    EMAIL: {resumeData.email} | TEL: {resumeData.phone} | LOC: {resumeData.location}
                  </p>
                </header>

                <div>
                  <h2 className="font-bold uppercase tracking-wider text-[11px] underline mb-1">
                    [1] SUMMARY
                  </h2>
                  <p className="leading-relaxed text-[11px]">{resumeData.summary}</p>
                </div>

                <div>
                  <h2 className="font-bold uppercase tracking-wider text-[11px] underline mb-1">
                    [2] TECHNICAL SKILLS
                  </h2>
                  <p className="text-[11px]">{resumeData.skills.join(", ")}</p>
                </div>

                <div className="space-y-2">
                  <h2 className="font-bold uppercase tracking-wider text-[11px] underline mb-1">
                    [3] WORK EXPERIENCE
                  </h2>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>{exp.title} - {exp.company}</span>
                        <span>{exp.period}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5">{exp.highlights}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h2 className="font-bold uppercase tracking-wider text-[11px] underline mb-1">
                    [4] PROJECTS
                  </h2>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>{proj.title} [{proj.tech}]</span>
                      </div>
                      <p className="text-[11px] text-slate-700">{proj.description}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="font-bold uppercase tracking-wider text-[11px] underline mb-1">
                    [5] EDUCATION
                  </h2>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between text-[11px]">
                      <span>{edu.institution} - {edu.degree}</span>
                      <span>{edu.year} ({edu.score})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
