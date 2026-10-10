"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/Sidebar";
import { PlusCircle, Building, CheckCircle2, ArrowRight } from "lucide-react";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "full-time",
    description: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    experienceLevel: "entry",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "year",
    location: "Bengaluru, Karnataka",
    workMode: "hybrid",
    openings: 5,
    eligibilityCgpa: 7.0,
    educationRequirements: "B.Tech / B.E. / MCA",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        responsibilities: formData.responsibilities.split("\n").filter(Boolean),
        requirements: formData.requirements.split("\n").filter(Boolean),
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/company/jobs");
        }, 1500);
      } else {
        alert(data.message || "Failed to publish job.");
      }
    } catch (e: any) {
      alert(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <PlusCircle className="w-5 h-5 text-purple-600" />
            <span>Create Campus Placement Opportunity</span>
          </h1>
          <p className="text-xs text-slate-500">
            Publish an entry-level graduate position or summer internship to verified university students
          </p>
        </div>

        {success ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-emerald-200 shadow-sm space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Opportunity Published Successfully!</h2>
            <p className="text-xs text-slate-500">
              Students can now view, match, and apply for this campus opening. Redirecting to postings...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Basic Opportunity Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Job / Internship Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Associate Cloud Software Engineer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Opportunity Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
                  >
                    <option value="full-time">Full-Time Campus Role (FTE)</option>
                    <option value="internship">Internship (Summer / 6 Months)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Work Mode
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
                  >
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-Site</option>
                    <option value="remote">Fully Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bengaluru, Karnataka"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Number of Openings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.openings}
                    onChange={(e) => setFormData({ ...formData, openings: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Compensation & Criteria */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Compensation & Campus Eligibility
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum Salary / CTC (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                    placeholder="e.g. 1200000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Maximum Salary / CTC (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                    placeholder="e.g. 1600000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Period
                  </label>
                  <select
                    value={formData.salaryPeriod}
                    onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-medium"
                  >
                    <option value="year">Per Year (Annual CTC)</option>
                    <option value="month">Per Month (Internship Stipend)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Minimum CGPA Cutoff
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.eligibilityCgpa}
                    onChange={(e) => setFormData({ ...formData, eligibilityCgpa: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Required Degree / Branches
                  </label>
                  <input
                    type="text"
                    value={formData.educationRequirements}
                    onChange={(e) => setFormData({ ...formData, educationRequirements: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Descriptions & Skills */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Requirements & Skill Tags
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, MongoDB, Docker"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Opportunity Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain the team mission, projects, and work culture..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Build user facing applications using React & Next.js&#10;Write unit tests and optimize page render speeds"
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-2xl font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all text-xs sm:text-sm flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Publish Opening Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
