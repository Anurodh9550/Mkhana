import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackClient } from "@/components/track/track-client";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your Mithila Makhana shipment — ordered, packed, shipped, out for delivery, delivered.",
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="px-5 py-16 text-center text-muted-foreground">Loading tracker…</div>}>
      <TrackClient />
    </Suspense>
  );
}
