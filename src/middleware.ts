import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/profile");

  const publicRoutes = ["/login", "/signup", "/"];

  const membi_m_token = request.cookies.get(
    `${process.env.NEXT_PUBLIC_TENANT_HOST}_m_token`,
  );

  if (isProtectedRoute) {
    if (!membi_m_token || !membi_m_token.value) {
      console.log("No membi_m_token, redirecting to /login");

      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = process.env.MEMBI_CUSTOMER_SECRET!;
      await jose.jwtVerify(
        membi_m_token.value,
        jose.base64url.decode(Buffer.from(secret).toString("base64")),
      );
      // membi_m_token is valid; proceed with the request
    } catch (error) {
      console.log("Invalid membi_m_token, redirecting to /login", error);
      //localStorage.removeItem(`${process.env.NEXT_PUBLIC_TENANT_HOST}_authToken`);
      if (request.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return NextResponse.next();
    }
  }
  // Optional: Redirect authenticated users away from public routes
  if (publicRoutes.includes(path) && membi_m_token) {
    const secret = process.env.MEMBI_CUSTOMER_SECRET!;
    try {
      await jose.jwtVerify(
        membi_m_token.value,
        jose.base64url.decode(Buffer.from(secret).toString("base64")),
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      console.log(
        "Invalid membi_m_token, allowing access to public routes",
        error,
      );
      // membi_m_token is invalid; allow access to public routes
    }
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ['/dashboard/:path*'],
// };

