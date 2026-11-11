import mongoose from "mongoose";
import { User } from "./models/User";
import { Job } from "./models/Job";
import { Application } from "./models/Application";
import { Notification } from "./models/Notification";
import { Message } from "./models/Message";
import { SavedJob } from "./models/SavedJob";
import { memoryDb, initSeedData } from "./memoryDb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/placement_portal";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose | null> | null;
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null, seeded: false };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function seedDatabaseIfEmpty() {
  if (cached.seeded) return;
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("[MongoDB] Database is empty. Seeding initial dataset to MongoDB localhost...");
      const seeds = initSeedData();

      // Seed Users
      for (const u of seeds.users) {
        await User.updateOne({ email: u.email }, { $setOnInsert: u }, { upsert: true });
      }

      // Seed Jobs
      for (const j of seeds.jobs) {
        await Job.updateOne({ _id: j._id }, { $setOnInsert: j }, { upsert: true });
      }

      // Seed Applications
      for (const a of seeds.applications) {
        await Application.updateOne({ _id: a._id }, { $setOnInsert: a }, { upsert: true });
      }

      // Seed Notifications
      for (const n of seeds.notifications) {
        await Notification.updateOne({ _id: n._id }, { $setOnInsert: n }, { upsert: true });
      }

      // Seed Messages
      for (const m of seeds.messages) {
        await Message.updateOne({ _id: m._id }, { $setOnInsert: m }, { upsert: true });
      }

      // Seed SavedJobs
      for (const s of seeds.savedJobs) {
        await SavedJob.updateOne(
          { studentId: s.studentId, jobId: s.jobId },
          { $setOnInsert: s },
          { upsert: true }
        );
      }

      console.log("[MongoDB] Initial dataset seeded successfully into local MongoDB.");
    }
    cached.seeded = true;
  } catch (err: any) {
    console.warn("[MongoDB] Auto-seeding notice:", err.message);
  }
}

export async function connectDB(): Promise<typeof mongoose | null> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (mongooseInstance) => {
        console.log(`[MongoDB] Connected successfully to ${MONGODB_URI}`);
        await seedDatabaseIfEmpty();
        return mongooseInstance;
      })
      .catch((err) => {
        console.warn(
          "MongoDB connection could not be established; operating with memory store fallback:",
          err.message
        );
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}

export async function getDbStatus() {
  const isConnected = mongoose.connection.readyState === 1;
  let counts: Record<string, number> = {
    users: 0,
    jobs: 0,
    applications: 0,
    interviews: 0,
    notifications: 0,
    messages: 0,
    auditlogs: 0,
    savedjobs: 0,
  };

  if (isConnected) {
    try {
      const db = mongoose.connection.db;
      if (db) {
        counts.users = await db.collection("users").countDocuments();
        counts.jobs = await db.collection("jobs").countDocuments();
        counts.applications = await db.collection("applications").countDocuments();
        counts.interviews = await db.collection("interviews").countDocuments();
        counts.notifications = await db.collection("notifications").countDocuments();
        counts.messages = await db.collection("messages").countDocuments();
        counts.auditlogs = await db.collection("auditlogs").countDocuments();
        counts.savedjobs = await db.collection("savedjobs").countDocuments();
      }
    } catch (e) {
      // ignore count errors
    }
  }

  return {
    connected: isConnected,
    uri: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"),
    host: mongoose.connection.host || "localhost",
    port: mongoose.connection.port || 27017,
    name: mongoose.connection.name || "placement_portal",
    readyState: mongoose.connection.readyState,
    counts,
  };
}
