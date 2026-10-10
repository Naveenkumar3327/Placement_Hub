"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Briefcase, Plus, Users, MapPin, Building, Trash2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this drive listing?")) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchJobs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span>Manage Campus Postings</span>
            </h1>
            <p className="text-xs text-slate-500">
              Review your live jobs, applicants pipeline, and drive status
            </p>
          </div>

          <Link
            href="/company/post-job"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900">{job.title}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-purple-50 text-purple-700 border border-purple-200">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{job.location} ({job.workMode})</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                    </span>
                    <span>•</span>
                    <span>Deadline: {formatDate(job.deadline)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Link
                    href="/company/applicants"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center space-x-1.5 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>View Applicants ({job.applicantsCount || 0})</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
