"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Globe,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const current = profile.skills || [];
    if (!current.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...current, newSkill.trim()] });
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: (profile.skills || []).filter((s: string) => s !== skillToRemove),
    });
  };

  const addProject = () => {
    const newProj = {
      title: "New Project",
      description: "Brief summary of technical architecture and outcomes.",
      technologies: ["React", "TypeScript"],
      github: "https://github.com/",
    };
    setProfile({
      ...profile,
      projects: [...(profile.projects || []), newProj],
    });
  };

  const updateProject = (index: number, field: string, val: any) => {
    const updated = [...(profile.projects || [])];
    updated[index] = { ...updated[index], [field]: val };
    setProfile({ ...profile, projects: updated });
  };

  const removeProject = (index: number) => {
    const updated = [...(profile.projects || [])];
    updated.splice(index, 1);
    setProfile({ ...profile, projects: updated });
  };

  if (loading) {
    return (
      <div className="flex-1 flex bg-slate-50">
        <Sidebar role="student" />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="student" profileCompletion={profile?.profileCompletion || 85} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 overflow-y-auto">
        {/* Header Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Candidate Profile & Portfolio
            </h1>
            <p className="text-xs text-slate-500">
              Keep your credentials and skills updated for more relevant job matches
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {savedSuccess && (
              <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Profile Saved</span>
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Card 1: Core Bio & Contact */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Basic Information & Headline</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile?.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline / Target Specialization
                </label>
                <input
                  type="text"
                  value={profile?.headline || ""}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  placeholder="e.g. Full Stack Developer | Next.js, Node.js"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile?.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  value={profile?.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Bengaluru, Karnataka"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Professional Bio / Summary
              </label>
              <textarea
                rows={3}
                value={profile?.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Write a brief career summary..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Card 2: Academic Credentials */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Academic Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Branch
                </label>
                <input
                  type="text"
                  value={profile?.department || ""}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  placeholder="Computer Science & Engineering"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Graduation Year
                </label>
                <input
                  type="number"
                  value={profile?.graduationYear || 2026}
                  onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cumulative CGPA (10.0 scale)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={profile?.cgpa || 8.5}
                  onChange={(e) => setProfile({ ...profile, cgpa: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Skills Tag Editor */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Verified Technical Skills</span>
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add skill (e.g. Next.js, Docker, Python)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {(profile?.skills || []).map((sk: string) => (
                <span
                  key={sk}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(sk)}
                    className="text-indigo-400 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Projects Showcase */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>Portfolio Projects</span>
              </h2>
              <button
                type="button"
                onClick={addProject}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {(profile?.projects || []).map((proj: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(idx, "title", e.target.value)}
                      placeholder="Project Name"
                      className="font-bold text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-2/3"
                    />
                    <button
                      type="button"
                      onClick={() => removeProject(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={proj.description}
                    onChange={(e) => updateProject(idx, "description", e.target.value)}
                    placeholder="Project architectural details and impact..."
                    className="w-full text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={Array.isArray(proj.technologies) ? proj.technologies.join(", ") : proj.technologies}
                      onChange={(e) =>
                        updateProject(idx, "technologies", e.target.value.split(",").map((s) => s.trim()))
                      }
                      placeholder="Technologies (comma separated)"
                      className="text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      value={proj.github || ""}
                      onChange={(e) => updateProject(idx, "github", e.target.value)}
                      placeholder="GitHub Link / URL"
                      className="text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Social & Preferences */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <span>Social Links & Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  value={profile?.socialLinks?.github || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={profile?.socialLinks?.linkedin || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Mode Preference
                </label>
                <select
                  value={profile?.workModePreference || "any"}
                  onChange={(e) => setProfile({ ...profile, workModePreference: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                >
                  <option value="any">Any (Flexible)</option>
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-Site</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
