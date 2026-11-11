// CampusAI Database Seeder Script
// Usage: npm run seed or node scripts/seed.mjs

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/placement_portal";

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "company", "admin"], required: true },
    avatarUrl: { type: String, default: "" },
    isVerified: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    headline: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    department: { type: String, default: "" },
    graduationYear: { type: Number },
    cgpa: { type: Number },
    skills: { type: [String], default: [] },
    education: { type: [mongoose.Schema.Types.Mixed], default: [] },
    experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
    projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certifications: { type: [mongoose.Schema.Types.Mixed], default: [] },
    socialLinks: { type: mongoose.Schema.Types.Mixed, default: {} },
    preferredRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    workModePreference: { type: String, default: "any" },
    resumeUrl: { type: String, default: "" },
    profileCompletion: { type: Number, default: 25 },
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    companySize: { type: String, default: "" },
    industry: { type: String, default: "" },
    companyDescription: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    companyLocation: { type: String, default: "" },
    companyApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const JobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    title: { type: String, required: true },
    type: { type: String, enum: ["full-time", "internship", "part-time", "contract"], required: true },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experienceLevel: { type: String, default: "entry" },
    minExperienceYears: { type: Number, default: 0 },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryPeriod: { type: String, default: "year" },
    currency: { type: String, default: "INR" },
    location: { type: String, required: true },
    workMode: { type: String, default: "on-site" },
    deadline: { type: Date, required: true },
    openings: { type: Number, default: 1 },
    companyId: { type: mongoose.Schema.Types.Mixed, required: true },
    companyName: { type: String, required: true },
    companyLogo: { type: String, default: "" },
    department: { type: String, default: "" },
    educationRequirements: { type: String, default: "B.Tech / B.E. / MCA" },
    eligibilityCgpa: { type: Number, default: 6.0 },
    status: { type: String, default: "published" },
    approvalStatus: { type: String, default: "approved" },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ApplicationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    jobId: { type: mongoose.Schema.Types.Mixed, required: true },
    studentId: { type: mongoose.Schema.Types.Mixed, required: true },
    companyId: { type: mongoose.Schema.Types.Mixed, required: true },
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    studentPhone: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    coverLetter: { type: String, default: "" },
    status: { type: String, default: "Applied" },
    aiMatchScore: { type: Number, default: 75 },
    aiMatchDetails: { type: mongoose.Schema.Types.Mixed },
    notes: { type: String, default: "" },
    interviewDetails: { type: mongoose.Schema.Types.Mixed },
    appliedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const NotificationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    recipientId: { type: mongoose.Schema.Types.Mixed, required: true },
    senderId: { type: mongoose.Schema.Types.Mixed },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, default: "system" },
    link: { type: String, default: "" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MessageSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    conversationId: { type: String, required: true, index: true },
    senderId: { type: mongoose.Schema.Types.Mixed, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.Mixed, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SavedJobSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    studentId: { type: mongoose.Schema.Types.Mixed, required: true },
    jobId: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const AuditLogSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
    actorId: { type: mongoose.Schema.Types.Mixed, required: true },
    actorEmail: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);
const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);
const SavedJob = mongoose.models.SavedJob || mongoose.model("SavedJob", SavedJobSchema);
const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

async function runSeed() {
  console.log("==================================================");
  console.log("🌱 CampusAI Placement Portal - MongoDB Localhost Seeder");
  console.log(`Connecting to: ${MONGODB_URI}`);
  console.log("==================================================");

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Successfully connected to MongoDB localhost!");

    // Generate Passwords
    const adminPasswordHash = bcrypt.hashSync("Admin@12345", 8);
    const studentPasswordHash = bcrypt.hashSync("Student@12345", 8);
    const companyPasswordHash = bcrypt.hashSync("Company@12345", 8);

    // Users
    const users = [
      {
        _id: "user_admin_001",
        name: "Platform Administrator",
        email: "admin@example.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        status: "active",
      },
      {
        _id: "user_student_001",
        name: "Aarav Sharma",
        email: "aarav@example.com",
        passwordHash: studentPasswordHash,
        role: "student",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        status: "active",
        headline: "Full Stack Engineer | React, Node.js, Next.js & Cloud",
        phone: "+91 98765 43210",
        location: "Bengaluru, Karnataka",
        bio: "Passionate computer science student specializing in building scalable web applications and data-driven solutions.",
        department: "Computer Science & Engineering",
        graduationYear: 2026,
        cgpa: 8.8,
        skills: ["React", "TypeScript", "Node.js", "Next.js", "Express", "MongoDB", "PostgreSQL", "Tailwind CSS", "Git", "REST APIs"],
        education: [
          {
            institution: "National Institute of Technology",
            degree: "B.Tech",
            fieldOfStudy: "Computer Science & Engineering",
            startYear: 2022,
            endYear: 2026,
            grade: "8.8 CGPA",
          },
        ],
        experience: [
          {
            title: "Frontend Developer Intern",
            company: "InnovateTech Labs",
            location: "Bengaluru (Remote)",
            startDate: "2025-05",
            endDate: "2025-08",
            current: false,
            description: "Built responsive interactive dashboards using Next.js and optimized page load times by 35%.",
          },
        ],
        projects: [
          {
            title: "Smart Placement Portal",
            description: "Full-stack resume evaluator and interview practice platform using Next.js and TypeScript.",
            technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
            link: "https://github.com/aarav/placement-portal",
            github: "https://github.com/aarav/placement-portal",
          },
        ],
        certifications: [
          {
            name: "AWS Certified Cloud Practitioner",
            issuer: "Amazon Web Services",
            issueDate: "2025-03",
            credentialUrl: "https://aws.amazon.com/verify",
          },
        ],
        socialLinks: {
          github: "https://github.com/aaravsharma",
          linkedin: "https://linkedin.com/in/aaravsharma",
          portfolio: "https://aaravsharma.dev",
        },
        preferredRoles: ["Full Stack Developer", "Software Engineer", "Frontend Developer"],
        preferredLocations: ["Bengaluru", "Hyderabad", "Remote"],
        workModePreference: "hybrid",
        resumeUrl: "/sample-resume.pdf",
        profileCompletion: 95,
      },
      {
        _id: "user_student_002",
        name: "Priya Nair",
        email: "priya@example.com",
        passwordHash: studentPasswordHash,
        role: "student",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        status: "active",
        headline: "Machine Learning Enthusiast | Python, PyTorch & Data Science",
        phone: "+91 91234 56789",
        location: "Pune, Maharashtra",
        bio: "Pre-final year engineer focused on NLP, machine learning algorithms and computer vision research.",
        department: "Data Science & Machine Learning",
        graduationYear: 2026,
        cgpa: 9.1,
        skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "SQL", "FastAPI", "NLP", "Machine Learning"],
        education: [
          {
            institution: "Indian Institute of Information Technology",
            degree: "B.Tech",
            fieldOfStudy: "Data Science & Machine Learning",
            startYear: 2022,
            endYear: 2026,
            grade: "9.1 CGPA",
          },
        ],
        experience: [
          {
            title: "Machine Learning Research Intern",
            company: "Cortex Systems",
            location: "Pune",
            startDate: "2025-06",
            endDate: "2025-08",
            current: false,
            description: "Fine-tuned open-source LLMs on domain specific healthcare datasets achieving 89% accuracy.",
          },
        ],
        projects: [
          {
            title: "Automated Medical Document Summarizer",
            description: "Transformer-based extractive and abstractive clinical note summarizer.",
            technologies: ["Python", "HuggingFace", "FastAPI", "Streamlit"],
            link: "https://github.com/priya/medical-summarizer",
          },
        ],
        preferredRoles: ["Machine Learning Engineer", "Data Scientist"],
        preferredLocations: ["Bengaluru", "Pune", "Remote"],
        workModePreference: "remote",
        resumeUrl: "/sample-resume.pdf",
        profileCompletion: 90,
      },
      {
        _id: "user_company_001",
        name: "NexGen Technologies",
        email: "recruiter@nexgen.com",
        passwordHash: companyPasswordHash,
        role: "company",
        avatarUrl: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        status: "active",
        companyName: "NexGen Technologies",
        companyWebsite: "https://nexgentech.io",
        companySize: "500-1000 employees",
        industry: "Enterprise Cloud & SaaS",
        companyDescription: "NexGen Technologies develops next-generation enterprise distributed systems and cloud native tools.",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        companyLocation: "Bengaluru, Karnataka",
        companyApproved: true,
      },
      {
        _id: "user_company_002",
        name: "Apex Systems",
        email: "careers@apexsystems.example",
        passwordHash: companyPasswordHash,
        role: "company",
        avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
        isVerified: true,
        status: "active",
        companyName: "Apex Systems",
        companyWebsite: "https://apexsystems.example",
        companySize: "200-500 employees",
        industry: "Machine Learning & Robotics",
        companyDescription: "Building intelligent automation and machine-learning products for enterprise teams.",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        companyLocation: "Hyderabad, Telangana",
        companyApproved: true,
      },
    ];

    // Jobs
    const jobs = [
      {
        _id: "job_001",
        title: "Graduate Software Engineer (Full Stack)",
        type: "full-time",
        description: "Join NexGen's Core Engineering team to build high-scale, cloud-native enterprise web platforms. You will collaborate directly with seasoned architects and ship production features from day one.",
        responsibilities: [
          "Develop scalable web frontend features using React, TypeScript, and modern CSS frameworks.",
          "Implement high-throughput RESTful and GraphQL APIs using Node.js/Express.",
          "Design schema models and optimize query performance in MongoDB and PostgreSQL.",
          "Participate in agile sprints, code reviews, and automated CI/CD deployment pipelines.",
        ],
        requirements: [
          "Bachelor's degree in Computer Science, Information Technology or related discipline.",
          "Strong foundation in data structures, algorithms, and object-oriented programming.",
          "Hands-on proficiency with React, TypeScript, Node.js, and modern web development.",
          "Familiarity with Git, database indexing, and API design.",
        ],
        skills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "REST APIs", "Tailwind CSS"],
        experienceLevel: "entry",
        minExperienceYears: 0,
        salaryMin: 1200000,
        salaryMax: 1600000,
        salaryPeriod: "year",
        currency: "INR",
        location: "Bengaluru, Karnataka",
        workMode: "hybrid",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        openings: 5,
        companyId: "user_company_001",
        companyName: "NexGen Technologies",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        department: "Core Engineering",
        educationRequirements: "B.Tech / B.E. in CSE, IT, or ECE",
        eligibilityCgpa: 7.5,
        status: "published",
        approvalStatus: "approved",
        applicantsCount: 1,
      },
      {
        _id: "job_002",
        title: "Machine Learning Engineer (NLP & GenAI)",
        type: "full-time",
        description: "Apex Systems is seeking talented graduates to contribute to our real-time natural language reasoning platform. You will train, benchmark, and deploy cutting-edge foundation models on high-performance GPU clusters.",
        responsibilities: [
          "Curate domain-specific instruction datasets and build synthetic data generation pipelines.",
          "Fine-tune transformer models using PyTorch, HuggingFace transformers, and DeepSpeed.",
          "Deploy low-latency inference endpoints with FastAPI, Triton, and Docker.",
          "Evaluate generative accuracy, hallucination rates, and model safety parameters.",
        ],
        requirements: [
          "Degree in Computer Science, AI, Data Science or related technical discipline.",
          "Strong command of Python, PyTorch, Linear Algebra, and Deep Learning principles.",
          "Experience with fine-tuning LLMs, LoRA, and quantization techniques.",
          "Proficiency in containerization (Docker) and REST/gRPC microservices.",
        ],
        skills: ["Python", "PyTorch", "HuggingFace", "NLP", "FastAPI", "Docker", "Machine Learning"],
        experienceLevel: "entry",
        minExperienceYears: 0,
        salaryMin: 1400000,
        salaryMax: 1900000,
        salaryPeriod: "year",
        currency: "INR",
        location: "Hyderabad, Telangana",
        workMode: "on-site",
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        openings: 3,
        companyId: "user_company_002",
        companyName: "Apex Systems",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        department: "AI Research",
        educationRequirements: "B.Tech / M.Tech in CSE / Data Science",
        eligibilityCgpa: 8.0,
        status: "published",
        approvalStatus: "approved",
        applicantsCount: 1,
      },
      {
        _id: "job_003",
        title: "Cloud Infrastructure & DevOps Engineer",
        type: "full-time",
        description: "Join NexGen's Platform Reliability team to maintain multi-region Kubernetes clusters and streamline automated software releases across hybrid cloud footprints.",
        responsibilities: [
          "Manage Terraform IaC modules for automated AWS infrastructure provisioning.",
          "Operate Kubernetes clusters and implement Prometheus/Grafana monitoring alerts.",
          "Enhance GitHub Actions CI/CD workflows for container build, test, and release.",
        ],
        requirements: [
          "Degree in Computer Science, Information Technology, or relevant discipline.",
          "Knowledge of Linux systems, bash scripting, networking protocols, and Docker.",
          "Hands-on experience with AWS services (EC2, S3, RDS, EKS) and Terraform.",
        ],
        skills: ["Linux", "AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Bash"],
        experienceLevel: "entry",
        minExperienceYears: 0,
        salaryMin: 1100000,
        salaryMax: 1500000,
        salaryPeriod: "year",
        currency: "INR",
        location: "Bengaluru, Karnataka",
        workMode: "hybrid",
        deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        openings: 2,
        companyId: "user_company_001",
        companyName: "NexGen Technologies",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        department: "DevOps & Infrastructure",
        educationRequirements: "B.Tech / B.E. in CSE / IT",
        eligibilityCgpa: 7.0,
        status: "published",
        approvalStatus: "approved",
        applicantsCount: 0,
      },
      {
        _id: "job_004",
        title: "Frontend Engineering Intern (Summer 2026)",
        type: "internship",
        description: "NexGen is hiring enthusiastic frontend engineering interns for our Summer 2026 cohort. You'll build slick web interfaces, craft reusable component libraries, and master modern frontend tools.",
        responsibilities: [
          "Build reusable UI components in React, Next.js, and Tailwind CSS.",
          "Write unit tests with Jest and React Testing Library.",
          "Collaborate with UX designers to translate Figma mockups into pixel-perfect web apps.",
        ],
        requirements: [
          "Currently pursuing B.Tech/B.E. graduating in 2026 or 2027.",
          "Proficiency in JavaScript, TypeScript, HTML, CSS, and React basics.",
          "Strong aesthetic eye for modern UI details and responsiveness.",
        ],
        skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git"],
        experienceLevel: "entry",
        minExperienceYears: 0,
        salaryMin: 45000,
        salaryMax: 60000,
        salaryPeriod: "month",
        currency: "INR",
        location: "Bengaluru, Karnataka",
        workMode: "remote",
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        openings: 8,
        companyId: "user_company_001",
        companyName: "NexGen Technologies",
        companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
        department: "Product Engineering",
        educationRequirements: "Enrolled in B.Tech / MCA",
        eligibilityCgpa: 7.0,
        status: "published",
        approvalStatus: "approved",
        applicantsCount: 0,
      },
    ];

    // Applications
    const applications = [
      {
        _id: "app_001",
        jobId: "job_001",
        studentId: "user_student_001",
        companyId: "user_company_001",
        jobTitle: "Graduate Software Engineer (Full Stack)",
        companyName: "NexGen Technologies",
        studentName: "Aarav Sharma",
        studentEmail: "aarav@example.com",
        studentPhone: "+91 98765 43210",
        resumeUrl: "/sample-resume.pdf",
        coverLetter: "I am eager to contribute my hands-on React and Node.js experience to NexGen's engineering team.",
        status: "Shortlisted",
        aiMatchScore: 92,
        aiMatchDetails: {
          overallScore: 92,
          skillsScore: 95,
          experienceScore: 90,
          educationScore: 92,
          matchedSkills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "REST APIs"],
          missingSkills: [],
          explanation: "Strong match. Candidate has direct project and internship background in React, TypeScript, Node.js, and MongoDB.",
        },
        interviewDetails: {
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          roundName: "Technical Round 1 (System Design & Coding)",
          meetingLink: "https://meet.google.com/abc-defg-hij",
          interviewerName: "Sanjay Verma (Lead Architect)",
          instructions: "Please be ready to share screen for live coding and review your microservices project.",
        },
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        _id: "app_002",
        jobId: "job_002",
        studentId: "user_student_002",
        companyId: "user_company_002",
        jobTitle: "Machine Learning Engineer (NLP & GenAI)",
        companyName: "Apex Systems",
        studentName: "Priya Nair",
        studentEmail: "priya@example.com",
        studentPhone: "+91 91234 56789",
        resumeUrl: "/sample-resume.pdf",
        coverLetter: "Passionate about LLM fine-tuning and deployment pipelines.",
        status: "Under Review",
        aiMatchScore: 94,
        aiMatchDetails: {
          overallScore: 94,
          skillsScore: 96,
          experienceScore: 92,
          educationScore: 95,
          matchedSkills: ["Python", "PyTorch", "HuggingFace", "NLP", "FastAPI", "Machine Learning"],
          missingSkills: ["Docker"],
          explanation: "Outstanding match with proven research internship and portfolio in PyTorch and transformer fine-tuning.",
        },
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    // Notifications
    const notifications = [
      {
        _id: "notif_001",
        recipientId: "user_student_001",
        title: "Application Shortlisted!",
        message: "Congratulations! NexGen Technologies has shortlisted your application for Graduate Software Engineer.",
        type: "application_status",
        link: "/applications",
        read: false,
      },
      {
        _id: "notif_002",
        recipientId: "user_student_001",
        title: "Technical Interview Scheduled",
        message: "Your Technical Round 1 interview with Sanjay Verma is scheduled for 3 days from now.",
        type: "interview_scheduled",
        link: "/applications",
        read: false,
      },
      {
        _id: "notif_003",
        recipientId: "user_company_001",
        title: "New Top Candidate Application",
        message: "Aarav Sharma applied for Graduate Software Engineer (Full Stack) with 92% match score.",
        type: "application_status",
        link: "/company/applicants",
        read: false,
      },
    ];

    // Messages
    const messages = [
      {
        _id: "msg_001",
        conversationId: "conv_user_company_001_user_student_001",
        senderId: "user_company_001",
        senderName: "NexGen Technologies",
        senderRole: "company",
        recipientId: "user_student_001",
        content: "Hi Aarav, our engineering panel reviewed your GitHub repositories and was thoroughly impressed. We've scheduled Technical Round 1.",
        read: true,
      },
      {
        _id: "msg_002",
        conversationId: "conv_user_company_001_user_student_001",
        senderId: "user_student_001",
        senderName: "Aarav Sharma",
        senderRole: "student",
        recipientId: "user_company_001",
        content: "Thank you so much! I look forward to meeting the team and discussing my technical background.",
        read: false,
      },
    ];

    // Saved Jobs
    const savedJobs = [
      {
        _id: "saved_001",
        studentId: "user_student_001",
        jobId: "job_002",
      },
    ];

    // Audit Logs
    const auditLogs = [
      {
        _id: "audit_init_001",
        actorId: "user_admin_001",
        actorEmail: "admin@example.com",
        actorRole: "admin",
        action: "Initialized Placement Portal Database",
        entity: "System",
        entityId: "system_init",
        metadata: { status: "initialized", target: "localhost:27017" },
      },
    ];

    console.log("Upserting seed documents to MongoDB...");

    // Upsert Users
    for (const u of users) {
      await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
    }
    console.log(`✅ Users seeded: ${users.length}`);

    // Upsert Jobs
    for (const j of jobs) {
      await Job.updateOne({ _id: j._id }, { $set: j }, { upsert: true });
    }
    console.log(`✅ Jobs seeded: ${jobs.length}`);

    // Upsert Applications
    for (const a of applications) {
      await Application.updateOne({ _id: a._id }, { $set: a }, { upsert: true });
    }
    console.log(`✅ Applications seeded: ${applications.length}`);

    // Upsert Notifications
    for (const n of notifications) {
      await Notification.updateOne({ _id: n._id }, { $set: n }, { upsert: true });
    }
    console.log(`✅ Notifications seeded: ${notifications.length}`);

    // Upsert Messages
    for (const m of messages) {
      await Message.updateOne({ _id: m._id }, { $set: m }, { upsert: true });
    }
    console.log(`✅ Messages seeded: ${messages.length}`);

    // Upsert Saved Jobs
    for (const s of savedJobs) {
      await SavedJob.updateOne(
        { studentId: s.studentId, jobId: s.jobId },
        { $set: s },
        { upsert: true }
      );
    }
    console.log(`✅ Saved Jobs seeded: ${savedJobs.length}`);

    // Upsert Audit Logs
    for (const al of auditLogs) {
      await AuditLog.updateOne({ _id: al._id }, { $set: al }, { upsert: true });
    }
    console.log(`✅ Audit Logs seeded: ${auditLogs.length}`);

    console.log("\n==================================================");
    console.log("🎉 MongoDB Localhost Seeding Completed Successfully!");
    console.log("==================================================");
    console.log("Default User Credentials:");
    console.log("  • Admin:     admin@example.com          / Admin@12345");
    console.log("  • Student:   aarav@example.com          / Student@12345");
    console.log("  • Student 2: priya@example.com          / Student@12345");
    console.log("  • Recruiter: recruiter@nexgen.com       / Company@12345");
    console.log("  • Recruiter 2: careers@apexsystems.example / Company@12345");
    console.log("==================================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed with error:", err);
    process.exit(1);
  }
}

runSeed();
