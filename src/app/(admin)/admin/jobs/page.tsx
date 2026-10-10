"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Briefcase, CheckCircle2, XCircle, Building, MapPin } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminJobsModerationPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/jobs");
      if (res.ok) {
        const d = await res.json();
        setJobs(d.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (jobId: string, approvalStatus: string) => {
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, approvalStatus }),
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              <span>Campus Drive Moderation</span>
            </h1>
            <p className="text-xs text-slate-500">
              Audit and approve posted full-time roles and internships before student visibility
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {jobs.length} Postings Listed
          </span>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                    {job.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.approvalStatus === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : job.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {job.approvalStatus}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{job.companyName}</span>
                  <span>•</span>
                  <span>{job.location} ({job.workMode})</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </span>
                  <span>•</span>
                  <span>Deadline: {formatDate(job.deadline)}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {job.approvalStatus !== "approved" && (
                  <button
                    onClick={() => handleModeration(job._id, "approved")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Drive</span>
                  </button>
                )}
                {job.approvalStatus !== "rejected" && (
                  <button
                    onClick={() => handleModeration(job._id, "rejected")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Hide</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
