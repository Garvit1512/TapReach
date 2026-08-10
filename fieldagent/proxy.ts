import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (exported function is `proxy`).
 *
 * This is a cheap cookie-presence check only — it does not validate the cookie.
 * The real authority check is `isAuthed()` in the protected layout and again in
 * the API route.
 */
export function proxy(request: NextRequest) {
  const signedIn = Boolean(request.cookies.get("tr_field")?.value);
  const { pathname } = request.nextUrl;

  if (!signedIn && pathname !== "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (signedIn && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals, the API route (which checks auth itself),
  // and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)"],
};
