"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  CheckCircle2,
  Video,
  BarChart3,
  Bell,
  MessageSquare,
  Shield,
  PlusCircle,
  Users,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  role?: "student" | "company" | "admin";
  profileCompletion?: number;
}

export function Sidebar({ role = "student", profileCompletion = 85 }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/profile", icon: User },
    { label: "Resume Builder", href: "/resume-builder", icon: FileText },
    { label: "ATS Resume Checker", href: "/ats-checker", icon: Sparkles },
    { label: "Job Postings", href: "/jobs", icon: Briefcase },
    { label: "Internships", href: "/internships", icon: TrendingUp },
    { label: "My Applications", href: "/applications", icon: CheckCircle2 },
    { label: "AI Mock Interview", href: "/mock-interview", icon: Video },
    { label: "Skill Gap Analysis", href: "/skill-gap", icon: BarChart3 },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Messages", href: "/messages", icon: MessageSquare },
  ];

  const companyLinks = [
    { label: "Recruiter Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    { label: "Post New Job / Internship", href: "/company/post-job", icon: PlusCircle },
    { label: "Manage Postings", href: "/company/jobs", icon: Briefcase },
    { label: "Applicant Pipeline", href: "/company/applicants", icon: Users },
    { label: "Candidate Messages", href: "/company/messages", icon: MessageSquare },
    { label: "Recruitment Analytics", href: "/company/analytics", icon: BarChart3 },
  ];

  const adminLinks = [
    { label: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Verify Companies", href: "/admin/companies", icon: Shield },
    { label: "Moderate Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Placement Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "System Audit Logs", href: "/admin/audit-logs", icon: FileText },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "company"
      ? companyLinks
      : studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-6">
      {/* Role Tag & Profile Progress */}
      {role === "student" && (
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800 border border-indigo-100 dark:border-slate-700">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <span>Profile Readiness</span>
            <span className="text-indigo-600 font-bold">{profileCompletion}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <Link
            href="/profile"
            className="mt-2 block text-[11px] text-indigo-600 hover:underline font-medium text-right"
          >
            Complete profile →
          </Link>
        </div>
      )}

      {role === "company" && (
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
          <p className="font-bold text-purple-900 dark:text-purple-200">Company Recruiter Portal</p>
          <p className="text-purple-700 dark:text-purple-300 text-[11px] mt-0.5">
            Placement Hub
          </p>
        </div>
      )}

      {role === "admin" && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs">
          <p className="font-bold text-amber-900 dark:text-amber-200">System Administration</p>
          <p className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">
            Platform Governance & Auditing
          </p>
        </div>
      )}

      {/* Nav Link List */}
      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
