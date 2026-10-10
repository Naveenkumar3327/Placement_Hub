"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Building, CheckCircle2, XCircle, Globe, ShieldCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/companies");
      if (res.ok) {
        const d = await res.json();
        setCompanies(d.companies || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (companyId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      const res = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, approved: nextStatus }),
      });
      if (res.ok) {
        fetchCompanies();
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
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Employer Verification & Accreditation</span>
            </h1>
            <p className="text-xs text-slate-500">
              Verify company legitimacy before authorizing campus placement drive listings
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            {companies.length} Companies
          </span>
        </div>

        <div className="space-y-4">
          {companies.map((c) => (
            <div
              key={c._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center font-bold text-amber-800 text-sm">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {c.companyName || c.name}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Representative: {c.name} ({c.email})
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Industry: {c.industry || "Software & Technology"}</span>
                  <span>•</span>
                  <span>Registered: {formatDate(c.createdAt)}</span>
                  <span>•</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      c.companyApproved
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {c.companyApproved ? "Verified Employer" : "Pending Verification"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleApprovalToggle(c._id, c.companyApproved)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 ${
                    c.companyApproved
                      ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                  }`}
                >
                  {c.companyApproved ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Revoke Verification</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Employer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
