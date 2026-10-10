"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  GraduationCap,
  Clock,
  Send,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [job, setJob] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      loadJobAndMatch();
    }
  }, [id]);

  const loadJobAndMatch = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        const d = await res.json();
        setJob(d.job);

        // Fetch AI match
        const matchRes = await fetch("/api/ai/job-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: id, jobData: d.job }),
        });
        if (matchRes.ok) {
          const matchData = await matchRes.json();
          setMatch(matchData.match);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: "Excited to apply for this campus opportunity!" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setHasApplied(true);
        setMessage("Application submitted successfully!");
      } else {
        setMessage(data.message || "Failed to submit application.");
      }
    } catch (e: any) {
      setMessage(e.message || "Something went wrong.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex bg-slate-50">
        <Sidebar role="student" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 flex bg-slate-50">
        <Sidebar role="student" />
        <main className="flex-1 p-8 text-center space-y-4">
          <p className="text-slate-600">Opportunity not found.</p>
          <Link href="/jobs" className="text-indigo-600 font-bold hover:underline">
            Back to Opportunities
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto">
        <Link
          href="/jobs"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        {/* Header Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                {job.type}
              </span>
              <span className="text-xs text-slate-400">• Posted by Verified Employer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <span className="flex items-center space-x-1">
                <Building className="w-4 h-4 text-slate-400" />
                <span>{job.companyName}</span>
              </span>
              <span className="flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{job.location} ({job.workMode})</span>
              </span>
              <span className="font-bold text-emerald-600 text-sm">
                {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)} / {job.salaryPeriod}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleApply}
              disabled={applying || hasApplied}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-sm"
            >
              {applying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : hasApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Applied</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            {message}
          </div>
        )}

        {/* AI Resume-Job Compatibility Engine Showcase */}
        {match && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/80 pb-4">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Resume-Job Compatibility Engine</span>
                </div>
                <h2 className="text-xl font-bold">Role Alignment Breakdown</h2>
              </div>

              <div className="text-right flex items-baseline space-x-2">
                <span className="text-4xl font-black text-cyan-400">{match.overallScore}%</span>
                <span className="text-xs text-indigo-200 font-semibold">Match Score</span>
              </div>
            </div>

            {/* Match Sub-gauges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[11px] text-indigo-200 font-medium">Skills Match</p>
                <p className="text-xl font-black text-white mt-1">{match.skillsScore}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[11px] text-indigo-200 font-medium">Experience Match</p>
                <p className="text-xl font-black text-white mt-1">{match.experienceScore}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[11px] text-indigo-200 font-medium">Academic Eligibility</p>
                <p className="text-xl font-black text-white mt-1">{match.educationScore}%</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <p className="text-[11px] text-indigo-200 font-medium">Project Relevance</p>
                <p className="text-xl font-black text-white mt-1">{match.projectRelevanceScore}%</p>
              </div>
            </div>

            {/* AI Explanation Text */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <p className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
                Why this opportunity aligns with you:
              </p>
              <p className="text-xs text-indigo-100 leading-relaxed font-normal">
                {match.explanation}
              </p>
            </div>

            {/* Matched vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <p className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Matched Skills in Your Profile</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(match.matchedSkills || []).map((sk: string) => (
                    <span
                      key={sk}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-500/30"
                    >
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Missing or Supplementary Skills</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills && match.missingSkills.length > 0 ? (
                    match.missingSkills.map((sk: string) => (
                      <span
                        key={sk}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-500/30"
                      >
                        ⚠ {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-indigo-200 italic">
                      Zero gaps! You fulfill 100% of required technical competencies.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Two Column Layout: Description & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900">Opportunity Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900">Key Responsibilities</h2>
              <ul className="space-y-2">
                {(job.responsibilities || []).map((resp: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900">Requirements & Qualifications</h2>
              <ul className="space-y-2">
                {(job.requirements || []).map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-600">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Specifications (1 Col) */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Drive Details
              </h3>

              <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
                <div className="pt-2 flex justify-between">
                  <span className="font-semibold text-slate-500">Eligibility CGPA:</span>
                  <span className="font-bold text-slate-900">{job.eligibilityCgpa || 6.0} CGPA</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-semibold text-slate-500">Education:</span>
                  <span className="font-bold text-slate-900 text-right">{job.educationRequirements}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-semibold text-slate-500">Openings:</span>
                  <span className="font-bold text-slate-900">{job.openings} positions</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="font-semibold text-slate-500">Deadline:</span>
                  <span className="font-bold text-red-600">{formatDate(job.deadline)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
