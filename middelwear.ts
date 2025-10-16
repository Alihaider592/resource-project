import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  // Get token from cookies
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

    // Role-based route protection
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/HR") && user.role !== "HR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/userdashboard") && user.role !== "simple user") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/userdashboard") && user.role !== "User") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/teamlead") && user.role !== "teamlead") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only to protected paths
export const config = {
  matcher: ["/admin/:path*", "/HR/:path*", "/userdashboard/:path*", "/teamlead/:path*"],
};
