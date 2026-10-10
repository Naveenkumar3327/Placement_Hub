"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { MessageSquare, Send, User } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function CompanyMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("");
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const d = await res.json();
        setMessages(d.messages || []);
        setConversations(d.conversations || []);
        if (d.conversations && d.conversations.length > 0 && !activeConvId) {
          setActiveConvId(d.conversations[0].conversationId);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);

    const activeConv = conversations.find((c) => c.conversationId === activeConvId);
    const recipientId = activeConv ? activeConv.otherPartyId : "user_student_001";

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId,
          conversationId: activeConvId || "conv_aarav_nexgen",
          content: newMsg.trim(),
        }),
      });

      if (res.ok) {
        setNewMsg("");
        fetchMessages();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const activeMessages = messages.filter(
    (m) => !activeConvId || m.conversationId === activeConvId
  );

  return (
    <div className="flex-1 flex bg-slate-50">
      <Sidebar role="company" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6 overflow-y-auto">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span>Candidate Direct Messages</span>
          </h1>
          <p className="text-xs text-slate-500">
            Communicate directly with shortlisted students and interviewees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[550px]">
          {/* Threads */}
          <div className="md:col-span-4 border-r border-slate-200 p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-2">
              Candidate Conversations
            </span>
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active candidate conversations.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.conversationId}
                  onClick={() => setActiveConvId(c.conversationId)}
                  className={`w-full text-left p-3 rounded-2xl transition-all ${
                    activeConvId === c.conversationId
                      ? "bg-purple-50 border border-purple-200"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900 truncate">
                    {c.otherPartyName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {c.lastMessage}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-8 flex flex-col justify-between p-4 sm:p-6">
            <div className="space-y-4 overflow-y-auto max-h-[420px] p-2">
              {activeMessages.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  Select a candidate thread to view messages.
                </div>
              ) : (
                activeMessages.map((m) => {
                  const isMe = m.senderRole === "company";
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] text-slate-400 font-medium mb-1 px-1">
                        {m.senderName}
                      </span>
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? "bg-purple-600 text-white rounded-tr-none shadow-sm shadow-purple-600/10"
                            : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 px-1">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message to candidate..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={sending || !newMsg.trim()}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
