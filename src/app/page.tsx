"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle,
  FileCheck2,
  Video,
  BarChart2,
  Users,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  Award,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState({
    placementRate: 88,
    activeJobs: 12,
    totalCompanies: 28,
    avgPackage: 1550000,
    highestPackage: 2400000,
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats({
            placementRate: data.stats.placementRate || 88,
            activeJobs: data.stats.activeJobs || 12,
            totalCompanies: data.stats.totalCompanies || 28,
            avgPackage: data.stats.averagePackage || 1550000,
            highestPackage: data.stats.highestPackage || 2400000,
          });
        }
      })
      .catch(() => {});
  }, []);

  const formatLPA = (amount: number) => {
    return (amount / 100000).toFixed(1) + " LPA";
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs sm:text-sm font-semibold shadow-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI-Powered Campus Recruitment & Placement Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Accelerate Your Career with{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-500 bg-clip-text text-transparent">
                Intelligent Placement AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
              Connect ambitious students with elite tech employers. Leverage ATS resume
              optimization, automated mock interviews, semantic role matching, and real-time
              hiring pipelines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
              >
                <span>Launch Your Profile</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/ats-checker"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-base"
              >
                <FileCheck2 className="w-5 h-5 text-indigo-600" />
                <span>Test ATS Resume</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all text-base"
              >
                Quick Demo Login
              </Link>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{stats.placementRate}%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Placement Conversion Rate</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{formatLPA(stats.highestPackage)}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Highest Package Offered</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-indigo-600">{formatLPA(stats.avgPackage)}</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Average Engineering CTC</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm text-center">
              <p className="text-3xl font-extrabold text-indigo-600">500+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Recruiting Enterprise Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Portals Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tailored Portals for Every Campus Stakeholder
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Built with dedicated role-based access control, specialized dashboards, and real-time workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Portal Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Student Portal</h3>
                <p className="text-slate-600 text-sm mt-2">
                  Build ATS-optimized resumes, unlock AI job compatibility scores, practice technical mock interviews, and track applications via interactive Kanban boards.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Real-time ATS Resume Scoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>AI Mock Interview Simulator</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Targeted Skill-Gap Learning Roadmap</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/dashboard"
                className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Access Student Portal →
              </Link>
            </div>

            {/* Recruiter Portal Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:shadow-xl hover:border-purple-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Recruiter & Company Portal</h3>
                <p className="text-slate-600 text-sm mt-2">
                  Post high-volume job drives, filter applicants by AI skill compatibility, schedule multi-round interviews, and message shortlisted candidates directly.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Automated AI Candidate Ranking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>One-Click Interview Scheduler</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Real-Time Applicant Messaging</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/company/dashboard"
                className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
              >
                Access Recruiter Portal →
              </Link>
            </div>

            {/* Admin Portal Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-300 transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Admin Governance Portal</h3>
                <p className="text-slate-600 text-sm mt-2">
                  Oversee campus recruitment statistics, approve registered companies, moderate drive listings, monitor tamper-proof audit trails, and export analytics.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Department Placement Analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Company & Job Moderation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Full Activity Audit Logging</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/admin/dashboard"
                className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
              >
                Access Admin Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Engineered for Enterprise Campus Placements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">ATS Resume Auditor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-metric scanning evaluates action verbs, missing keywords, section hierarchy, and JD alignment to ensure candidate resumes pass modern ATS filters.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Semantic Job Matcher</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hybrid algorithm combining deterministic skill checks with LLM embeddings to quantify fit across education, experience, skills, and preferences.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Mock Interviews</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulates real technical, behavioral, and HR interview rounds with prompt-by-prompt AI feedback, technical precision scores, and comprehensive reports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Skill-Gap Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compares student proficiencies against industry role benchmarks (Full Stack, AI/ML, Cloud), generating week-by-week learning roadmaps and projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">CampusAI Placement Portal</span>
          </div>
          <p>© 2026 CampusAI Inc. Built for University & College Career Placement Cells.</p>
          <div className="flex space-x-4">
            <Link href="/jobs" className="hover:text-white transition-colors">Opportunities</Link>
            <Link href="/ats-checker" className="hover:text-white transition-colors">ATS Checker</Link>
            <Link href="/mock-interview" className="hover:text-white transition-colors">Mock Interviews</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
