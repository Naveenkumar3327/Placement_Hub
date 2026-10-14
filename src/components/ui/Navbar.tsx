"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { PlacementLogo } from "@/components/ui/PlacementLogo";

const publicLinks = [
  { label: "Opportunities", href: "/jobs" },
  { label: "ATS checker", href: "/ats-checker" },
  { label: "Interview practice", href: "/mock-interview" },
  { label: "Skill gap", href: "/skill-gap" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        const data = response.ok ? await response.json() : null;
        if (!active) return;
        setCurrentUser(data?.user || null);
        if (data?.user) void fetchNotifications();
      } catch {
        if (active) setCurrentUser(null);
      }
    };
    void fetchSession();
    return () => { active = false; };
  }, [pathname]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) return;
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Notifications are optional to the global navigation.
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
    void fetchNotifications();
  };

  const dashboardHref = currentUser?.role === "admin"
    ? "/admin/dashboard"
    : currentUser?.role === "company"
      ? "/company/dashboard"
      : "/dashboard";

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link href="/" className="site-brand" aria-label="Placement Hub home">
          <span className="site-brand-icon"><PlacementLogo className="h-7 w-7" /></span>
          <span className="site-brand-text"><strong>Placement <em>Hub</em></strong><small>CAREERS, IN MOTION</small></span>
        </Link>

        <nav className="top-links" aria-label="Main navigation">
          {publicLinks.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return <Link key={item.href} href={item.href} className={active ? "is-active" : ""}>{item.label}</Link>;
          })}
        </nav>

        <div className="navbar-actions">
          <button
            type="button"
            onClick={toggleTheme}
            className="nav-icon-button"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>

          {currentUser ? (
            <>
              <div className="notification-anchor">
                <button type="button" onClick={() => setShowNotifications(!showNotifications)} className="nav-icon-button notification-toggle" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={showNotifications}>
                  <Bell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 ? <span className="notification-count">{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
                </button>
                {showNotifications ? (
                  <section className="notification-menu" aria-label="Recent notifications">
                    <div className="notification-menu-head">
                      <div><small>INBOX</small><h2>Notifications</h2></div>
                      {unreadCount > 0 ? <button type="button" onClick={markAllRead}>Mark all read</button> : null}
                    </div>
                    <div className="notification-menu-list">
                      {notifications.length === 0 ? <p className="notification-empty">You’re all caught up.</p> : notifications.slice(0, 5).map((item) => (
                        <article key={item._id} className={`notification-item${item.read ? "" : " is-unread"}`}>
                          <strong>{item.title}</strong><p>{item.message}</p>
                        </article>
                      ))}
                    </div>
                    <Link href="/notifications" onClick={() => setShowNotifications(false)} className="notification-menu-link">Open notification center <ChevronDown className="h-3.5 w-3.5 -rotate-90" /></Link>
                  </section>
                ) : null}
              </div>

              <Link href={dashboardHref} className="user-chip" title="Open your workspace">
                <span className="user-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}</span>
                <span className="user-chip-copy"><strong>{currentUser.name}</strong><small>{currentUser.role}</small></span>
                <ChevronDown className="user-chevron h-3.5 w-3.5" />
              </Link>
              <button type="button" onClick={handleLogout} className="nav-icon-button logout-button" title="Sign out" aria-label="Sign out"><LogOut className="h-[17px] w-[17px]" /></button>
            </>
          ) : (
            <div className="auth-actions">
              <Link href="/login" className="signin-link">Sign in</Link>
              <Link href="/register" className="signup-link">Get started <span aria-hidden="true">↗</span></Link>
            </div>
          )}

          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-button" aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="mobile-menu">
          <div className="mobile-menu-heading"><span>EXPLORE</span><small>Find your next step</small></div>
          {publicLinks.map((item) => <Link key={item.href} href={item.href} onClick={closeMobileMenu} className={pathname.startsWith(item.href) ? "is-active" : ""}>{item.label}</Link>)}
          {currentUser ? <>
            <Link href={dashboardHref} onClick={closeMobileMenu} className="mobile-dashboard-link"><BriefcaseBusiness className="h-4 w-4" /> Open {currentUser.role} workspace</Link>
            <button type="button" onClick={() => { closeMobileMenu(); void handleLogout(); }} className="mobile-signout-link"><LogOut className="h-4 w-4" /> Sign out</button>
          </> : (
            <div className="mobile-auth-actions"><Link href="/login" onClick={closeMobileMenu}>Sign in</Link><Link href="/register" onClick={closeMobileMenu}>Get started</Link></div>
          )}
        </div>
      ) : null}
    </header>
  );
}
