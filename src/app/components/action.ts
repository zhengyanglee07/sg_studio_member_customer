'use server'

import { cookies } from "next/headers";

export async function setEmptyCookie(token: string) {
  const tenantHost = process.env.NEXT_PUBLIC_TENANT_HOST || "default";

  cookies().set({
    name: `${tenantHost}_m_token`,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // ✅ Ensures immediate deletion
    expires: new Date(0), // ✅ Ensures immediate deletion
    // ...(process.env.NODE_ENV === "production" ? { domain: ".up.railway.app" } : {}), // ✅ Conditionally set domain
  });

  console.log("✅ Cookie set successfully:", token);
  return { success: true };
}
