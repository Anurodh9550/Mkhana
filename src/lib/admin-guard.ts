import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { getAdminSession } from "./auth";

export async function requireAdminPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
}

export async function requireAdminApi() {
  if (await getAdminSession()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
