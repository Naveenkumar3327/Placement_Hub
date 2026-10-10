// Resilient in-memory database storage with persistent initial seeds
// Ensures 100% operation even when a local MongoDB daemon is not currently active.

import bcrypt from "bcryptjs";

export interface MemoryDbStore {
  users: any[];
  jobs: any[];
  applications: any[];
  interviews: any[];
  notifications: any[];
  messages: any[];
  auditLogs: any[];
  savedJobs: any[];
}

declare global {
  // eslint-disable-next-line no-var
  var __memoryDb: MemoryDbStore | undefined;
}

function initSeedData(): MemoryDbStore {
  const adminPasswordHash = bcrypt.hashSync("Admin@12345", 8);
  const studentPasswordHash = bcrypt.hashSync("Student@12345", 8);
  const companyPasswordHash = bcrypt.hashSync("Company@12345", 8);

  const adminUser = {
    _id: "user_admin_001",
    name: "Platform Administrator",
    email: "admin@example.com",
    passwordHash: adminPasswordHash,
    role: "admin",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    status: "active",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };

  const studentUser1 = {
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
    bio: "Passionate computer science student specializing in building scalable web applications and AI-driven solutions.",
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
        title: "AI Smart Placement Portal",
        description: "Full-stack ATS resume evaluator and AI mock interview platform using Next.js and TypeScript.",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB"],
        link: "https://github.com/aarav/placement-portal",
        github: "https://github.com/aarav/placement-portal",
      },
      {
        title: "E-Commerce Microservices Platform",
        description: "High concurrency order matching service with distributed caching and event streaming.",
        technologies: ["Node.js", "Express", "Redis", "Docker"],
        link: "https://github.com/aarav/ecommerce-microservices",
        github: "https://github.com/aarav/ecommerce-microservices",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        issueDate: "2025-03",
        credentialUrl: "https://aws.amazon.com/verify",
      },
      {
        name: "Meta Front-End Developer Specialization",
        issuer: "Coursera",
        issueDate: "2024-11",
        credentialUrl: "https://coursera.org/verify",
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
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  };

  const studentUser2 = {
    _id: "user_student_002",
    name: "Priya Nair",
    email: "priya@example.com",
    passwordHash: studentPasswordHash,
    role: "student",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    status: "active",
    headline: "AI/ML Enthusiast | Python, PyTorch & Data Science",
    phone: "+91 91234 56789",
    location: "Pune, Maharashtra",
    bio: "Pre-final year engineer focused on NLP, machine learning algorithms and computer vision research.",
    department: "Artificial Intelligence & Data Science",
    graduationYear: 2026,
    cgpa: 9.1,
    skills: ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "SQL", "FastAPI", "NLP", "Machine Learning"],
    education: [
      {
        institution: "Indian Institute of Information Technology",
        degree: "B.Tech",
        fieldOfStudy: "AI & Data Science",
        startYear: 2022,
        endYear: 2026,
        grade: "9.1 CGPA",
      },
    ],
    experience: [
      {
        title: "Machine Learning Research Intern",
        company: "Cortex AI Systems",
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
    certifications: [
      {
        name: "Deep Learning Specialization",
        issuer: "DeepLearning.AI",
        issueDate: "2025-01",
      },
    ],
    socialLinks: {
      github: "https://github.com/priyanair",
      linkedin: "https://linkedin.com/in/priyanair",
      portfolio: "https://priyanair.ai",
    },
    preferredRoles: ["Machine Learning Engineer", "Data Scientist", "AI Researcher"],
    preferredLocations: ["Bengaluru", "Pune", "Remote"],
    workModePreference: "remote",
    resumeUrl: "/sample-resume.pdf",
    profileCompletion: 90,
    createdAt: new Date("2026-02-01"),
    updatedAt: new Date("2026-02-01"),
  };

  const companyUser1 = {
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
    createdAt: new Date("2026-01-10"),
    updatedAt: new Date("2026-01-10"),
  };

  const companyUser2 = {
    _id: "user_company_002",
    name: "Apex AI Solutions",
    email: "careers@apexai.com",
    passwordHash: companyPasswordHash,
    role: "company",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    isVerified: true,
    status: "active",
    companyName: "Apex AI Solutions",
    companyWebsite: "https://apexai.solutions",
    companySize: "200-500 employees",
    industry: "Artificial Intelligence & Robotics",
    companyDescription: "Leading the revolution in intelligent automation and generative AI enterprise integrations.",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    companyLocation: "Hyderabad, Telangana",
    companyApproved: true,
    createdAt: new Date("2026-01-12"),
    updatedAt: new Date("2026-01-12"),
  };

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
      deadline: new Date("2026-12-31"),
      openings: 5,
      companyId: "user_company_001",
      companyName: "NexGen Technologies",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      department: "Engineering",
      educationRequirements: "B.Tech / B.E. / MCA (Minimum 7.0 CGPA)",
      eligibilityCgpa: 7.0,
      status: "published",
      approvalStatus: "approved",
      applicantsCount: 3,
      createdAt: new Date("2026-01-20"),
      updatedAt: new Date("2026-01-20"),
    },
    {
      _id: "job_002",
      title: "AI / Machine Learning Engineer",
      type: "full-time",
      description: "Apex AI Solutions is looking for exceptional talent to build generative AI solutions and autonomous agent frameworks.",
      responsibilities: [
        "Develop and evaluate machine learning models for computer vision and NLP tasks.",
        "Fine-tune Large Language Models (LLMs) and build retrieval-augmented generation (RAG) pipelines.",
        "Optimize inference throughput on GPU hardware.",
        "Work with software engineers to deploy ML microservices via Docker and Kubernetes.",
      ],
      requirements: [
        "B.Tech/M.Tech in AI, Data Science, CSE or related field.",
        "Proficiency in Python, PyTorch or TensorFlow, and scientific computing libraries.",
        "Understanding of transformers, vector databases, and modern NLP architectures.",
      ],
      skills: ["Python", "PyTorch", "NLP", "Machine Learning", "FastAPI", "Docker", "SQL"],
      experienceLevel: "entry",
      minExperienceYears: 0,
      salaryMin: 1400000,
      salaryMax: 1900000,
      salaryPeriod: "year",
      currency: "INR",
      location: "Hyderabad, Telangana",
      workMode: "remote",
      deadline: new Date("2026-11-30"),
      openings: 3,
      companyId: "user_company_002",
      companyName: "Apex AI Solutions",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      department: "AI Research",
      educationRequirements: "B.Tech / M.Tech in CS/AI",
      eligibilityCgpa: 7.5,
      status: "published",
      approvalStatus: "approved",
      applicantsCount: 2,
      createdAt: new Date("2026-01-22"),
      updatedAt: new Date("2026-01-22"),
    },
    {
      _id: "job_003",
      title: "Frontend Engineering Intern (Summer 2026)",
      type: "internship",
      description: "Exciting 6-month internship program for pre-final and final year students eager to craft high-fidelity digital experiences.",
      responsibilities: [
        "Build rich UI components using React, Next.js, and Tailwind CSS.",
        "Translate Figma prototypes into pixel-perfect, accessible code.",
        "Write unit tests and collaborate with senior mentors.",
      ],
      requirements: [
        "Currently pursuing B.Tech/B.E./BCA in Computer Science or related branch.",
        "Solid command of HTML5, CSS3, JavaScript/TypeScript, and React.",
      ],
      skills: ["React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git"],
      experienceLevel: "entry",
      minExperienceYears: 0,
      salaryMin: 45000,
      salaryMax: 60000,
      salaryPeriod: "month",
      currency: "INR",
      location: "Bengaluru, Karnataka",
      workMode: "hybrid",
      deadline: new Date("2026-10-31"),
      openings: 8,
      companyId: "user_company_001",
      companyName: "NexGen Technologies",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      department: "Frontend Engineering",
      educationRequirements: "B.Tech / BCA (Any Branch)",
      eligibilityCgpa: 6.5,
      status: "published",
      approvalStatus: "approved",
      applicantsCount: 5,
      createdAt: new Date("2026-02-01"),
      updatedAt: new Date("2026-02-01"),
    },
    {
      _id: "job_004",
      title: "Cloud & DevOps Intern",
      type: "internship",
      description: "Hands-on internship working on AWS infrastructure, CI/CD automation, and container orchestration.",
      responsibilities: [
        "Automate infrastructure deployments using Terraform and GitHub Actions.",
        "Monitor containerized services using Prometheus and Grafana.",
        "Assist in maintaining high reliability production clusters.",
      ],
      requirements: [
        "Understanding of Linux OS fundamentals and bash scripting.",
        "Familiarity with Docker and basic cloud concepts (AWS / GCP / Azure).",
      ],
      skills: ["Docker", "AWS", "Linux", "CI/CD", "Git", "Python"],
      experienceLevel: "entry",
      minExperienceYears: 0,
      salaryMin: 40000,
      salaryMax: 50000,
      salaryPeriod: "month",
      currency: "INR",
      location: "Pune, Maharashtra",
      workMode: "remote",
      deadline: new Date("2026-11-15"),
      openings: 2,
      companyId: "user_company_002",
      companyName: "Apex AI Solutions",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
      department: "Infrastructure",
      educationRequirements: "B.Tech / B.E.",
      eligibilityCgpa: 6.0,
      status: "published",
      approvalStatus: "approved",
      applicantsCount: 1,
      createdAt: new Date("2026-02-05"),
      updatedAt: new Date("2026-02-05"),
    },
  ];

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
      coverLetter: "I am passionate about full-stack engineering and would love to bring my React and Node.js skills to NexGen.",
      status: "Shortlisted",
      aiMatchScore: 92,
      aiMatchDetails: {
        overallScore: 92,
        skillsScore: 95,
        experienceScore: 88,
        educationScore: 92,
        matchedSkills: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "REST APIs", "Tailwind CSS"],
        missingSkills: [],
        explanation: "Candidate demonstrates strong alignment with core tech stack and hands-on internship experience in Next.js/React.",
      },
      appliedDate: new Date("2026-02-02"),
      updatedAt: new Date("2026-02-08"),
    },
    {
      _id: "app_002",
      jobId: "job_002",
      studentId: "user_student_002",
      companyId: "user_company_002",
      jobTitle: "AI / Machine Learning Engineer",
      companyName: "Apex AI Solutions",
      studentName: "Priya Nair",
      studentEmail: "priya@example.com",
      studentPhone: "+91 91234 56789",
      resumeUrl: "/sample-resume.pdf",
      status: "Interview Scheduled",
      aiMatchScore: 89,
      aiMatchDetails: {
        overallScore: 89,
        skillsScore: 92,
        experienceScore: 85,
        educationScore: 90,
        matchedSkills: ["Python", "PyTorch", "NLP", "Machine Learning", "FastAPI", "SQL"],
        missingSkills: ["Docker"],
        explanation: "Exceptional machine learning research foundation with practical LLM fine-tuning project experience.",
      },
      interviewDetails: {
        scheduledDate: new Date("2026-03-15T10:00:00Z"),
        roundName: "Technical Round 1 (System & ML Design)",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        interviewerName: "Dr. Vikram Seth (Head of AI)",
        instructions: "Please be ready to share screen and walkthrough previous machine learning projects.",
      },
      appliedDate: new Date("2026-02-04"),
      updatedAt: new Date("2026-02-10"),
    },
    {
      _id: "app_003",
      jobId: "job_003",
      studentId: "user_student_001",
      companyId: "user_company_001",
      jobTitle: "Frontend Engineering Intern (Summer 2026)",
      companyName: "NexGen Technologies",
      studentName: "Aarav Sharma",
      studentEmail: "aarav@example.com",
      status: "Applied",
      aiMatchScore: 96,
      aiMatchDetails: {
        overallScore: 96,
        skillsScore: 100,
        experienceScore: 92,
        educationScore: 95,
        matchedSkills: ["React", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "Git"],
        missingSkills: [],
        explanation: "100% skill match with prior verified frontend internship credentials.",
      },
      appliedDate: new Date("2026-02-06"),
      updatedAt: new Date("2026-02-06"),
    },
  ];

  const notifications = [
    {
      _id: "notif_001",
      recipientId: "user_student_001",
      title: "Application Shortlisted!",
      message: "NexGen Technologies has shortlisted your application for Graduate Software Engineer (Full Stack).",
      type: "application_status",
      link: "/applications",
      read: false,
      createdAt: new Date("2026-02-08T14:30:00Z"),
    },
    {
      _id: "notif_002",
      recipientId: "user_student_002",
      title: "Interview Scheduled",
      message: "Apex AI Solutions has scheduled a Technical Round for March 15, 2026 at 10:00 AM.",
      type: "interview_scheduled",
      link: "/applications",
      read: false,
      createdAt: new Date("2026-02-10T09:15:00Z"),
    },
    {
      _id: "notif_003",
      recipientId: "user_student_001",
      title: "New AI Job Match (94% Compatibility)",
      message: "We found a new opportunity matching your React & Node.js skills at NexGen Technologies.",
      type: "job_recommendation",
      link: "/jobs/job_001",
      read: true,
      createdAt: new Date("2026-02-01T11:00:00Z"),
    },
  ];

  const messages = [
    {
      _id: "msg_001",
      conversationId: "conv_aarav_nexgen",
      senderId: "user_company_001",
      senderName: "NexGen Talent Acquisition",
      senderRole: "company",
      recipientId: "user_student_001",
      content: "Hello Aarav! We reviewed your profile and projects. We would like to connect regarding the Graduate Software Engineer role.",
      read: true,
      createdAt: new Date("2026-02-08T15:00:00Z"),
    },
    {
      _id: "msg_002",
      conversationId: "conv_aarav_nexgen",
      senderId: "user_student_001",
      senderName: "Aarav Sharma",
      senderRole: "student",
      recipientId: "user_company_001",
      content: "Thank you for the opportunity! I am available anytime this week for the technical evaluation.",
      read: true,
      createdAt: new Date("2026-02-08T15:30:00Z"),
    },
  ];

  const auditLogs = [
    {
      _id: "audit_001",
      actorId: "user_admin_001",
      actorEmail: "admin@example.com",
      actorRole: "admin",
      action: "Approved Company Registration",
      entity: "User",
      entityId: "user_company_001",
      metadata: { companyName: "NexGen Technologies" },
      createdAt: new Date("2026-01-11T10:00:00Z"),
    },
    {
      _id: "audit_002",
      actorId: "user_admin_001",
      actorEmail: "admin@example.com",
      actorRole: "admin",
      action: "Published Campus Placement Drive",
      entity: "Job",
      entityId: "job_001",
      metadata: { title: "Graduate Software Engineer (Full Stack)" },
      createdAt: new Date("2026-01-20T12:00:00Z"),
    },
  ];

  const interviews: any[] = [];
  const savedJobs: any[] = [
    { _id: "saved_001", studentId: "user_student_001", jobId: "job_002", createdAt: new Date() },
  ];

  return {
    users: [adminUser, studentUser1, studentUser2, companyUser1, companyUser2],
    jobs,
    applications,
    interviews,
    notifications,
    messages,
    auditLogs,
    savedJobs,
  };
}

// Global singleton instance for in-memory operations
if (!global.__memoryDb) {
  global.__memoryDb = initSeedData();
}

export const memoryDb = global.__memoryDb;
