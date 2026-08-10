import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Deliberately minimal auth: one shared password for the three founders, no
 * database, no user accounts.
 *
 * The point of the gate is not to model identity — it's that this app spends real
 * Anthropic API credits on every request, so the URL must not be usable by anyone
 * who stumbles across it.
 */

const COOKIE = "tr_field";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

/** The cookie value is an HMAC of a fixed marker — no session store needed. */
function expectedToken(): string {
  return createHmac("sha256", secret()).update("tapreach-field-agent-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Checks the submitted password against APP_PASSWORD in constant time. */
export function passwordMatches(submitted: string): boolean {
  const expected = process.env.APP_PASSWORD;
  if (!expected) throw new Error("APP_PASSWORD is not set");
  return safeEqual(submitted, expected);
}

export async function createSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — they shouldn't have to log in every visit
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/**
 * The real authority check. Called in the protected layout AND again inside the
 * API route — the proxy only checks that a cookie exists, not that it's valid.
 */
export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  try {
    return safeEqual(value, expectedToken());
  } catch {
    return false;
  }
}
