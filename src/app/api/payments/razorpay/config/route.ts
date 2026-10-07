import { NextResponse } from "next/server";
import { razorpayConfigured, razorpayKeyId } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function GET() {
  const enabled = razorpayConfigured();
  return NextResponse.json({
    enabled,
    keyId: enabled ? razorpayKeyId() : "",
  });
}
