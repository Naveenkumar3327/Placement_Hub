"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Building, Mail, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "company">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [headline, setHeadline] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
      };

      if (role === "student") {
        payload.headline = headline || "Computer Science Student";
        payload.skills = ["React", "JavaScript", "HTML5", "CSS3"];
      } else {
        payload.companyName = companyName || name;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message || "Failed to register.");
        setLoading(false);
        return;
      }

      if (role === "company") {
        router.push("/company/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-slate-50 gradient-mesh">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500">
            Select your account type to access specialized campus placement tools
          </p>
        </div>

        {/* Role Segmented Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              role === "student"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Student Applicant</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("company")}
            className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              role === "company"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Company Recruiter</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {role === "student" ? "Full Name" : "Contact Representative Name"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "student" ? "e.g. Rahul Verma" : "e.g. Samantha Smith"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
            />
          </div>

          {role === "company" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company / Organization Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. InnovateTech Cloud Corp"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-slate-50/50"
              />
            </div>
          )}

          {role === "student" && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Headline / Target Role
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. B.Tech Computer Science | Full Stack Developer"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Work / University Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@organization.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Create Password (min 6 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow disabled:opacity-50 flex items-center justify-center space-x-2 text-sm ${
              role === "company"
                ? "bg-purple-600 hover:bg-purple-700 shadow-purple-600/25"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
