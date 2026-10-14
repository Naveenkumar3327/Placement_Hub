"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Shield,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import { PlacementLogo } from "@/components/ui/PlacementLogo";

interface SidebarProps {
  role?: "student" | "company" | "admin";
  profileCompletion?: number;
}

const studentLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/profile", icon: User },
  { label: "Resume Studio", href: "/resume-builder", icon: FileText },
  { label: "ATS Checker", href: "/ats-checker", icon: Activity },
  { label: "Job Postings", href: "/jobs", icon: Briefcase },
  { label: "Internships", href: "/internships", icon: TrendingUp },
  { label: "Applications", href: "/applications", icon: CheckCircle2 },
  { label: "Interview Practice", href: "/mock-interview", icon: Video },
  { label: "Skill Gap", href: "/skill-gap", icon: BarChart3 },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Messages", href: "/messages", icon: MessageSquare },
];

const companyLinks = [
  { label: "Overview", href: "/company/dashboard", icon: LayoutDashboard },
  { label: "Post an Opening", href: "/company/post-job", icon: PlusCircle },
  { label: "Manage Jobs", href: "/company/jobs", icon: Briefcase },
  { label: "Applicant Pipeline", href: "/company/applicants", icon: Users },
  { label: "Messages", href: "/company/messages", icon: MessageSquare },
  { label: "Analytics", href: "/company/analytics", icon: BarChart3 },
];

const adminLinks = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Verify Companies", href: "/admin/companies", icon: Shield },
  { label: "Moderate Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Placement Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Audit Trail", href: "/admin/audit-logs", icon: FileText },
];

const roleLabels = {
  student: { title: "Student workspace", subtitle: "Build your next opportunity" },
  company: { title: "Recruiter workspace", subtitle: "Find your next great hire" },
  admin: { title: "Admin workspace", subtitle: "Campus operations" },
};

export function Sidebar({ role = "student", profileCompletion = 85 }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : role === "company" ? companyLinks : studentLinks;
  const roleLabel = roleLabels[role];

  return (
    <>
      <div className="portal-sidebar-spacer hidden w-64 shrink-0 md:block" aria-hidden="true" />
      <aside className="portal-sidebar" aria-label={`${role} navigation`}>
        <Link href="/" className="portal-sidebar-brand" title="Placement Hub">
          <span className="portal-sidebar-logo"><PlacementLogo className="h-7 w-7" /></span>
          <span className="portal-sidebar-brand-copy">Placement <em>Hub</em></span>
        </Link>

        <div className="portal-sidebar-context">
          <span className="portal-sidebar-eyebrow">{role.toUpperCase()}</span>
          <p>{roleLabel.title}</p>
          <small>{roleLabel.subtitle}</small>
        </div>

        {role === "student" ? (
          <div className="portal-readiness" aria-label={`Profile readiness ${profileCompletion}%`}>
            <div className="portal-readiness-label"><span>Profile readiness</span><strong>{profileCompletion}%</strong></div>
            <div className="portal-readiness-track"><span style={{ width: `${Math.max(0, Math.min(100, profileCompletion))}%` }} /></div>
          </div>
        ) : null}

        <nav className="portal-sidebar-nav" aria-label="Workspace pages">
          {links.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link key={item.href} href={item.href} title={item.label} aria-label={item.label} aria-current={active ? "page" : undefined} className={`portal-nav-link${active ? " is-active" : ""}`}>
                <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                <span>{item.label}</span>
                {active ? <span className="portal-nav-indicator" aria-hidden="true" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="portal-sidebar-foot">
          <span className="portal-live-dot" />
          <span>Placement Hub</span>
          <small>Campus • Careers • Growth</small>
        </div>
      </aside>
    </>
  );
}
