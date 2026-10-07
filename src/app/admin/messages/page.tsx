"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/types";
import { adminFetch } from "@/lib/admin-api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  function load() {
    adminFetch("/api/contact")
      .then((r) => r.json())
      .then((d: { messages?: ContactMessage[] }) => setMessages(d.messages || []));
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    await adminFetch("/api/contact", {
      method: "PATCH",
      body: JSON.stringify({ id, read: true }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl">Messages</h1>
      <p className="mt-1 text-sm text-muted-foreground">From the contact form on the storefront.</p>
      <div className="mt-8 space-y-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <article key={m.id} className="rounded-2xl border border-[#e4dfd3] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.email}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString("en-IN")}</p>
              </div>
              <p className="mt-2 text-sm font-medium">{m.subject}</p>
              <p className="mt-2 text-sm leading-relaxed">{m.message}</p>
              {!m.read ? (
                <button type="button" className="mt-3 text-sm text-primary" onClick={() => markRead(m.id)}>
                  Mark as read
                </button>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Read</p>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
