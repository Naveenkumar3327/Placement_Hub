"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  Calendar,
  Video,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  X,
  Send,
  Building,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ApplicantsPipelinePage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  // Schedule modal state
  const [interviewForm, setInterviewForm] = useState({
    scheduledDate: "2026-03-20T10:00",
    roundName: "Technical Round 1 (System & Coding)",
    meetingLink: "https://meet.google.com/campus-interview",
    interviewerName: "Lead Engineering Manager",
    instructions: "Please be ready with your code IDE and project demo.",
  });

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const d = await res.json();
        setApplications(d.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplicants();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;
    setScheduling(true);

    try {
      const res = await fetch(`/api/applications/${selectedApp._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Interview Scheduled",
          interviewDetails: {
            scheduledDate: new Date(interviewForm.scheduledDate),
            roundName: interviewForm.roundName,
            meetingLink: interviewForm.meetingLink,
            interviewerName: interviewForm.interviewerName,
            instructions: interviewForm.instructions,
          },
        }),
      });

      if (res.ok) {
        setScheduleModalOpen(false);
        fetchApplicants();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setScheduling(false);
    }
  };

  const filtered = applications.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const matchName = (app.studentName || "").toLowerCase().includes(s);
      const matchJob = (app.jobTitle || "").toLowerCase().includes(s);
      const matchEmail = (app.studentEmail || "").toLowerCase().includes(s);
      if (!matchName && !matchJob && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Header Toolbar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Candidate Pipeline & Evaluation</span>
              </h1>
              <p className="text-xs text-slate-500">
                Review applicant resumes, compare skills with role requirements, and advance candidates through interview rounds
              </p>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              {filtered.length} Applicants
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate by name, target role, or email..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants Cards / Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No applicants found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting the filter or search term.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Candidate Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center font-bold text-purple-700 text-sm">
                      {app.studentName ? app.studentName.charAt(0) : "U"}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 leading-tight">
                        {app.studentName}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {app.studentEmail} {app.studentPhone ? `• ${app.studentPhone}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                    <span className="font-semibold text-purple-700">Applied for: {app.jobTitle}</span>
                    <span>•</span>
                    <span>Submitted: {formatDate(app.appliedDate)}</span>
                  </div>

                  {/* AI Match Details Preview */}
                  {app.aiMatchDetails && (
                    <p className="text-[11px] text-slate-500 italic max-w-xl">
                      "{app.aiMatchDetails.explanation || "Strong candidate credentials alignment."}"
                    </p>
                  )}
                </div>

                {/* Score & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black bg-purple-50 text-purple-700 border border-purple-200">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{app.aiMatchScore}% role match</span>
                    </span>
                    <span className="block mt-1 text-[11px] font-bold text-slate-700 uppercase">
                      Status: {app.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setScheduleModalOpen(true);
                      }}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Schedule Interview</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Interview Modal */}
        {scheduleModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setScheduleModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                  Interview Scheduler
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Schedule Round with {selectedApp.studentName}
                </h3>
                <p className="text-xs text-slate-500">For position: {selectedApp.jobTitle}</p>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Round Title / Name
                  </label>
                  <input
                    type="text"
                    required
                    value={interviewForm.roundName}
                    onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Interview Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={interviewForm.scheduledDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, scheduledDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Video Meeting Link (Google Meet / Zoom / Teams)
                  </label>
                  <input
                    type="url"
                    required
                    value={interviewForm.meetingLink}
                    onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Interviewer Name
                  </label>
                  <input
                    type="text"
                    value={interviewForm.interviewerName}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewerName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    {scheduling ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm & Notify Candidate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
