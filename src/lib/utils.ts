import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number | string | undefined): string {
  if (amount === undefined || amount === null) return "Undisclosed";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function calculateProfileCompletion(profile: any): number {
  if (!profile) return 20;
  let score = 20; // baseline for created account
  if (profile.fullName || profile.headline) score += 15;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.education && profile.education.length > 0) score += 15;
  if (profile.experience && profile.experience.length > 0) score += 15;
  if (profile.projects && profile.projects.length > 0) score += 10;
  if (profile.resumeUrl || profile.resume) score += 10;
  return Math.min(score, 100);
}
