import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";
import { connectDB } from "@/lib/db/connect";
import { Message } from "@/lib/db/models/Message";
import { memoryDb } from "@/lib/db/memoryDb";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    let messages: any[] = [];
    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        const query: any = {
          $or: [{ senderId: payload.userId }, { recipientId: payload.userId }],
        };
        if (conversationId) {
          query.conversationId = conversationId;
        }
        messages = await Message.find(query).sort({ createdAt: 1 }).lean();
      }
    } catch (e) {
      // fallback
    }

    if (messages.length === 0) {
      messages = memoryDb.messages.filter((m) => {
        const involved =
          String(m.senderId) === String(payload.userId) ||
          String(m.recipientId) === String(payload.userId);
        if (!involved) return false;
        if (conversationId && m.conversationId !== conversationId) return false;
        return true;
      });
    }

    // Also build list of recent active conversations
    const conversationMap = new Map<string, any>();
    const allUserMessages = memoryDb.messages.filter(
      (m) => String(m.senderId) === String(payload.userId) || String(m.recipientId) === String(payload.userId)
    );

    for (const msg of allUserMessages) {
      const otherPartyId = String(msg.senderId) === String(payload.userId) ? msg.recipientId : msg.senderId;
      const otherPartyName = String(msg.senderId) === String(payload.userId) ? "Recipient" : msg.senderName;
      if (!conversationMap.has(msg.conversationId)) {
        conversationMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt,
          otherPartyId,
          otherPartyName,
        });
      }
    }

    return NextResponse.json({
      success: true,
      messages,
      conversations: Array.from(conversationMap.values()),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);
    if (!user || !payload) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { recipientId, content, conversationId } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { success: false, message: "Recipient and message content are required." },
        { status: 400 }
      );
    }

    const convId = conversationId || `conv_${[payload.userId, recipientId].sort().join("_")}`;

    const newMsg: any = {
      _id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      conversationId: convId,
      senderId: payload.userId,
      senderName: user.companyName || user.name,
      senderRole: payload.role,
      recipientId,
      content,
      read: false,
      createdAt: new Date(),
    };

    memoryDb.messages.push(newMsg);

    try {
      const db = await connectDB();
      if (db && db.connection.readyState === 1) {
        await Message.create(newMsg);
      }
    } catch (e) {
      // safely handled
    }

    // Create notification for recipient
    memoryDb.notifications.unshift({
      _id: `notif_${Date.now()}`,
      recipientId,
      title: `New Message from ${newMsg.senderName}`,
      message: content.slice(0, 100),
      type: "message_received",
      link: payload.role === "student" ? "/messages" : "/company/messages",
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
