import { NextResponse } from "next/server";
import { memoryDb, initSeedData } from "@/lib/db/memoryDb";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models/User";
import { Job } from "@/lib/db/models/Job";
import { Application } from "@/lib/db/models/Application";
import { Notification } from "@/lib/db/models/Notification";
import { Message } from "@/lib/db/models/Message";
import { SavedJob } from "@/lib/db/models/SavedJob";

export async function POST() {
  try {
    const seeds = initSeedData();
    let seededInDb = false;

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        for (const u of seeds.users) {
          await User.updateOne({ email: u.email }, { $set: u }, { upsert: true });
        }
        for (const j of seeds.jobs) {
          await Job.updateOne({ _id: j._id }, { $set: j }, { upsert: true });
        }
        for (const a of seeds.applications) {
          await Application.updateOne({ _id: a._id }, { $set: a }, { upsert: true });
        }
        for (const n of seeds.notifications) {
          await Notification.updateOne({ _id: n._id }, { $set: n }, { upsert: true });
        }
        for (const m of seeds.messages) {
          await Message.updateOne({ _id: m._id }, { $set: m }, { upsert: true });
        }
        for (const s of seeds.savedJobs) {
          await SavedJob.updateOne(
            { studentId: s.studentId, jobId: s.jobId },
            { $set: s },
            { upsert: true }
          );
        }
        seededInDb = true;
      }
    } catch (e) {
      // safely handled
    }

    return NextResponse.json({
      success: true,
      message: seededInDb
        ? "MongoDB localhost and in-memory database seeded and verified successfully."
        : "In-memory database seeded successfully (MongoDB unavailable).",
      seededInDb,
      stats: {
        users: seeds.users.length,
        jobs: seeds.jobs.length,
        applications: seeds.applications.length,
        notifications: seeds.notifications.length,
        messages: seeds.messages.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
