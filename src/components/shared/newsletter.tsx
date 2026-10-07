"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { trustTicker } from "@/data/content";

export function Newsletter() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const loop = [...trustTicker, ...trustTicker, ...trustTicker];

  return (
    <>
      <div className="overflow-hidden bg-primary py-3 text-primary-foreground">
        <div className="animate-marquee flex w-max">
          {loop.map((t, i) => (
            <span key={t + i} className="px-8 text-[12px] font-semibold uppercase tracking-[0.18em]">
              {t} • Farm to family •
            </span>
          ))}
        </div>
      </div>
      <section className="bg-muted/40">
        <div className="mx-auto max-w-xl px-5 py-16 text-center">
          <h2 className="font-serif text-4xl">Join the Mithila family</h2>
          <p className="mt-3 text-sm text-muted-foreground">Pure goodness, straight to your inbox. No spam.</p>
          {done ? (
            <p className="mt-6 text-sm font-medium text-primary">You are on the list. Welcome.</p>
          ) : (
            <form
              className="mt-8 flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                const form = e.currentTarget;
                const email = (new FormData(form).get("email") as string) || "";
                const res = await fetch("/api/newsletter", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                if (!res.ok) {
                  setError("Could not join. Try again.");
                  return;
                }
                setDone(true);
              }}
            >
              <Input required type="email" name="email" placeholder="Email address" />
              <Button type="submit">Join us</Button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </div>
      </section>
    </>
  );
}
