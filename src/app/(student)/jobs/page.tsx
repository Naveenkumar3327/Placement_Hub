"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Building,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Calendar,
  X,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function JobsDirectoryPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [typeFilter, workModeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter) params.append("type", typeFilter);
      if (workModeFilter) params.append("workMode", workModeFilter);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${selectedJob._id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplySuccess(true);
        setTimeout(() => {
          setApplySuccess(false);
          setSelectedJob(null);
          setCoverLetter("");
        }, 2000);
      } else {
        alert(data.message || "Failed to apply.");
      }
    } catch (e: any) {
      alert(e.message || "Something went wrong.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Header & Filter Controls */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Campus Placement Opportunities
              </h1>
              <p className="text-xs text-slate-500">
                Browse verified campus drives with personalized role-match ratings
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
              {jobs.length} Positions Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
                placeholder="Search job title, skills, or company name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
            >
              <option value="">All Opportunity Types</option>
              <option value="full-time">Full-Time FTE</option>
              <option value="internship">Internship</option>
            </select>

            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
            >
              <option value="">All Work Modes</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-Site</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No opportunities found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.companyName}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location} ({job.workMode})</span>
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / {job.salaryPeriod}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(job.skills || []).map((sk: string) => (
                      <span
                        key={sk}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>90%+ role match</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/jobs/${job._id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apply Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Submit Campus Application
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.companyName} • {selectedJob.location}</p>
              </div>

              {applySuccess ? (
                <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-bold text-emerald-900 text-sm">Application Submitted!</p>
                  <p className="text-xs text-emerald-700">
                    Your profile and role-match analysis have been sent to the recruiter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-semibold text-slate-700">Resume Attached:</p>
                    <p className="text-slate-500 text-[11px]">Primary Candidate Profile & Verified Resume PDF</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Cover Note to Recruiter (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Briefly state why you are excited for this opportunity..."
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={applying}
                      className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      {applying ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Confirm Application</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
