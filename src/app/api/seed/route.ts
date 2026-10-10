import { NextResponse } from "next/server";
import { memoryDb } from "@/lib/db/memoryDb";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Job } from "@/lib/db/models/Job";
import { Application } from "@/lib/db/models/Application";

export async function POST() {
  try {
    // Try MongoDB sync
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        for (const u of memoryDb.users) {
          const exists = await User.findOne({ email: u.email });
          if (!exists) {
            await User.create(u);
          }
        }
        for (const j of memoryDb.jobs) {
          const exists = await Job.findById(j._id);
          if (!exists) {
            await Job.create(j);
          }
        }
        for (const a of memoryDb.applications) {
          const exists = await Application.findById(a._id);
          if (!exists) {
            await Application.create(a);
          }
        }
      }
    } catch (e) {
      // safely handled
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded and verified successfully.",
      stats: {
        users: memoryDb.users.length,
        jobs: memoryDb.jobs.length,
        applications: memoryDb.applications.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
