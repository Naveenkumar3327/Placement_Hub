"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Award,
  Layers,
  ArrowRight,
  Code,
} from "lucide-react";

export default function SkillGapPage() {
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [targetRole]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole }),
      });
      if (res.ok) {
        const d = await res.json();
        setAnalysis(d.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white relative shadow-xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-300 border border-white/15">
              AI Market Benchmark Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Skill Gap Analysis & Learning Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl font-normal">
            Evaluate your skill competencies against high-paying employer benchmarks. Discover missing proficiencies, prioritize learning, and explore recommended capstone projects.
          </p>
        </div>

        {/* Target Role Selector Toolbar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Select Your Career Target
            </h2>
            <p className="text-xs text-slate-500">Benchmark your verified skills against industry standards</p>
          </div>

          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-indigo-950 bg-slate-50 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
            <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : analysis ? (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Coverage Gauge Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="text-center md:border-r border-slate-200 pr-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Skill Benchmark Coverage
                </span>
                <div className="flex items-baseline justify-center space-x-1 mt-2">
                  <span className="text-5xl font-black text-indigo-600">
                    {analysis.overallCoverage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  for {analysis.targetRole}
                </p>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Proficiency Breakdown
                </h3>
                <div className="space-y-2">
                  {(analysis.categoryBreakdown || []).map((cat: any) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{cat.category}</span>
                        <span className="text-indigo-600 font-bold">{cat.coverage}% ({cat.acquired}/{cat.totalRequired})</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${cat.coverage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Skills Prioritized Table */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Prioritized Skill Gaps to Bridge
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(analysis.missingSkills || []).slice(0, 6).map((item: any) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          item.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.importanceReason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Week-by-Week Learning Roadmap */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  4-Week Accelerated Learning Roadmap
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(analysis.learningRoadmap || []).map((step: any) => (
                  <div
                    key={step.week}
                    className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                        Week {step.week}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{step.title}</h4>
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {step.topics.map((t: string, i: number) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/80 border border-indigo-200/60 text-[10px] text-indigo-900 font-medium">
                      🛠️ {step.recommendedProject}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Projects & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Projects */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Recommended Capstone Projects</span>
                </h3>
                <div className="space-y-3">
                  {(analysis.recommendedProjects || []).map((proj: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                      <p className="font-bold text-xs text-slate-900">{proj.title}</p>
                      <p className="text-[11px] text-slate-600">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t: string) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-white font-medium text-slate-700 border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Industry Recognized Certifications</span>
                </h3>
                <div className="space-y-3">
                  {(analysis.recommendedCertifications || []).map((cert: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                      <p className="font-bold text-xs text-slate-900">{cert.name}</p>
                      <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-indigo-600 font-bold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>View Curriculum</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
