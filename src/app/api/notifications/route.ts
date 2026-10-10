import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Notification } from "@/lib/db/models/Notification";
import { memoryDb } from "@/lib/db/memoryDb";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    let notifications: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        notifications = await Notification.find({ recipientId: payload.userId })
          .sort({ createdAt: -1 })
          .limit(30)
          .lean();
      }
    } catch (e) {
      // fallback
    }

    if (notifications.length === 0) {
      notifications = memoryDb.notifications.filter(
        (n) => String(n.recipientId) === String(payload.userId)
      );
    }

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { id, markAll } = await req.json();

    if (markAll) {
      memoryDb.notifications.forEach((n) => {
        if (String(n.recipientId) === String(payload.userId)) {
          n.read = true;
        }
      });
      try {
        const db = await connectDB();
        if (db && db.connection.readyState === 1) {
          await Notification.updateMany({ recipientId: payload.userId }, { $set: { read: true } });
        }
      } catch (e) {
        // safely handled
      }
      return NextResponse.json({ success: true, message: "All marked as read." });
    }

    if (id) {
      const notif = memoryDb.notifications.find((n) => String(n._id) === id);
      if (notif) notif.read = true;

      try {
        const db = await connectDB();
        if (db && db.connection.readyState === 1) {
          await Notification.findByIdAndUpdate(id, { $set: { read: true } });
        }
      } catch (e) {
        // safely handled
      }
    }

    return NextResponse.json({ success: true, message: "Notification updated." });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
