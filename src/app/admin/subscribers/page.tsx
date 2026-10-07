"use client";

import { useEffect, useState } from "react";
import type { Subscriber } from "@/types";
import { adminFetch } from "@/lib/admin-api";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    adminFetch("/api/newsletter")
      .then((r) => r.json())
      .then((d: { subscribers?: Subscriber[] }) => setSubscribers(d.subscribers || []));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl">Subscribers</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subscribers.length} emails from the newsletter form</p>
      <ul className="mt-8 divide-y divide-[#e4dfd3] rounded-2xl border border-[#e4dfd3] bg-white">
        {subscribers.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">No subscribers yet.</li>
        ) : (
          subscribers.map((s) => (
            <li key={s.id} className="flex justify-between px-4 py-3 text-sm">
              <span>{s.email}</span>
              <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleDateString("en-IN")}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
