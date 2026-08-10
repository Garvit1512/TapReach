import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed, destroySession } from "@/lib/auth";
import { COMMANDS, COMMAND_ORDER } from "@/lib/prompts/commands";
import { LogoMark, Wordmark } from "@/components/Logo";

export default async function Home() {
  // The proxy only checked that a cookie exists. This is the real check.
  if (!(await isAuthed())) redirect("/login");

  async function signOut() {
    "use server";
    await destroySession();
    redirect("/login");
  }

  return (
    <div className="min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <Wordmark />
            <span className="rounded-full border border-[var(--tr-green-line)] bg-[var(--tr-green-soft)] px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-green">
              Field
            </span>
          </div>
          <form action={signOut}>
            <button type="submit" className="text-[12.5px] text-fg-3 active:text-fg-2">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-7">
        <h1 className="font-[family-name:var(--font-display)] text-[26px] font-black leading-[1.15] tracking-tight">
          What are you doing
          <br />
          <span className="text-green">right now?</span>
        </h1>
        <p className="mt-2.5 text-[14px] leading-relaxed text-fg-3">
          Tap one. Everything comes back ready to paste into the sheet.
        </p>

        <div className="mt-7 grid gap-3">
          {COMMAND_ORDER.map((id) => {
            const c = COMMANDS[id];
            return (
              <Link
                key={c.id}
                href={`/${c.id}`}
                className="group rounded-[var(--tr-radius-lg)] border border-line-2 bg-card px-4 py-4 transition-colors active:border-[var(--tr-green-line)] active:bg-elevated"
              >
                <div className="flex items-start gap-3.5">
                  <span className="text-[22px] leading-none">{c.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-[family-name:var(--font-display)] text-[16px] font-bold tracking-tight">
                      {c.label}
                    </h2>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg-3">{c.blurb}</p>
                  </div>
                  <span className="mt-1 text-fg-muted">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 rounded-[var(--tr-radius)] border border-line bg-raised px-4 py-3.5">
          <p className="text-[12.5px] font-semibold text-fg-2">Before you walk in</p>
          <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-fg-3">
            <li>· Card in his hand. He taps it himself. Then stop talking.</li>
            <li>· Never ask how many he wants — ask how many chairs/tables/trainers.</li>
            <li>· Don&apos;t leave without an advance, a dated slot, or a referral name.</li>
            <li>· No free design before an advance.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
