"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Users,
  Briefcase,
  CheckCircle2,
  Video,
  Award,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Building,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CompanyDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/applications"),
      ]);
      if (jobsRes.ok) {
        const d = await jobsRes.json();
        setJobs(d.jobs || []);
      }
      if (appsRes.ok) {
        const d = await appsRes.json();
        setApplications(d.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
  const interviews = applications.filter(
    (a) => a.status === "Interview Scheduled" || a.status === "Interview Completed"
  ).length;
  const selected = applications.filter((a) => a.status === "Selected").length;

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Recruiter Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white relative shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-purple-300 border border-white/15">
              Campus Recruiter Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruitment Command Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 max-w-xl font-normal">
              Manage university drives, compare student portfolios with role requirements, and schedule multi-stage technical interviews.
            </p>
          </div>

          <Link
            href="/company/post-job"
            className="px-6 py-3.5 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all hover:scale-105 self-start md:self-auto text-xs sm:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Drive / Opening</span>
          </Link>
        </div>

        {/* Recruiter KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Active Postings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{jobs.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
            <p className="text-2xl font-black text-purple-600 mt-1">{applications.length}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{shortlisted}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Interviews</p>
            <p className="text-2xl font-black text-cyan-600 mt-1">{interviews}</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Offers Extended</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{selected}</p>
          </div>
        </div>

        {/* Recent candidate applications with role match scores */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Candidate Submissions</h2>
              <p className="text-xs text-slate-500">Sorted by resume and role compatibility</p>
            </div>
            <Link
              href="/company/applicants"
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Manage full pipeline →
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Candidate Name</th>
                    <th className="p-4">Opportunity Applied</th>
                    <th className="p-4">Role match</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Submission Date</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{app.studentName}</p>
                        <p className="text-[11px] text-slate-400">{app.studentEmail}</p>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{app.jobTitle}</td>
                      <td className="p-4">
                        <span className="font-extrabold text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          {app.aiMatchScore}% Match
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(app.appliedDate)}</td>
                      <td className="p-4 text-right">
                        <Link
                          href="/company/applicants"
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          Review Candidate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
