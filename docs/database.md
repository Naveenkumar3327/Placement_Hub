# Database Architecture & Schemas: CampusAI

CampusAI utilizes a hybrid persistence architecture combining MongoDB / Mongoose with an in-memory & persisted fallback engine (`memoryDb.ts`) to ensure 100% operational reliability in both local dev environments and cloud deployments.

---

## 1. Entity Relationship Overview

```
 [User (Student / Company / Admin)]
       │                      │
       │ (1:N)                │ (1:N)
       ▼                      ▼
  [Application]  ◄───────  [Job / Internship]
       │
       ├──── [Interview Record]
       ├──── [Notification]
       └──── [AuditLog]
```

---

## 2. Core Schemas

### `User`
- `_id`: String / ObjectId
- `name`: String
- `email`: String (Unique, Indexed)
- `passwordHash`: String (Bcrypt salt rounds: 10)
- `role`: "student" | "company" | "admin"
- `avatarUrl`: String
- `status`: "active" | "suspended" | "pending"
- **Student Profile Fields**:
  - `headline`: String
  - `phone`, `location`, `bio`: String
  - `department`: String
  - `graduationYear`: Number
  - `cgpa`: Number
  - `skills`: String[]
  - `education`: Array of `{ institution, degree, fieldOfStudy, startYear, endYear, grade }`
  - `experience`: Array of `{ title, company, location, startDate, endDate, current, description }`
  - `projects`: Array of `{ title, description, technologies, link, github }`
  - `certifications`: Array of `{ name, issuer, issueDate, credentialUrl }`
  - `socialLinks`: `{ github, linkedin, portfolio }`
  - `preferredRoles`, `preferredLocations`: String[]
  - `workModePreference`: "remote" | "hybrid" | "on-site" | "any"
  - `profileCompletion`: Number (0-100)
- **Company Profile Fields**:
  - `companyName`, `companyWebsite`, `companySize`, `industry`: String
  - `companyDescription`, `companyLogo`, `companyLocation`: String
  - `companyApproved`: Boolean (verified employer accreditation)

### `Job`
- `title`: String
- `type`: "full-time" | "internship" | "part-time" | "contract"
- `description`, `location`: String
- `responsibilities`, `requirements`, `skills`: String[]
- `experienceLevel`: "entry" | "mid" | "senior" | "lead"
- `salaryMin`, `salaryMax`: Number
- `salaryPeriod`: "year" | "month"
- `currency`: String ("INR")
- `workMode`: "remote" | "hybrid" | "on-site"
- `deadline`: Date
- `openings`: Number
- `companyId`: Mixed (Indexed)
- `companyName`, `companyLogo`: String
- `eligibilityCgpa`: Number
- `status`: "published" | "draft" | "closed"
- `approvalStatus`: "approved" | "pending" | "rejected"
- `applicantsCount`: Number

### `Application`
- `jobId`: Mixed (Indexed)
- `studentId`: Mixed (Indexed)
- `companyId`: Mixed (Indexed)
- `jobTitle`, `companyName`, `studentName`, `studentEmail`: String
- `resumeUrl`, `coverLetter`: String
- `status`: "Applied" | "Under Review" | "Shortlisted" | "Interview Scheduled" | "Interview Completed" | "Selected" | "Rejected" | "Withdrawn"
- `aiMatchScore`: Number (0-100)
- `aiMatchDetails`: Object (skillsScore, experienceScore, educationScore, matchedSkills, missingSkills, explanation)
- `interviewDetails`: `{ scheduledDate, roundName, meetingLink, interviewerName, instructions }`
- `appliedDate`, `updatedAt`: Date

### `Interview`
- `studentId`: Mixed
- `targetRole`: String
- `difficulty`: "junior" | "mid" | "senior"
- `type`: "technical" | "hr" | "behavioral" | "mixed"
- `overallScore`, `technicalScore`, `communicationScore`, `problemSolvingScore`: Number
- `strengths`, `weaknesses`, `recommendations`: String[]
- `questionsAndAnswers`: Array of `{ questionId, question, category, userAnswer, feedback, score, strengths, improvements }`

### `Notification`
- `recipientId`: Mixed (Indexed)
- `title`, `message`: String
- `type`: "application_status" | "job_recommendation" | "interview_scheduled" | "resume_analysis" | "message_received" | "company_approval" | "system"
- `link`: String
- `read`: Boolean

### `Message`
- `conversationId`: String (Indexed)
- `senderId`, `recipientId`: Mixed (Indexed)
- `senderName`, `senderRole`, `content`: String
- `read`: Boolean

### `AuditLog`
- `actorId`: Mixed
- `actorEmail`, `actorRole`: String
- `action`: String
- `entity`: "User" | "Job" | "Application" | "Interview" | "System"
- `entityId`: String
- `metadata`: Mixed
- `createdAt`: Date
