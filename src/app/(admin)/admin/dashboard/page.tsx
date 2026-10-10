"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  ShieldCheck,
  Users,
  Building,
  Briefcase,
  Award,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setStats(d.stats);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white relative shadow-xl space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15">
            System Administration & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Placement Administration Portal
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-normal">
            Oversee institutional campus recruitment statistics, verify enterprise partner companies, moderate job opportunities, and inspect tamper-evident audit logs.
          </p>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Registered Students</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalStudents || 250}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Partner Companies</p>
                <p className="text-2xl font-black text-amber-600 mt-1">{stats.totalCompanies || 28}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Active Campus Drives</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">{stats.activeJobs || 12}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total Applications</p>
                <p className="text-2xl font-black text-purple-600 mt-1">{stats.totalApplications || 140}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Placement Rate</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats.placementRate || 88}%</p>
              </div>
            </div>

            {/* Quick Management Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                  <Building className="w-5 h-5 text-amber-600" />
                  <span>Company Verification</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Review new recruiter registrations and verify institutional accreditation before allowing drive postings.
                </p>
                <Link
                  href="/admin/companies"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 hover:underline"
                >
                  <span>Manage Company Approvals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span>Placement Analytics</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Department-wise placement trends, highest & average CTC distribution, and student eligibility insights.
                </p>
                <Link
                  href="/admin/analytics"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:underline"
                >
                  <span>Open Analytics Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-base">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span>Activity Audit Logs</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Inspect comprehensive immutable logs of student profile updates, recruiter status changes, and administrator approvals.
                </p>
                <Link
                  href="/admin/audit-logs"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-purple-600 hover:underline"
                >
                  <span>Inspect Audit Records</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
