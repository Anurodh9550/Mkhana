"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [done, setDone] = useState("");

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">My account</p>
      <h1 className="mt-2 font-serif text-4xl">{mode === "login" ? "Welcome back" : "Create account"}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Frontend preview — no password is stored on a server.</p>

      {done ? (
        <p className="mt-8 rounded-2xl border border-border bg-card p-6 text-sm">{done}</p>
      ) : (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(mode === "login" ? "Signed in on this device. Shop when you are ready." : "Account created on this device. You can now shop.");
          }}
        >
          {mode === "register" ? (
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required className="mt-2" />
            </div>
          ) : null}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required className="mt-2" placeholder="For COD updates" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required className="mt-2" />
          </div>
          <Button type="submit" className="w-full">
            {mode === "login" ? "Sign in" : "Create account"}
          </Button>
        </form>
      )}

      <button
        type="button"
        className="mt-6 text-sm text-primary underline-offset-4 hover:underline"
        onClick={() => {
          setDone("");
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
      <p className="mt-8 text-sm">
        <Link href="/track-order" className="hover:text-primary">
          Track an order →
        </Link>
      </p>
    </div>
  );
}
