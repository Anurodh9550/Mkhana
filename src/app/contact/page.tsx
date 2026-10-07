"use client";

import { useState } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { brand } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hello Mithila Makhana")}`;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="relative mb-6 size-20 overflow-hidden rounded-full ring-1 ring-secondary/50">
        <Image src="/images/logo.jpg" alt="Mithila Makhana" fill className="object-cover" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.28em] text-secondary">Atelier</p>
      <h1 className="mt-3 font-serif text-5xl">Write to the harvest.</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Wholesale, gifting, or a question about a pouch — we read everything that arrives.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <form
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSaving(true);
            const form = new FormData(e.currentTarget);
            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: form.get("name"),
                  email: form.get("email"),
                  subject: form.get("subject"),
                  message: form.get("message"),
                }),
              });
              const data = (await res.json()) as { error?: string };
              if (!res.ok) throw new Error(data.error || "Could not send");
              setSent(true);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not send");
            } finally {
              setSaving(false);
            }
          }}
        >
          {sent ? (
            <p className="font-serif text-2xl">Received. We will write back within a working day.</p>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required name="name" className="mt-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" required type="email" name="email" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" required name="message" className="mt-2" />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" disabled={saving}>
                {saving ? "Sending…" : "Send note"}
              </Button>
            </>
          )}
        </form>

        <div className="space-y-6">
          <div className="flex gap-4 rounded-2xl border border-border p-5">
            <MapPin className="size-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Atelier</p>
              <p className="text-sm text-muted-foreground">{brand.address}</p>
            </div>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border p-5">
            <Globe className="size-5 text-primary" />
            <a href={brand.website} className="text-sm hover:text-primary">
              mithilamakhana.com
            </a>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border p-5">
            <Mail className="size-5 text-primary" />
            <a href={`mailto:${brand.email}`} className="text-sm hover:text-primary">
              {brand.email}
            </a>
          </div>
          <div className="flex gap-4 rounded-2xl border border-border p-5">
            <Phone className="size-5 text-primary" />
            <div className="text-sm">
              <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="block hover:text-primary">
                {brand.phone}
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-primary">
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 overflow-hidden rounded-3xl border border-border">
        <iframe
          title="Mithila, Bihar on Google Maps"
          src={brand.mapsEmbed}
          className="h-[380px] w-full border-0 grayscale"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
