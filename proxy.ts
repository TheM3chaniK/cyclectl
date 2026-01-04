import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // If authenticated, redirect from root to /projects
    if (token && pathname === "/") {
      return NextResponse.redirect(new URL("/projects", req.url));
    }

    // Redirect unauthenticated users from /projects/* or /project/* to root
    if (!token && (pathname.startsWith("/projects") || pathname.startsWith("/project"))) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Allow access to root and API routes for unauthenticated users
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public paths like /, and /api/auth/* without a token
        if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        // For other paths, require a token
        return !!token;
      },
    },
  },
);

// Matcher to apply middleware to specific paths
export const config = {
  matcher: ["/", "/projects/:path*", "/project/:path*", "/api/auth/:path*"],
};
