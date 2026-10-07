"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { setAdminSession } from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#163d28] px-5">
      <form
        className="w-full max-w-md rounded-3xl bg-[#faf9f5] p-8 shadow-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);
          const form = new FormData(e.currentTarget);
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: form.get("email"),
                password: form.get("password"),
              }),
            });
            const data = (await res.json()) as { error?: string; token?: string };
            if (!res.ok) throw new Error(data.error || "Login failed");
            if (!data.token) throw new Error("No token returned from Django");
            setAdminSession(data.token);
            router.push("/admin");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="relative mx-auto mb-4 size-16 overflow-hidden rounded-full">
          <Image src="/images/logo.jpg" alt="" fill className="object-cover" />
        </div>
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">Admin panel</p>
        <h1 className="mt-2 text-center font-serif text-3xl">Mithila Makhana</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to manage the store.</p>
        <div className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-2" defaultValue="admin@mithilamakhana.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="mt-2" />
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Default password: Admin@123 — change via env in production.</p>
      </form>
    </div>
  );
}
