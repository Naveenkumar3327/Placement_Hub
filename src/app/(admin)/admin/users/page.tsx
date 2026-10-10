"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Users, Search, ShieldCheck, ShieldAlert, CheckCircle2, UserX } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const q = roleFilter ? `?role=${roleFilter}` : "";
      const res = await fetch(`/api/admin/users${q}`);
      if (res.ok) {
        const d = await res.json();
        setUsers(d.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    if (!confirm(`Are you sure you want to change user status to ${newStatus}?`)) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.companyName || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-600" />
                <span>User Account Administration</span>
              </h1>
              <p className="text-xs text-slate-500">
                Manage registered students, recruiters, and platform permissions
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              {filtered.length} Registered Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name, email, or company..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/50 font-medium"
            >
              <option value="">All Account Roles</option>
              <option value="student">Students</option>
              <option value="company">Company Recruiters</option>
              <option value="admin">Administrators</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">User Details</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department / Org</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {u.companyName || u.department || "General"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="p-4 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => toggleStatus(u._id, u.status)}
                          className={`text-xs font-bold hover:underline ${
                            u.status === "active" ? "text-red-600" : "text-emerald-600"
                          }`}
                        >
                          {u.status === "active" ? "Suspend Account" : "Activate"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
