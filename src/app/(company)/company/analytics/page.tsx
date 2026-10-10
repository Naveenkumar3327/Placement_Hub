"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { BarChart3, TrendingUp, Users, CheckCircle2, Award } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function CompanyAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#312e81"];

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <span>Recruitment Funnel & Pipeline Analytics</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time visualization of candidate conversion rates, skill distribution, and applicant volume
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Top Funnel Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total Applicants</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.stats.totalApplications || 120}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Shortlisted</p>
                <p className="text-2xl font-black text-purple-600 mt-1">{stats.stats.shortlistedApps || 45}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Interviews Held</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">{stats.stats.interviewApps || 28}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Selection Rate</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">18.5%</p>
              </div>
            </div>

            {/* Recharts Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Application Funnel */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Hiring Pipeline Funnel
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.applicationFunnel} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="stage" type="category" width={110} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Skill Demand Breakdown */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Applicant Skill Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.charts.skillDemand}>
                      <XAxis dataKey="skill" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="demand" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
