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
import { PlacementLogo } from "@/components/ui/PlacementLogo";

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
    { label: "Interview Practice", href: "/mock-interview", icon: Video },
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
    <>
      <div className="hidden w-64 flex-shrink-0 md:block" aria-hidden="true" />
      <aside className="sidebar-dock group fixed left-2 top-1/2 z-40 flex max-h-[calc(100vh-1.5rem)] w-14 -translate-y-1/2 flex-shrink-0 flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl transition-[width] duration-200 md:left-3 md:hover:w-64 md:focus-within:w-64 max-md:bottom-3 max-md:left-1/2 max-md:top-auto max-md:max-h-14 max-md:w-[calc(100%-1rem)] max-md:max-w-sm max-md:-translate-x-1/2 max-md:translate-y-0 max-md:flex-row max-md:items-center max-md:gap-2 dark:border-slate-700 dark:bg-slate-900/95">
        <Link href="/" title="Placement Hub" className="flex min-h-10 items-center gap-3 overflow-hidden rounded-xl bg-emerald-950 p-1.5 text-sky-200 max-md:w-10 max-md:shrink-0">
          <PlacementLogo className="h-7 w-7 shrink-0" />
          <span className="whitespace-nowrap font-serif text-sm font-bold opacity-0 transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100 max-md:hidden">
            Placement <span className="italic">Hub</span>
          </span>
        </Link>

        {role === "student" && (
          <div className="max-h-0 space-y-1.5 overflow-hidden rounded-xl bg-slate-50 px-3 opacity-0 transition-all group-hover:max-h-16 group-hover:py-2 group-hover:opacity-100 group-focus-within:max-h-16 group-focus-within:py-2 group-focus-within:opacity-100 max-md:hidden dark:bg-slate-800">
            <div className="flex items-center justify-between gap-4 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              <span className="whitespace-nowrap">Profile readiness</span>
              <span className="text-emerald-700 dark:text-emerald-300">{profileCompletion}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full rounded-full bg-emerald-600" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
        )}

        {role === "company" && (
          <div className="max-h-0 overflow-hidden rounded-xl bg-purple-50 text-xs opacity-0 transition-all group-hover:max-h-14 group-hover:px-3 group-hover:py-2 group-hover:opacity-100 group-focus-within:max-h-14 group-focus-within:px-3 group-focus-within:py-2 group-focus-within:opacity-100 max-md:hidden dark:bg-purple-950/40">
            <p className="whitespace-nowrap font-bold text-purple-900 dark:text-purple-200">Company Recruiter Portal</p>
            <p className="mt-0.5 whitespace-nowrap text-[11px] text-purple-700 dark:text-purple-300">Placement Hub</p>
          </div>
        )}

        {role === "admin" && (
          <div className="max-h-0 overflow-hidden rounded-xl bg-amber-50 text-xs opacity-0 transition-all group-hover:max-h-14 group-hover:px-3 group-hover:py-2 group-hover:opacity-100 group-focus-within:max-h-14 group-focus-within:px-3 group-focus-within:py-2 group-focus-within:opacity-100 max-md:hidden dark:bg-amber-950/40">
            <p className="whitespace-nowrap font-bold text-amber-900 dark:text-amber-200">System Administration</p>
            <p className="mt-0.5 whitespace-nowrap text-[11px] text-amber-700 dark:text-amber-300">Platform Governance</p>
          </div>
        )}

        <nav className="min-h-0 space-y-1 overflow-y-auto overflow-x-hidden max-md:flex max-md:min-w-0 max-md:flex-1 max-md:gap-1 max-md:space-y-0 max-md:overflow-x-auto max-md:overflow-y-hidden">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 overflow-hidden rounded-xl px-3 text-sm font-medium transition-colors max-md:min-w-10 max-md:justify-center max-md:px-2 ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-sm shadow-emerald-950/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                <span className="whitespace-nowrap opacity-0 transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100 max-md:hidden">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
