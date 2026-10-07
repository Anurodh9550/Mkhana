import { NextResponse } from "next/server";
import { adminCredentials, getAdminSession } from "@/lib/auth";

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email: adminCredentials().email });
}
