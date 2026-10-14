import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: "Placement Hub | Career & Campus Hiring Portal",
  description:
    "A modern campus placement suite featuring resume matching, ATS checks, interview practice, real-time application pipelines, and skills analytics.",
  keywords: [
    "Campus Placement",
    "Internships",
    "Resume Matching",
    "ATS Resume Checker",
    "Mock Interview Practice",
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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try { if (localStorage.getItem("placement-hub-theme") === "dark") document.documentElement.classList.add("dark"); } catch {}',
          }}
        />
      </head>
      <body className="app-body min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
        <ThemeProvider>
          <Navbar />
          <div className="app-content flex-1 flex flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
