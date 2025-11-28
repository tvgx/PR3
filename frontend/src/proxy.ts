import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
const JWT_SECRET_KEY = process.env.JWT_SECRET;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in .env.local");
}
const secret = new TextEncoder().encode(JWT_SECRET_KEY);
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.error("JWT Verify Error:", err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    '/admin/:path*', 
    '/login',
    '/signup',
  ],
};