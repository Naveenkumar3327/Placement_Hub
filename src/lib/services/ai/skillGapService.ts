import { AiProvider } from "./aiProvider";

export interface SkillCategoryBreakdown {
  category: string;
  coverage: number; // 0-100
  totalRequired: number;
  acquired: number;
}

export interface MissingSkillItem {
  name: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  estimatedHours: number;
  importanceReason: string;
}

export interface LearningStep {
  week: number;
  title: string;
  topics: string[];
  recommendedProject: string;
}

export interface SkillGapAnalysisResult {
  targetRole: string;
  overallCoverage: number;
  categoryBreakdown: SkillCategoryBreakdown[];
  acquiredSkills: string[];
  missingSkills: MissingSkillItem[];
  learningRoadmap: LearningStep[];
  recommendedProjects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  recommendedCertifications: Array<{
    name: string;
    issuer: string;
    url: string;
  }>;
}

const ROLE_BENCHMARKS: Record<
  string,
  {
    categories: Record<string, string[]>;
    certifications: Array<{ name: string; issuer: string; url: string }>;
  }
> = {
  "Full Stack Developer": {
    categories: {
      Frontend: ["React", "TypeScript", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
      Backend: ["Node.js", "Express", "REST APIs", "GraphQL", "Authentication"],
      Database: ["MongoDB", "PostgreSQL", "Redis", "Prisma/Mongoose"],
      "DevOps & Cloud": ["Docker", "AWS", "CI/CD", "Git", "Kubernetes"],
    },
    certifications: [
      { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services", url: "https://aws.amazon.com/certification" },
      { name: "Meta Back-End Developer Certificate", issuer: "Meta / Coursera", url: "https://coursera.org" },
    ],
  },
  "AI / Machine Learning Engineer": {
    categories: {
      "Core AI/ML": ["Python", "PyTorch", "TensorFlow", "Scikit-Learn", "Machine Learning"],
      "Data & Math": ["Pandas", "NumPy", "Linear Algebra", "Probability", "SQL"],
      "Modern AI": ["NLP", "Transformers", "LLMs", "LangChain", "Vector Databases"],
      "Deployment": ["FastAPI", "Docker", "ONNX", "MLflow", "Cloud GPUs"],
    },
    certifications: [
      { name: "Deep Learning Specialization", issuer: "DeepLearning.AI", url: "https://deeplearning.ai" },
      { name: "TensorFlow Developer Certificate", issuer: "Google", url: "https://tensorflow.org" },
    ],
  },
  "DevOps & Cloud Engineer": {
    categories: {
      "Cloud Infrastructure": ["AWS", "GCP", "Terraform", "Infrastructure as Code"],
      "Containers & Orchestration": ["Docker", "Kubernetes", "Helm", "Microservices"],
      "Automation & CI/CD": ["GitHub Actions", "Jenkins", "Linux", "Bash", "Python"],
      "Observability": ["Prometheus", "Grafana", "ELK Stack", "Networking"],
    },
    certifications: [
      { name: "AWS Certified Solutions Architect", issuer: "AWS", url: "https://aws.amazon.com" },
      { name: "CKA: Certified Kubernetes Administrator", issuer: "CNCF / Linux Foundation", url: "https://cncf.io" },
    ],
  },
  "Data Scientist": {
    categories: {
      "Analytics & Viz": ["Python", "Pandas", "Seaborn", "Tableau", "PowerBI"],
      "Statistics & Modeling": ["Scikit-Learn", "Hypothesis Testing", "A/B Testing", "Regression"],
      "Data Engineering": ["SQL", "PostgreSQL", "PySpark", "ETL Pipelines"],
      "Big Data": ["Data Warehousing", "Snowflake", "Airflow"],
    },
    certifications: [
      { name: "IBM Data Science Professional Certificate", issuer: "IBM", url: "https://ibm.com" },
    ],
  },
};

export class SkillGapService {
  public static async analyze(studentSkills: string[], targetRole: string = "Full Stack Developer"): Promise<SkillGapAnalysisResult> {
    const benchmark = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS["Full Stack Developer"];
    const lowerStudentSkills = (studentSkills || []).map((s) => s.toLowerCase().trim());

    const categoryBreakdown: SkillCategoryBreakdown[] = [];
    const missingSkills: MissingSkillItem[] = [];
    const acquiredSkills: string[] = [];

    let totalBenchSkills = 0;
    let totalAcquired = 0;

    for (const [category, skillsList] of Object.entries(benchmark.categories)) {
      totalBenchSkills += skillsList.length;
      let acquiredInCat = 0;

      for (const sk of skillsList) {
        const hasSkill = lowerStudentSkills.some(
          (s) => s.includes(sk.toLowerCase()) || sk.toLowerCase().includes(s)
        );
        if (hasSkill) {
          acquiredInCat += 1;
          totalAcquired += 1;
          if (!acquiredSkills.includes(sk)) acquiredSkills.push(sk);
        } else {
          missingSkills.push({
            name: sk,
            category,
            priority: acquiredInCat === 0 ? "High" : ["Docker", "AWS", "Kubernetes"].includes(sk) ? "High" : "Medium",
            estimatedHours: 20,
            importanceReason: `Critical prerequisite for ${category} competency in ${targetRole} positions.`,
          });
        }
      }

      categoryBreakdown.push({
        category,
        coverage: Math.round((acquiredInCat / skillsList.length) * 100),
        totalRequired: skillsList.length,
        acquired: acquiredInCat,
      });
    }

    const overallCoverage = Math.min(100, Math.round((totalAcquired / totalBenchSkills) * 100));

    // Dynamic Learning Roadmap based on missing skills
    const topMissing = missingSkills.slice(0, 6);
    const learningRoadmap: LearningStep[] = [
      {
        week: 1,
        title: `Foundation: ${topMissing[0]?.name || "Core Architectures"}`,
        topics: [
          `Master fundamental syntax and key concepts of ${topMissing[0]?.name || "tools"}`,
          "Build guided mini-exercises and explore industry documentation",
        ],
        recommendedProject: `Build an interactive proof-of-concept utilizing ${topMissing[0]?.name || "the technology"}.`,
      },
      {
        week: 2,
        title: `Integration & Practice: ${topMissing[1]?.name || "Advanced Patterns"}`,
        topics: [
          `Integrate ${topMissing[1]?.name || "libraries"} with existing stack`,
          "Perform asynchronous data synchronization and error handling",
        ],
        recommendedProject: "Integrate automated workflows into your primary GitHub repository.",
      },
      {
        week: 3,
        title: `Production Deployment: ${topMissing[2]?.name || "Containerization & Cloud"}`,
        topics: [
          "Containerize application services with multi-stage build optimization",
          "Deploy live workloads with SSL, environment secrets, and monitoring",
        ],
        recommendedProject: "End-to-end full-stack app with production CI/CD automation pipeline.",
      },
      {
        week: 4,
        title: "Mock Interview & Portfolio Polish",
        topics: [
          "System design walkthroughs and algorithm time-space complexity optimization",
          "Record demonstration videos and refine resume bullet metrics",
        ],
        recommendedProject: "Publish comprehensive technical blog breakdown and interactive live demo.",
      },
    ];

    const recommendedProjects = [
      {
        title: `${targetRole} Production Capstone`,
        description: `Architect a full-fledged scalable application integrating ${topMissing.slice(0, 2).map((s) => s.name).join(" and ")} with high performance benchmarks.`,
        technologies: [topMissing[0]?.name || "React", topMissing[1]?.name || "Docker", "Node.js", "PostgreSQL"],
      },
      {
        title: "Microservices Orchestration Cluster",
        description: "Deploy decoupled services behind an API Gateway with rate limiting, JWT validation, and automated rollback health checks.",
        technologies: ["Docker", "Kubernetes", "Redis", "TypeScript"],
      },
    ];

    return {
      targetRole,
      overallCoverage,
      categoryBreakdown,
      acquiredSkills,
      missingSkills,
      learningRoadmap,
      recommendedProjects,
      recommendedCertifications: benchmark.certifications,
    };
  }
}
