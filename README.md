# CampusAI: AI-Based Internship & Placement Portal

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20Ready-green?style=for-the-badge&logo=mongodb)](https://mongodb.com)

> A modern, production-ready, full-stack campus recruitment suite engineered for universities, students, and corporate hiring partners. Powered by an intelligent, hybrid AI engine for ATS resume audits, semantic candidate-job matching, automated mock interviews, and skill-gap learning roadmaps.

---

## 🌟 Key Modules & Features

### 🎓 1. Student Portal
- **Dashboard & KPIs**: Real-time tracker for applications, shortlists, scheduled interviews, and received offers.
- **ATS Resume Auditor**: Computes an algorithmic ATS compatibility score (0-100), measures keyword relevance, action verb impact, section presence, and delivers actionable AI critique.
- **Interactive Resume Builder**: Multi-template switcher (Modern Tech, Classic Executive, Minimal ATS) with live document preview and 1-click printable PDF export.
- **Campus Opportunities Directory**: Search and filter full-time drives and summer internships with live AI match score badges (e.g. 92% Match).
- **Application Tracking System (ATS)**: Interactive Kanban board, Table view, and Timeline view spanning multi-stage hiring pipelines (*Applied* ➔ *Under Review* ➔ *Shortlisted* ➔ *Interview Scheduled* ➔ *Selected*).
- **AI Mock Interview Simulator**: Select target role (Full Stack, AI/ML, Cloud/DevOps, Data Science), difficulty, and focus type (Technical/HR/Behavioral); receive real-time per-answer evaluations and comprehensive final reports.
- **AI Skill-Gap Analyzer**: Benchmarks candidate skill sets against market standards with category progress gauges, prioritized missing skills, and 4-week structured learning roadmaps with project ideas and certifications.
- **Direct Messaging & Notifications**: Unified notification center and direct recruiter communication channels.

### 🏢 2. Corporate Recruiter & Employer Portal
- **Command Dashboard**: Active postings overview, applicant volume, shortlisted counts, and candidate conversion metrics.
- **Job & Internship Publisher**: Full-featured creation form for posting graduate campus drives and internships with eligibility CGPA cutoffs and stipend ranges.
- **Candidate Pipeline Manager**: Filter applicants by status and AI compatibility scores, review resumes, update statuses, add notes, and schedule video interview rounds with meeting links.
- **Recruiter Messaging**: Direct communication threads with candidates.
- **Recruitment Analytics**: Funnel conversion charts, applicant skill distributions, and selection rate analytics using Recharts.

### 🏛️ 3. University Placement Cell / Admin Portal
- **Governance Dashboard**: Institutional placement percentages, partner company counts, and active campus drives.
- **Company Verification**: Review and approve/reject employer registrations.
- **Opportunity Moderation**: Audit and approve campus drive listings before student publication.
- **User Management**: Inspect and activate or suspend student and employer accounts.
- **Placement Analytics**: Recharts visualizations for monthly placement velocity, department-wise placement rates, CTC salary distribution (LPA), and employer skill demand.
- **Immutable Audit Trail**: Tamper-proof security logging of all critical platform operations with actor, role, action, and metadata payloads.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15+ App Router, React 19, TypeScript, Tailwind CSS, Lucide React, Framer Motion |
| **Visualizations** | Recharts (Responsive Area, Bar, and Funnel charts) |
| **Backend** | Next.js Server & Route Handlers, Node.js, JWT, BcryptJS |
| **Database** | MongoDB, Mongoose, plus embedded high-speed memory store fallback |
| **AI Layer** | Configurable via `AI_PROVIDER` (Google Gemini 1.5 Flash / OpenAI GPT-4o-mini) + built-in algorithmic heuristic engine |
| **Testing** | Node.js Test Runner (`scripts/test-runner.mjs`) |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- Node.js `v18+` (Tested on Node `v24`)
- npm `v9+`

### 2. Installation
```bash
# Clone or navigate to the workspace
cd "d:/Janaa Proejct"

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Example configuration (`.env.local`):
```env
MONGODB_URI=mongodb://127.0.0.1:27017/placement_portal
JWT_SECRET=production-grade-jwt-secret-key-32-chars-long-placement-portal
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Provider ("gemini" | "openai")
AI_PROVIDER=gemini
GEMINI_API_KEY=
OPENAI_API_KEY=
```
*(Note: If no API key is supplied, CampusAI automatically runs on its built-in heuristic/hybrid engine so all features work reliably out of the box).*

### 4. Database Seeding & Testing
```bash
# Initialize seed data
npm run seed

# Run automated test suites (Auth, AI ATS, Job Matcher, Mock Interview, Skill Gap)
npm test

# Verify TypeScript types
npm run typecheck
```

### 5. Running the Application
```bash
# Start local development server
npm run dev

# Or build and launch production server
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 One-Click Demo Test Accounts

To simplify testing and reviewer evaluation, the login screen includes **1-click quick-fill buttons** for each primary role:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Student** | `aarav@example.com` | `Student@12345` | `/dashboard` |
| **Company Recruiter** | `recruiter@nexgen.com` | `Company@12345` | `/company/dashboard` |
| **Platform Administrator** | `admin@example.com` | `Admin@12345` | `/admin/dashboard` |

---

## 📁 Repository Directory Structure

```text
├── docs/                       # Technical Documentation
│   ├── architecture.md         # Full system architecture diagram & components
│   ├── api.md                  # REST API specification & schemas
│   ├── database.md             # Mongoose schemas & ERD documentation
│   ├── ai-system.md            # AI service layer design & algorithms
│   └── deployment.md           # Production deployment instructions (Vercel/Docker)
├── scripts/
│   ├── seed.mjs                # Database seeder script
│   └── test-runner.mjs         # Automated test suite runner
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register views
│   │   ├── (student)/          # Student dashboard, profile, ATS, jobs, interviews
│   │   ├── (company)/          # Recruiter dashboard, pipeline, job posting
│   │   ├── (admin)/            # Admin dashboard, user/company moderation, analytics
│   │   ├── api/                # REST API Route Handlers
│   │   ├── globals.css         # Modern design tokens & glassmorphism utilities
│   │   ├── layout.tsx          # Root application layout with SEO tags
│   │   └── page.tsx            # High-impact landing page
│   ├── components/
│   │   └── ui/                 # Reusable Navbar, Sidebar, modals
│   └── lib/
│       ├── auth/               # JWT token utilities & context extractor
│       ├── db/                 # Mongoose models & fallback memory persistence
│       ├── services/           # AI service layer (ATS, Matcher, Interview, SkillGap)
│       └── utils.ts            # Formatting & calculation utilities
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🧪 Testing Verification Summary

All test suites and production build verifications pass with **0 errors**:
- ✅ `npm test` — 6/6 test suites passed
- ✅ `npm run typecheck` — 0 TypeScript compiler errors
- ✅ `npm run build` — All 50 App Router routes compiled and static-optimized
