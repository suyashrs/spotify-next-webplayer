import { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { any } from 'prop-types';

export async function middleware(req:NextRequest) {
    const token = await getToken({req, secret: process.env.JWT_SECRET!} as any);
    const { pathname } = req.nextUrl;

    // Allow the requests if the following is true.
    // 1) It's a request for next-auth session & provider fetching
    // 2) requesting public assets
    // 3) the token exists
    
      if (pathname.startsWith('/_next') || pathname.includes('/api') || token) {
        return NextResponse.next();
      }
    
      // Redirect them to login if they don't have token AND are requesting a protected route
      if (!token && pathname !== '/login') {
        req.nextUrl.pathname = '/login';
        return NextResponse.redirect(req.nextUrl);
      }
}