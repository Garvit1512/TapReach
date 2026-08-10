# TapReach Field Agent

A phone-first web app that runs the TapReach field-sales playbook: recon before a
visit, debrief after it, a daily follow-up plan, and a long-term growth list.

Built so **Utkarsh and Love can use it without Claude Code** — they open a URL, tap a
card, and fill in a form. There is no command syntax to remember.

This is a port of the `tapreach-field-agent` Claude Code skill (which lives at
`~/.claude/skills/tapreach-field-agent/` on Garvit's machine). The operating rules are
the same; the delivery is different.

## What it does

| Screen | Input | Output |
|---|---|---|
| **Recon** | Business name + area | Fixed-width recon card (rating, rank, weak spot, intent, ceiling, opener, growth fit) + in-shop strategy. Live web search only on the `grok` provider — see Providers below. |
| **Debrief** | A messy dump — typed or dictated | Pipeline row, dated follow-up rows, an honest read of what happened, one coaching note, and a weakness-log line |
| **Plan today** | Pasted Follow-Ups tab | Overdue, due today with exact messages, cold >14 days, one target for the day |
| **Growth list** | Pasted Pipeline tab | Businesses tagged Ring 2 / Ring 3, closed-and-happy clients first |

Every tab-separated row comes back in its own block with a **Copy row** button — that's
the Google Sheets workflow. Nothing is stored server-side; the sheet is the database.

## Run locally

```bash
cd fieldagent
cp .env.local.example .env.local   # then fill in the values
npm install
npm run dev                        # http://localhost:3002
```

`APP_PASSWORD` and `SESSION_SECRET` are always required. Which provider vars you need
depends on `LLM_PROVIDER` — see below.

## Providers

`LLM_PROVIDER` picks the backend. Default is `openrouter`.

| | `openrouter` (default) | `grok` |
|---|---|---|
| Cost | **Free** — `:free`-suffixed models only | Real money, every call |
| Key | `OPENROUTER_API_KEY` from openrouter.ai → Keys, no card needed | `XAI_API_KEY` from console.x.ai |
| Model | `OPENROUTER_MODEL`, default `openai/gpt-oss-20b:free` | fixed to `grok-4.5` |
| Recon web search | **Off.** OpenRouter's own docs: *"Using web search will incur extra costs, even with free models."* Recon still runs — the model just answers from what it already knows and is told to say "not found" rather than fabricate, instead of pretending to have searched. | On — xAI's `web_search` tool, billed per xAI's rates |
| Rate limit | 50 requests/day per account with $0 balance; 1000/day if you've ever added $10+ | xAI's normal tier limits |

`lib/llm.ts` refuses to start if `OPENROUTER_MODEL` is set to anything without a
`:free` suffix — that guard exists specifically so a typo or a copy-pasted paid model
ID can't quietly start billing your OpenRouter account. There is no automatic fallback
from a rate-limited or unavailable free model to a paid one; a 429 or empty response
comes back as a plain error in the UI instead.

There is no `anthropic` option — the app fully migrated off Anthropic to Grok earlier
in this build, and there's nothing Anthropic-shaped left to switch back to.

## Deploy

Vercel, from this subdirectory:

1. New Project → import `Garvit1512/TapReach` → set **Root Directory** to `fieldagent`
2. Add the required env vars in Project Settings → Environment Variables (see Providers
   above for which ones)
3. Deploy, then share the URL and the password with Utkarsh and Love

Recon on the `grok` provider can run well past the default serverless timeout, so
`app/api/agent/route.ts` sets `maxDuration = 300`. On Vercel's Hobby tier the ceiling is
lower than that regardless — if it cuts off mid-answer, that's the tier, not the model.

## Why recon doesn't stream on the grok provider

Every other screen streams token-by-token, and recon does too on `openrouter`. On
`grok` it doesn't: xAI's web-search tool only works through the `/v1/responses`
endpoint, and that endpoint's streaming event format isn't published anywhere in xAI's
docs as of this writing. Rather than guess at an undocumented wire format, the route
calls it non-streaming and shows a "Searching the web…" indicator for the ~1–2 minutes
it takes. If xAI documents `/v1/responses` streaming later, that's a contained change
to one branch in `app/api/agent/route.ts` — worth revisiting.

## Editing the playbook

The behaviour lives in three files, not in the UI:

- `lib/prompts/context.ts` — pricing, contacts, ring model, the no-review-gating rule
- `lib/prompts/field-agent.ts` — sizing rule, intent decision rules, call windows, exits
- `lib/prompts/commands.ts` — what each screen actually asks for, and its output shape

Change pricing in `context.ts` only — every command reads from there.

Keep this in sync with the `tapreach-field-agent` skill if you change one of them; they
are two deliveries of the same playbook and drifting apart is the failure mode.
