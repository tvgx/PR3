import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
const JWT_SECRET_KEY = process.env.JWT_SECRET;

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in .env.local");
}
const secret = new TextEncoder().encode(JWT_SECRET_KEY);

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set("from", request.nextUrl.pathname); // (Tùy chọn: để biết redirect từ đâu)
      return NextResponse.redirect(loginUrl);
    }
    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    } catch (err) {
      // Nếu token không hợp lệ (hết hạn, sai chữ ký)
      console.error("JWT Verify Error:", err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Cho phép tất cả các request khác (như /) đi qua
  return NextResponse.next();
}

// 8. Cấu hình Matcher
// (Đảm bảo middleware chỉ chạy trên các đường dẫn cần thiết)
export const config = {
  matcher: [
    '/admin/:path*', // Chạy trên tất cả các trang admin
    '/login', // Chạy để kiểm tra (ví dụ: nếu đã login thì sao?)
    '/signup',
  ],
};