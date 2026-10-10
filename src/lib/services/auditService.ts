import { connectDB } from "../db/connect";
import { AuditLog } from "../db/models/AuditLog";
import { memoryDb } from "../db/memoryDb";

export class AuditService {
  public static async logAction(params: {
    actorId: string;
    actorEmail: string;
    actorRole: "student" | "company" | "admin";
    action: string;
    entity: "User" | "Job" | "Application" | "Interview" | "System";
    entityId?: string;
    metadata?: Record<string, any>;
    ipAddress?: string;
  }) {
    const entry = {
      _id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...params,
      createdAt: new Date(),
    };

    // Save to memoryDb
    memoryDb.auditLogs.unshift(entry);

    // Try MongoDB
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await AuditLog.create(params);
      }
    } catch (e) {
      // safely handled
    }
  }

  public static async getLogs(limit: number = 50) {
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        return await AuditLog.find().sort({ createdAt: -1 }).limit(limit).lean();
      }
    } catch (e) {
      // fallback
    }
    return memoryDb.auditLogs.slice(0, limit);
  }
}
