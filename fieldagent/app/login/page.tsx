import { redirect } from "next/navigation";
import { passwordMatches, createSession, isAuthed } from "@/lib/auth";
import { LogoMark, Wordmark } from "@/components/Logo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthed()) redirect("/");
  const { error } = await searchParams;

  async function signIn(formData: FormData) {
    "use server";
    const password = String(formData.get("password") ?? "");
    if (!password || !passwordMatches(password)) {
      redirect("/login?error=1");
    }
    await createSession();
    redirect("/");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-7 flex items-center gap-2.5">
          <LogoMark size={30} />
          <Wordmark />
          <span className="rounded-full border border-[var(--tr-green-line)] bg-[var(--tr-green-soft)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-green">
            Field
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-[22px] font-black tracking-tight">
          Team sign in
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-fg-3">
          Shared password. Ask Garvit if you don&apos;t have it.
        </p>

        <form action={signIn} className="mt-6">
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            required
            className="w-full rounded-[var(--tr-radius)] border border-line-2 bg-elevated px-3.5 py-3.5 text-[16px] text-fg outline-none placeholder:text-fg-muted focus:border-[var(--tr-green-line)]"
          />
          {error && (
            <p className="mt-2.5 text-[13px] text-[var(--tr-coral)]">
              Wrong password. Try again.
            </p>
          )}
          <button
            type="submit"
            className="mt-3 w-full rounded-[12px] bg-green px-4 py-3.5 text-[15px] font-bold text-[#070707]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
