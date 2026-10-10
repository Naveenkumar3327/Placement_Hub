"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Building } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to log in.");
        setLoading(false);
        return;
      }

      // Route based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else if (data.user.role === "company") {
        router.push("/company/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = (role: "student" | "company" | "admin") => {
    setErrorMsg("");
    if (role === "student") {
      setEmail("aarav@example.com");
      setPassword("Student@12345");
    } else if (role === "company") {
      setEmail("recruiter@nexgen.com");
      setPassword("Company@12345");
    } else if (role === "admin") {
      setEmail("admin@example.com");
      setPassword("Admin@12345");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-50 gradient-mesh">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CampusAI
          </h1>
          <p className="text-xs text-slate-500">
            Access your personalized placement portal
          </p>
        </div>

        {/* Quick 1-Click Demo Fill Selector */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Test Accounts:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo("student")}
              className="px-2 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center space-x-1 border border-indigo-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("company")}
              className="px-2 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center justify-center space-x-1 border border-purple-200 transition-colors"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("admin")}
              className="px-2 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center space-x-1 border border-amber-200 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all hover:shadow disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{" "}
          <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
            Register as Student or Company
          </Link>
        </p>
      </div>
    </div>
  );
}
