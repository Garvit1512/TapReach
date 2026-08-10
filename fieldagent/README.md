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
| **Recon** | Business name + area | Fixed-width recon card (rating, rank, weak spot, intent, ceiling, opener, growth fit) + in-shop strategy. Uses live web search. |
| **Debrief** | A messy dump — typed or dictated | Pipeline row, dated follow-up rows, an honest read of what happened, one coaching note, and a weakness-log line |
| **Plan today** | Pasted Follow-Ups tab | Overdue, due today with exact messages, cold >14 days, one target for the day |
| **Growth list** | Pasted Pipeline tab | Businesses tagged Ring 2 / Ring 3, closed-and-happy clients first |

Every tab-separated row comes back in its own block with a **Copy row** button — that's
the Google Sheets workflow. Nothing is stored server-side; the sheet is the database.

## Run locally

```bash
cd fieldagent
cp .env.local.example .env.local   # then fill in the three values
npm install
npm run dev                        # http://localhost:3002
```

Three env vars, all required:

- `ANTHROPIC_API_KEY` — needs credits on the account
- `APP_PASSWORD` — the shared team password
- `SESSION_SECRET` — random 32 bytes, signs the session cookie

## Deploy

Vercel, from this subdirectory:

1. New Project → import `Garvit1512/TapReach` → set **Root Directory** to `fieldagent`
2. Add the three env vars in Project Settings → Environment Variables
3. Deploy, then share the URL and the password with Utkarsh and Love

Recon can run well past the default serverless timeout, so `app/api/agent/route.ts`
sets `maxDuration = 300`. On Vercel's Hobby tier the ceiling is lower than that — if
recon starts cutting off mid-answer, that's the cause, not the model.

## Cost

Every run is a real Claude API call on `claude-opus-5`, and recon additionally pays for
web search. That's why the app is password-gated: an open URL is an open tab on the
Anthropic bill. The system prompt is cached, so repeat runs are cheaper than the first.

If a run fails with a credits error, top up at console.anthropic.com → Plans & Billing.

## Editing the playbook

The behaviour lives in three files, not in the UI:

- `lib/prompts/context.ts` — pricing, contacts, ring model, the no-review-gating rule
- `lib/prompts/field-agent.ts` — sizing rule, intent decision rules, call windows, exits
- `lib/prompts/commands.ts` — what each screen actually asks for, and its output shape

Change pricing in `context.ts` only — every command reads from there.

Keep this in sync with the `tapreach-field-agent` skill if you change one of them; they
are two deliveries of the same playbook and drifting apart is the failure mode.
