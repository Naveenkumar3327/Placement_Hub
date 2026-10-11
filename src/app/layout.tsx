import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Placement Hub | Career & Campus Hiring Portal",
  description:
    "Next-generation campus placement suite featuring AI resume matching, ATS scanner, automated mock interviews, real-time application pipelines, and predictive skill-gap analytics.",
  keywords: [
    "Campus Placement",
    "Internships",
    "AI Resume Matching",
    "ATS Resume Checker",
    "Mock Interview AI",
    "Skill Gap Analysis",
    "Recruitment Portal",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
