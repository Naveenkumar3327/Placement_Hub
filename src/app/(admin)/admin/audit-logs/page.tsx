"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { FileText, ShieldAlert, Clock, User, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/audit-logs")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setLogs(d.logs || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span>Platform Audit Trail & Security Logs</span>
            </h1>
            <p className="text-xs text-slate-500">
              Immutable logging of administrative operations, role transitions, and drive status modifications
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
            {logs.length} Entries Logged
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Action Recorded</th>
                    <th className="p-4">Target Entity</th>
                    <th className="p-4">Metadata Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-500 font-mono text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{log.actorEmail}</td>
                      <td className="p-4">
                        <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{log.action}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {log.entity}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] font-mono text-slate-500 max-w-xs truncate">
                        {JSON.stringify(log.metadata || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
