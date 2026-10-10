"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { BarChart3, TrendingUp, Award, Building, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function PlacementAnalyticsDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const formatLPA = (amount: number) => {
    return (amount / 100000).toFixed(1) + " LPA";
  };

  const COLORS = ["#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#312e81"];

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <span>Campus Placement Analytics & CTC Metrics</span>
            </h1>
            <p className="text-xs text-slate-500">
              Department-wise hiring rates, package distributions, and seasonal placement trends
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Season 2025-2026 Live
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* Top CTC & Conversion Stat Badges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Placement Percentage</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {data.stats.placementRate}%
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">88% of eligible engineering pool</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Highest CTC Package</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">
                  {formatLPA(data.stats.highestPackage || 2400000)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Apex AI Solutions (Product R&D)</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Average Engineering CTC</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatLPA(data.stats.averagePackage || 1550000)}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">18% increase year-on-year</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Internship to PPO Rate</p>
                <p className="text-2xl font-black text-purple-600 mt-1">
                  {data.stats.internshipConversionRate || 78}%
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Direct pre-placement offers</p>
              </div>
            </div>

            {/* Charts Row 1: Monthly Trend & Department Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Placement Trend */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Monthly Placement & Offer Velocity
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.charts.monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke="#818cf8"
                        fill="#818cf8"
                        fillOpacity={0.2}
                      />
                      <Area
                        type="monotone"
                        dataKey="interviews"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.4}
                      />
                      <Area
                        type="monotone"
                        dataKey="offers"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Wise Placement */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Department-Wise Placement Rates (%)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.departmentPlacement}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2: Salary Distribution & Skill Demand */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salary Bracket Distribution */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  CTC Compensation Distribution (LPA)
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.salaryDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]}>
                        {data.charts.salaryDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Technical Skill Demand Index */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Employer Skill Hiring Demand Index
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.charts.skillDemand} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <YAxis dataKey="skill" type="category" width={110} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="demand" fill="#06b6d4" radius={[0, 6, 6, 0]} />
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
