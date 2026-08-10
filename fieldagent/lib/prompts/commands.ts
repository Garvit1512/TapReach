/**
 * Per-command prompt builders.
 *
 * The UI collects structured fields, these turn them into the user turn. This is
 * what replaces the skill's `recon:` / `debrief:` command syntax — Utkarsh and Love
 * never type a command, they tap a card and fill a form.
 */

export type CommandId = "recon" | "debrief" | "plan" | "growth";

export interface CommandDef {
  id: CommandId;
  /** Shown on the home screen card. */
  label: string;
  /** One line under the label. */
  blurb: string;
  emoji: string;
  /** Whether this command should be given the web search tool. */
  webSearch: boolean;
  /** How hard Claude should work — recon and debrief are the heavy ones. */
  effort: "low" | "medium" | "high" | "xhigh";
}

export const COMMANDS: Record<CommandId, CommandDef> = {
  recon: {
    id: "recon",
    label: "Recon a business",
    blurb: "Before you walk in — rating, rank, weak spot, opener, the number to ask for.",
    emoji: "🔍",
    webSearch: true,
    effort: "high",
  },
  debrief: {
    id: "debrief",
    label: "Debrief a visit",
    blurb: "Dump what happened. Get pipeline rows, dated follow-ups, and honest coaching.",
    emoji: "📝",
    webSearch: false,
    effort: "high",
  },
  plan: {
    id: "plan",
    label: "Plan today",
    blurb: "Paste your Follow-Ups tab. Get overdue, due today, and one target.",
    emoji: "📅",
    webSearch: false,
    effort: "medium",
  },
  growth: {
    id: "growth",
    label: "Growth list",
    blurb: "Paste your Pipeline tab. See who's ready for Ring 2 / Ring 3 when we launch.",
    emoji: "🌱",
    webSearch: false,
    effort: "medium",
  },
};

export const COMMAND_ORDER: CommandId[] = ["recon", "debrief", "plan", "growth"];

/** Today's date in IST, as a readable string — every command needs it for dating follow-ups. */
function todayIST(): string {
  const ist = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

export interface CommandInput {
  command: CommandId;
  /** recon: business name. debrief/plan/growth: the pasted dump. */
  primary: string;
  /** recon only: area / locality. */
  area?: string;
}

export function buildUserPrompt({ command, primary, area }: CommandInput): string {
  const today = `Today's date is ${todayIST()} (IST).`;

  switch (command) {
    case "recon":
      return `${today}

MODE: RECON. Utkarsh is about to walk into this business:

Business: ${primary}
Area: ${area || "not specified"}

Research it with web search before answering. Gather: Google rating, review count, and
the date of the most recent review (recency matters more than total); what the negative
reviews actually complain about — service, food, price, wait — because that is the pitch
angle; whether reviews name individual staff (signals a per-person card sale); whether a
website exists, doesn't, or exists but is broken/unmaintained; Instagram handle,
follower count and last post date; the 3–5 nearest competitors in the same category with
their ratings, so you can say where this business actually ranks locally; physical scale
(tables, chairs, trainers, doctors, counters) from photos, listings, or their own site;
and price point (cost for two, membership fee, service menu), which sets the ticket ceiling.

Anything you cannot find, write "not found". Do not estimate.

Return exactly two things:

**1. The recon card**, in a fenced code block, in this shape:

RECON — <Business> · <Area>

RATING      4.1 ★ · 312 reviews · last review 6 days ago
RANK        #4 of 7 <category> in <area>  (leader: <name> 4.6★/890)
WEBSITE     None
INSTAGRAM   @handle · 1.2k · last post 3 weeks ago
SCALE       ~18 tables, 2 floors
TICKET      ₹1,200 for two

WEAK SPOT   <2 lines — what the bad reviews actually say, and what that means>

INTENT      <one line — what he is walking in to sell. One thing, never a menu.>
CEILING     ₹<realistic best case for this visit>
OPENER      "<the exact first sentence, in the Hinglish he'll actually use>"
GROWTH FIT  <Ring 2 / Ring 3 / neither yet — one line, with the reason>

**2. The in-shop strategy**, as short prose under a "## In the shop" heading:
- The counting question, worded exactly as he should say it
- The demo moment (card in his hand, he taps it himself, then stop talking)
- The number, with the volume discount pre-calculated in rupees
- The two objections most likely for *this specific* business, with the Hinglish answer
- The escalation — if the cards close, what the second ask is and the bridging sentence
- The three acceptable exits

Keep it phone-sized. He is reading this walking up to the door.`;

    case "debrief":
      return `${today}

MODE: DEBRIEF. Utkarsh just came out of a visit and dumped this, probably typed
one-handed or dictated:

---
${primary}
---

Parse it. Ask at most one clarifying question, and only if a critical field is genuinely
missing — usually the phone number or the agreed callback time. If nothing critical is
missing, ask nothing.

Return four blocks in this order:

## A — Pipeline row

One tab-separated line in a fenced code block, ready to paste. Columns in this order:
Business, Vertical, Stage, Contact, Role, Phone, Value, Last Contact, Next Action, Due,
Notes, Growth Fit.

Carry the Growth Fit tag forward from recon if there was one, or assign it now from what
the debrief reveals. Leave it blank only if genuinely nothing points anywhere — don't
force a tag onto every row.

## B — Follow-up rows

One tab-separated line per required touch, each in its own fenced code block. Columns:
Business, Contact, Role, Phone, Action, Channel, Due Date, Due Time, Status, Stage,
Value, Notes.

Status always starts as Open. Every row needs a date AND a time. If he was given a time,
use it; otherwise apply the default timing table and the Delhi call windows.

## C — What actually happened

3–5 lines, honest. Did he close, or did he collect a maybe? Was the demo given? Was a
counting question asked? Was an advance requested? Name the exact moment the deal was
won or lost.

## D — Coaching

**One** weakness. Never a list. Quote his own words back where you can, give the better
version verbatim, and tie it to the next visit.

Then, under a "### Weakness log" heading, give one line in a fenced code block for him to
paste into TapReach-Weakness-Log.md, in the format:
YYYY-MM-DD | Business | What went wrong | pattern-tag

Pattern tags: no-demo, single-unit, no-advance, no-time-pinned, discounted,
pitched-too-early, stacked-asks, left-brochure, no-referral-ask, talked-past-close.`;

    case "plan":
      return `${today}

MODE: PLAN TODAY. Here is the Follow-Ups data, pasted from the sheet:

---
${primary}
---

Return, under short headings:

- **Overdue** — chase first, hardest, no excuses
- **Due today** — in time order, each with the exact opener or WhatsApp message to send
- **Cold >14 days** — chase once or archive; make him decide, don't decide for him
- **Today's one target** — a single number or outcome for the day

Keep the whole thing under 15 lines. He reads this walking between shops.

If the pasted data is empty or unparseable, say so in one line and ask him to paste the
Follow-Ups tab including its header row. Don't invent rows.`;

    case "growth":
      return `${today}

MODE: GROWTH LIST. Here is the Pipeline data, pasted from the sheet:

---
${primary}
---

Filter to businesses tagged as Ring 2 or Ring 3 candidates in the Growth Fit column.
Return a short list: business, contact, phone, why it's tagged, and current relationship
stage. Put closed-and-happy clients first — a Ring 3 pitch lands easiest on someone who
already trusts the card.

This command is close to useless before roughly 15–20 debriefs have populated the Growth
Fit column. If the pasted data is empty, has no Growth Fit column, or has almost nothing
tagged, say that plainly in a line or two and stop. Do not invent a list to be helpful.`;
  }
}
