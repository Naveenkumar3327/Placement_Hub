"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/ui/Sidebar";
import { Bell, CheckCheck, ExternalLink, Calendar, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const d = await res.json();
        setNotifications(d.notifications || []);
        setUnreadCount(d.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Notification Center</span>
            </h1>
            <p className="text-xs text-slate-500">
              Campus updates, application decisions, and interview schedules
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 flex items-center space-x-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border transition-all ${
                  !n.read
                    ? "bg-white border-indigo-200 shadow-sm shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "bg-white/80 border-slate-200/80"
                } flex items-start justify-between gap-4`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{n.title}</span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 pt-1">{formatDate(n.createdAt)}</p>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center space-x-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
