"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Briefcase,
  CheckCircle2,
  Video,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Clock,
  Building,
  MapPin,
  ExternalLink,
  Award,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profRes, appRes, jobsRes] = await Promise.all([
        fetch("/api/users/profile"),
        fetch("/api/applications"),
        fetch("/api/jobs"),
      ]);

      if (profRes.ok) {
        const d = await profRes.json();
        setProfile(d.profile);
      }
      if (appRes.ok) {
        const d = await appRes.json();
        setApplications(d.applications || []);
      }
      if (jobsRes.ok) {
        const d = await jobsRes.json();
        setRecommendedJobs(d.jobs?.slice(0, 4) || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted").length;
  const interviewCount = applications.filter(
    (a) => a.status === "Interview Scheduled" || a.status === "Interview Completed"
  ).length;
  const selectedCount = applications.filter((a) => a.status === "Selected").length;

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" profileCompletion={profile?.profileCompletion || 85} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-xl shadow-indigo-950/10">
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/15">
              Placement Season 2026 Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile?.name || "Student"}! 👋
            </h1>
            <p className="text-sm text-indigo-200 font-normal">
              Your profile is matching with {recommendedJobs.length} campus drives. Explore opportunities, check your ATS score, or start interview practice.
            </p>
            <div className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/ats-checker"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 transition-colors shadow-sm inline-flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Run ATS Audit</span>
              </Link>
              <Link
                href="/mock-interview"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-500/30 transition-colors inline-flex items-center space-x-1.5"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Practice Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Applied</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{applications.length}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{shortlistedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Interviews</p>
              <p className="text-2xl font-black text-purple-600 mt-1">{interviewCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Offers Received</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{selectedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2 Column Layout: Recommended Drives & Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recommended Jobs (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recommended Opportunities</h2>
                <p className="text-xs text-slate-500">Matched to your verified competencies & preferences</p>
              </div>
              <Link href="/jobs" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-base text-slate-900">{job.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.companyName}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.location} ({job.workMode})</span>
                      </span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / {job.salaryPeriod}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.skills || []).slice(0, 4).map((sk: string) => (
                        <span key={sk} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <div className="text-right">
                      <span className="inline-block text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        90%+ Match
                      </span>
                    </div>
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      View & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Quick Status Column (1 col) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
              <Link href="/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
                Kanban view →
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              {applications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No applications yet. Start exploring active opportunities!
                </div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-xs text-slate-800 line-clamp-1">{app.jobTitle}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === "Selected"
                            ? "bg-emerald-100 text-emerald-800"
                            : app.status === "Shortlisted"
                            ? "bg-indigo-100 text-indigo-800"
                            : app.status === "Interview Scheduled"
                            ? "bg-purple-100 text-purple-800"
                            : app.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{app.companyName}</p>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Applied: {formatDate(app.appliedDate)}</span>
                      <span className="font-semibold text-indigo-600">Role match: {app.aiMatchScore}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Skill-Gap Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-100 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <span>Skill Readiness Audit</span>
              </div>
              <p className="text-xs text-slate-600">
                Are you ready for Full Stack & Cloud Developer roles? Benchmark your tech stack against industry criteria.
              </p>
              <Link
                href="/skill-gap"
                className="mt-2 inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>Run Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
