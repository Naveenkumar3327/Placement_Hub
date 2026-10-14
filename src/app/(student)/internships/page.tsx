"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  TrendingUp,
  Building,
  MapPin,
  Sparkles,
  Calendar,
  Briefcase,
  Search,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/jobs?type=internship");
      if (res.ok) {
        const d = await res.json();
        setInternships(d.jobs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = internships.filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(s) ||
      (item.companyName || "").toLowerCase().includes(s) ||
      (item.skills || []).some((sk: string) => sk.toLowerCase().includes(s))
    );
  });

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-900 via-indigo-950 to-slate-900 text-white relative shadow-xl space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-cyan-300 border border-white/15">
            Summer & Pre-Placement Internships 2026
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Internship Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl font-normal">
            Gain high-impact industry experience with stipends ranging up to ₹60,000/month and Pre-Placement Offer (PPO) conversion opportunities.
          </p>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search internships by domain, company, or tech stack..."
            className="w-full text-xs bg-transparent focus:outline-none"
          />
        </div>

        {/* Listings */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No internships currently active</h3>
            <p className="text-xs text-slate-500 mt-1">Please check back soon for upcoming campus drives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-cyan-200 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.employerHidden ? <Link href="/login" className="text-indigo-600 hover:underline">Sign in to view employer</Link> : item.companyName}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-cyan-50 text-cyan-800 border border-cyan-200">
                      Internship
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location} ({item.workMode})</span>
                    </span>
                    <span className="font-semibold text-emerald-600">
                      Stipend: {formatCurrency(item.salaryMin)} - {formatCurrency(item.salaryMax)} / {item.salaryPeriod}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(item.skills || []).map((sk: string) => (
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
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    ✨ 95% Compatibility
                  </span>
                  <Link
                    href={`/jobs/${item._id}`}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    View Details & Apply
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
