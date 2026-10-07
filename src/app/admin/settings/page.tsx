"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import type { StoreSettings } from "@/types";
import { adminFetch } from "@/lib/admin-api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d: { settings: StoreSettings }) => setSettings(d.settings));
  }, []);

  if (!settings) return <p className="text-muted-foreground">Loading settings…</p>;

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSaved("");
        const res = await adminFetch("/api/admin/settings", {
          method: "PUT",
          body: JSON.stringify(settings),
        });
        if (!res.ok) {
          setError("Could not save");
          return;
        }
        setSaved("Saved");
      }}
    >
      <h1 className="font-serif text-4xl">Settings</h1>
      <div>
        <Label>Store name</Label>
        <Input className="mt-2" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
      </div>
      <div>
        <Label>Email</Label>
        <Input className="mt-2" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
      </div>
      <div>
        <Label>Phone</Label>
        <Input className="mt-2" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
      </div>
      <div>
        <Label>Address</Label>
        <Input className="mt-2" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
      </div>
      <div>
        <Label>Free shipping above (₹)</Label>
        <Input
          type="number"
          className="mt-2"
          value={settings.freeShippingMin}
          onChange={(e) => setSettings({ ...settings, freeShippingMin: Number(e.target.value) })}
        />
      </div>
      <div>
        <Label>Shipping fee (₹)</Label>
        <Input
          type="number"
          className="mt-2"
          value={settings.shippingFee}
          onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? <p className="text-sm text-primary">{saved}</p> : null}
      <Button type="submit">Save settings</Button>
    </form>
  );
}
