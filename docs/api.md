# REST API Reference: CampusAI Placement Portal

All endpoints return JSON wrapped responses conforming to:
```json
{
  "success": true,
  "message": "Optional status message",
  "data": {}
}
```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new account (Student or Company Recruiter) and issues an authentication session token.
- **Request Body**: `{ name, email, password, role, companyName?, headline?, skills? }`
- **Response**: `{ success: true, user: IUser, token: string }`

### `POST /api/auth/login`
Authenticates credentials and establishes session cookie (`auth_token`).
- **Request Body**: `{ email, password }`
- **Response**: `{ success: true, user: IUser, token: string }`

### `GET /api/auth/me`
Verifies and returns the active authenticated user profile.
- **Response**: `{ success: true, user: IUser }`

### `POST /api/auth/logout`
Terminates user session and removes authentication cookie.

---

## 2. Profile Management

### `GET /api/users/profile`
Fetches complete profile details for the authenticated user.

### `PUT /api/users/profile`
Updates profile information (headline, phone, location, bio, skills, education, projects, certifications, preferences). Auto-recalculates profile completion percentage.

---

## 3. Opportunities & Jobs

### `GET /api/jobs`
Searches and filters active opportunities.
- **Query Parameters**:
  - `search`: string keyword
  - `type`: "full-time" | "internship"
  - `workMode`: "remote" | "hybrid" | "on-site"
  - `companyId`: string filter

### `POST /api/jobs`
Posts a new campus drive or internship listing (Recruiter/Admin only).

### `GET /api/jobs/:id`
Retrieves comprehensive details for a specific opening.

### `PUT /api/jobs/:id`
Modifies job criteria and details (Creator/Admin only).

### `DELETE /api/jobs/:id`
Deletes or archives a job posting.

### `POST /api/jobs/:id/apply`
Submits an application, automatically executes the AI matching engine, and alerts the employer.

### `POST /api/jobs/:id/save`
Toggles saving/bookmarking an opportunity.

---

## 4. Application Tracking System

### `GET /api/applications`
Lists applications filtered by user role (Student sees their submissions; Recruiter sees their incoming applicants).

### `PUT /api/applications/:id`
Updates application stage (`Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`), attaches interview scheduling metadata, and notifies candidate.

---

## 5. AI Service Endpoints

### `POST /api/ai/ats-check`
Audits plaintext or markdown resume against ATS standards and optional job descriptions. Accepts JSON (`resumeText`, optional `jobDescription`) or multipart form data with a `resume` file (PDF, DOCX, or TXT, up to 5 MB). Set `parseOnly=true` on multipart requests to extract text without running the audit.
- **Response**: Scores for Keyword Match, Skills Match, Experience Match, Formatting, Action Verbs, and AI suggestions.

### `POST /api/ai/job-match`
Executes hybrid matching algorithm between candidate competencies and job requirements.

### `POST /api/ai/skill-gap`
Benchmarks student skills against target engineering roles, returning category coverage, missing skills, and week-by-week learning paths.

### `POST /api/ai/interview/generate`
Generates role-specific questions across technical, behavioral, and HR categories.

### `POST /api/ai/interview/evaluate`
Critiques candidate answers with technical accuracy score, communication score, strengths, and improvement suggestions.

---

## 6. Admin & Analytics

### `GET /api/admin/stats`
Returns aggregated placement metrics and datasets for Recharts visualizations.

### `GET /api/admin/users` & `PUT /api/admin/users`
List and manage (activate/suspend) user accounts.

### `GET /api/admin/companies` & `PUT /api/admin/companies`
Review and approve employer partner accreditation.

### `GET /api/admin/jobs` & `PUT /api/admin/jobs`
Moderate and approve posted campus opportunities.

### `GET /api/admin/audit-logs`
Inspect audit records with actor, action, timestamp, and metadata payload.
