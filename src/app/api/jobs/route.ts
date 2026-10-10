import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Job } from "@/lib/db/models/Job";
import { memoryDb } from "@/lib/db/memoryDb";
import { AuditService } from "@/lib/services/auditService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const type = searchParams.get("type") || ""; // "full-time" | "internship"
    const workMode = searchParams.get("workMode") || "";
    const location = searchParams.get("location")?.toLowerCase() || "";
    const experienceLevel = searchParams.get("experienceLevel") || "";
    const companyId = searchParams.get("companyId") || "";

    let jobs: any[] = [];

    // Try MongoDB
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const query: any = {};
        if (companyId) {
          query.companyId = companyId;
        } else {
          query.status = "published";
          query.approvalStatus = "approved";
        }
        if (type) query.type = type;
        if (workMode) query.workMode = workMode;
        if (experienceLevel) query.experienceLevel = experienceLevel;

        const dbJobs = await Job.find(query).sort({ createdAt: -1 }).lean();
        if (dbJobs && dbJobs.length > 0) {
          jobs = dbJobs;
        }
      }
    } catch (e) {
      // fallback to memoryDb
    }

    if (jobs.length === 0) {
      jobs = [...memoryDb.jobs];
    }

    // Apply filtering on the collection
    let filtered = jobs.filter((j) => {
      if (companyId && String(j.companyId) !== String(companyId)) {
        return false;
      }
      if (!companyId && (j.status !== "published" || j.approvalStatus === "rejected")) {
        return false;
      }
      if (type && j.type !== type) return false;
      if (workMode && j.workMode !== workMode) return false;
      if (experienceLevel && j.experienceLevel !== experienceLevel) return false;
      if (location && !j.location.toLowerCase().includes(location)) return false;
      if (search) {
        const titleMatch = j.title.toLowerCase().includes(search);
        const compMatch = j.companyName.toLowerCase().includes(search);
        const skillMatch = (j.skills || []).some((s: string) => s.toLowerCase().includes(search));
        if (!titleMatch && !compMatch && !skillMatch) return false;
      }
      return true;
    });

    return NextResponse.json({
      success: true,
      count: filtered.length,
      jobs: filtered,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || (payload?.role !== "company" && payload?.role !== "admin")) {
      return NextResponse.json(
        { success: false, message: "Only recruiters or administrators can post opportunities." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      type = "full-time",
      description,
      responsibilities = [],
      requirements = [],
      skills = [],
      experienceLevel = "entry",
      minExperienceYears = 0,
      salaryMin,
      salaryMax,
      salaryPeriod = "year",
      location,
      workMode = "on-site",
      deadline,
      openings = 1,
      department = "Engineering",
      educationRequirements = "B.Tech / B.E. / MCA",
      eligibilityCgpa = 6.0,
    } = body;

    if (!title || !description || !location) {
      return NextResponse.json(
        { success: false, message: "Title, description, and location are required." },
        { status: 400 }
      );
    }

    const newJob: any = {
      _id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      type,
      description,
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : String(responsibilities).split("\n").filter(Boolean),
      requirements: Array.isArray(requirements)
        ? requirements
        : String(requirements).split("\n").filter(Boolean),
      skills: Array.isArray(skills)
        ? skills
        : String(skills).split(",").map((s) => s.trim()).filter(Boolean),
      experienceLevel,
      minExperienceYears: Number(minExperienceYears) || 0,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      salaryPeriod,
      currency: "INR",
      location,
      workMode,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      openings: Number(openings) || 1,
      companyId: payload.userId,
      companyName: user.companyName || user.name,
      companyLogo: user.companyLogo || user.avatarUrl || "",
      department,
      educationRequirements,
      eligibilityCgpa: Number(eligibilityCgpa) || 6.0,
      status: "published",
      approvalStatus: "approved",
      applicantsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryDb.jobs.unshift(newJob);

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Job.create(newJob);
      }
    } catch (e) {
      // safely handled
    }

    await AuditService.logAction({
      actorId: payload.userId,
      actorEmail: payload.email,
      actorRole: payload.role,
      action: `Created ${type}: "${title}"`,
      entity: "Job",
      entityId: String(newJob._id),
      metadata: { title, companyName: newJob.companyName, type },
    });

    return NextResponse.json({
      success: true,
      message: "Opportunity published successfully.",
      job: newJob,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
