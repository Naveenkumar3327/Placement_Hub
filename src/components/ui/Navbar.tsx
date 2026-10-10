"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Briefcase,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  FileText,
  BarChart2,
  Compass,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setCurrentUser(data.user);
          fetchNotifications();
        }
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      // ignore
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCurrentUser(null);
    router.push("/login");
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    setUnreadCount(0);
    fetchNotifications();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">
              CampusAI
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Placement Hub
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link
            href="/jobs"
            className={`px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
              pathname.startsWith("/jobs") ? "text-indigo-600 bg-indigo-50/50 font-semibold" : ""
            }`}
          >
            Opportunities
          </Link>
          <Link
            href="/ats-checker"
            className={`px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
              pathname === "/ats-checker" ? "text-indigo-600 bg-indigo-50/50 font-semibold" : ""
            }`}
          >
            ATS Checker
          </Link>
          <Link
            href="/mock-interview"
            className={`px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
              pathname === "/mock-interview" ? "text-indigo-600 bg-indigo-50/50 font-semibold" : ""
            }`}
          >
            Mock Interview
          </Link>
          <Link
            href="/skill-gap"
            className={`px-3 py-2 rounded-lg hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
              pathname === "/skill-gap" ? "text-indigo-600 bg-indigo-50/50 font-semibold" : ""
            }`}
          >
            Skill Gap
          </Link>
        </nav>

        {/* Right Section / Auth Controls */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                        Notifications ({unreadCount} new)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-indigo-600 hover:underline font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-sm text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n._id}
                            className={`p-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                              !n.read ? "bg-indigo-50/40" : ""
                            }`}
                          >
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <Link
                      href="/notifications"
                      onClick={() => setShowNotifDropdown(false)}
                      className="block p-2.5 text-center text-xs font-semibold text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-200 dark:border-slate-800"
                    >
                      View all notifications →
                    </Link>
                  </div>
                )}
              </div>

              {/* Portal Switcher & User Avatar */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  href={
                    currentUser.role === "admin"
                      ? "/admin/dashboard"
                      : currentUser.role === "company"
                      ? "/company/dashboard"
                      : "/dashboard"
                  }
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                      {currentUser.name}
                    </p>
                    <span className="capitalize text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {currentUser.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all hover:shadow"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-5 space-y-2">
          <Link
            href="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Opportunities
          </Link>
          <Link
            href="/ats-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            ATS Resume Checker
          </Link>
          <Link
            href="/mock-interview"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            AI Mock Interview
          </Link>
          <Link
            href="/skill-gap"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-100"
          >
            Skill Gap Engine
          </Link>
          {currentUser && (
            <Link
              href={
                currentUser.role === "admin"
                  ? "/admin/dashboard"
                  : currentUser.role === "company"
                  ? "/company/dashboard"
                  : "/dashboard"
              }
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-indigo-600 font-semibold bg-indigo-50"
            >
              My Dashboard ({currentUser.role})
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
