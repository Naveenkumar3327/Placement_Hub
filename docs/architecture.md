# System Architecture: AI-Based Internship & Placement Portal (CampusAI)

## 1. High-Level Architecture Overview

CampusAI is designed with a modern, modular, TypeScript-first Full-Stack Next.js 15+ App Router architecture. It unifies students, corporate recruiters, and university placement cells through specialized role-based views and an intelligent, deterministic-and-semantic hybrid AI layer.

```
                    ┌──────────────────────────────┐
                    │      Client Application      │
                    │  (Next.js App Router, React) │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   Next.js API Edge/Server    │
                    │    - JWT Authentication      │
                    │    - Role Authorization      │
                    │    - Audit Logging Service   │
                    └──────┬───────────────┬───────┘
                           │               │
            ┌──────────────▼────┐    ┌─────▼──────────────┐
            │ Modular AI Layer  │    │  Database Layer    │
            │ - ATS Scanner     │    │ - MongoDB Atlas    │
            │ - Job Matcher     │    │ - Mongoose Schemas │
            │ - Interview Gen   │    │ - Local Store      │
            │ - Skill Gap Audit │    │   Persistence      │
            └───────────────────┘    └────────────────────┘
```

---

## 2. Layered Modules

### 2.1 Frontend Presentation Tier
- **Framework**: Next.js 15+ App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom Glassmorphism and modern gradient themes
- **Icons & Animation**: Lucide React, Framer Motion
- **Data Visualization**: Recharts (multi-axis area charts, responsive bar charts, radial gauges)
- **Role Scoping**: Route groups `(auth)`, `(student)`, `(company)`, and `(admin)`

### 2.2 API & Business Logic Tier
- RESTful HTTP endpoints situated within `src/app/api/`
- Standardized HTTP status codes and uniform JSON response envelopes
- Centralized JWT verification supporting HTTP-only cookies and Authorization headers
- Dedicated Audit Logging Service capturing all administrative and lifecycle mutations

### 2.3 Modular AI Service Tier
- Abstracted `AiProvider` interface supporting Google Gemini API and OpenAI API via environment variables
- Resilient local deterministic algorithms ensuring zero downtime even in offline demo modes
- Hybrid semantic ranking: combined skill matching, experience relevance, and LLM explanation generation

### 2.4 Data Tier
- Mongoose ORM models with strict indexing, schema validations, and timestamps
- Resilient local persistence store fallback preventing crashes when MongoDB daemons are offline
- Immutable audit log collection tracking actor, action, timestamp, and metadata payload
