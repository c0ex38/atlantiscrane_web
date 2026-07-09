import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale } from "./app/lib/site-content";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
}

export const config = {
  matcher: "/",
};
