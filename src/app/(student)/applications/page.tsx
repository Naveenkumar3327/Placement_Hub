"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  CheckCircle2,
  Clock,
  Video,
  AlertCircle,
  Award,
  Layers,
  Table as TableIcon,
  GitCommit,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "timeline">("kanban");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
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

  const handleWithdraw = async (appId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Withdrawn" }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const KANBAN_COLUMNS = [
    { title: "Applied", status: "Applied", color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
    { title: "Under Review", status: "Under Review", color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
    { title: "Shortlisted", status: "Shortlisted", color: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50" },
    { title: "Interview Scheduled", status: "Interview Scheduled", color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50" },
    { title: "Selected", status: "Selected", color: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        {/* Header Toolbar */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Application Tracker (ATS)
            </h1>
            <p className="text-xs text-slate-500">
              Real-time multi-stage status tracking across your campus job drives
            </p>
          </div>

          {/* View Switcher: Kanban / Table / Timeline */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "kanban" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "table" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                viewMode === "timeline" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {/* View 1: Kanban Board */}
        {viewMode === "kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((col) => {
              const colApps = applications.filter(
                (a) => a.status === col.status || (col.status === "Interview Scheduled" && a.status === "Interview Completed")
              );
              return (
                <div
                  key={col.status}
                  className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200/80 min-w-[220px] flex flex-col space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="font-bold text-xs text-slate-800 flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${col.color}`} />
                      <span>{col.title}</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-2xs">
                      {colApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colApps.length === 0 ? (
                      <div className="p-4 text-center text-[11px] text-slate-400 bg-white/40 rounded-xl border border-dashed border-slate-200">
                        No applications in this stage
                      </div>
                    ) : (
                      colApps.map((app) => (
                        <div
                          key={app._id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 hover:shadow-md transition-shadow"
                        >
                          <div className="space-y-0.5">
                            <h3 className="font-bold text-xs text-slate-900 leading-tight">
                              {app.jobTitle}
                            </h3>
                            <p className="text-[11px] font-medium text-slate-500">{app.companyName}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">{formatDate(app.appliedDate)}</span>
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {app.aiMatchScore}% Match
                            </span>
                          </div>

                          {app.interviewDetails && (
                            <div className="p-2 rounded-lg bg-purple-50 text-[10px] text-purple-900 space-y-0.5">
                              <p className="font-bold">{app.interviewDetails.roundName}</p>
                              <p className="text-purple-700">{formatDate(app.interviewDetails.scheduledDate)}</p>
                              {app.interviewDetails.meetingLink && (
                                <a
                                  href={app.interviewDetails.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 font-bold hover:underline block truncate"
                                >
                                  Join Meeting Link →
                                </a>
                              )}
                            </div>
                          )}

                          {app.status === "Applied" && (
                            <button
                              onClick={() => handleWithdraw(app._id)}
                              className="text-[10px] text-red-500 hover:underline block text-right w-full"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View 2: Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Opportunity</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">AI Match</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Interview Details</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{app.jobTitle}</td>
                      <td className="p-4 font-medium text-slate-600">{app.companyName}</td>
                      <td className="p-4 text-slate-500">{formatDate(app.appliedDate)}</td>
                      <td className="p-4">
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {app.aiMatchScore}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {app.interviewDetails ? (
                          <div>
                            <p className="font-bold text-purple-700">{app.interviewDetails.roundName}</p>
                            <p className="text-[10px]">{formatDate(app.interviewDetails.scheduledDate)}</p>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {app.status === "Applied" && (
                          <button
                            onClick={() => handleWithdraw(app._id)}
                            className="text-red-600 hover:underline font-bold text-[11px]"
                          >
                            Withdraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View 3: Timeline View */}
        {viewMode === "timeline" && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{app.jobTitle}</h2>
                    <p className="text-xs text-slate-500">{app.companyName}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 self-start sm:self-auto">
                    Current: {app.status}
                  </span>
                </div>

                {/* Stepper Timeline */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {KANBAN_COLUMNS.map((step, idx) => {
                    const statuses = ["Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected"];
                    const currentIdx = statuses.indexOf(app.status);
                    const stepIdx = statuses.indexOf(step.status);
                    const isPassed = stepIdx <= currentIdx;

                    return (
                      <div key={step.status} className="space-y-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isPassed ? "bg-indigo-600" : "bg-slate-200"
                          }`}
                        />
                        <span className={`text-[10px] font-bold block ${isPassed ? "text-indigo-900" : "text-slate-400"}`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
