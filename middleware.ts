import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  
  // Admin routes that require admin role
  const adminRoutes = ["/admin"];
  
  // Protected routes that require authentication
  const protectedRoutes = ["/books", "/my-profile", "/admin"];

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if user is trying to access admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    // Check if user has admin role
    const userRole = req.auth?.user?.role;
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/books", req.url));
    }
    
    return NextResponse.next();
  }

  // Check if user is trying to access protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    return NextResponse.next();
  }

  // For any other routes, allow access
  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
