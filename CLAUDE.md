# TapReach

TapReach sells NFC/QR "Google review" cards to local businesses (gyms, salons, cafes, clinics,
hotels, restaurants, retail) as a wedge product, then builds and hosts websites for those same
clients as the real revenue line (Standard ~₹12,000, Premium ~₹25-28,000, plus a ₹1,000/month
care-plan retainer).

This repo contains two separate applications. They do not share code or a database.

## `frontend/` + `backend/` — tapreach.co marketing site

The public TapReach marketing site.

- `frontend/`: Create React App (via craco) + Tailwind + shadcn/ui-style components. React 19.
- `backend/`: FastAPI + MongoDB (Motor). Single purpose: the "Get Free Mockup" contact form
  (`POST/GET /api/demo`).

Run locally (two terminals):

```bash
cd frontend && yarn start        # http://localhost:3000
cd backend && uvicorn server:app --reload --port 8001
```

Copy `frontend/.env.example` → `frontend/.env` and `backend/.env.example` → `backend/.env` first
(the backend also needs a reachable MongoDB at `MONGO_URL`).

Deployed to GitHub at `Garvit1512/TapReach`, `main` branch. Not yet deployed to production hosting
(Vercel for frontend / Render + MongoDB Atlas for backend is the planned path — pending the user
buying a domain and creating those accounts).

## `cms/` — AI-first client website CMS

A brand-new, separate product: a multi-tenant dashboard TapReach's team uses to build and manage
websites for its clients, with an AI command bar as the primary editing interface (so non-technical
staff never touch code). Does not integrate with or depend on `frontend/`/`backend/` above.

Stack: Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind + shadcn/ui (Base UI primitives)
+ Supabase/Postgres (with Row Level Security for multi-tenancy) + Claude API (AI command bar,
later phase).

Run locally:

```bash
cd cms && npm run dev            # http://localhost:3001 (see .claude/launch.json)
```

Needs `cms/.env.local` (copy from `cms/.env.local.example`) pointing at a real Supabase project —
Docker isn't available in this environment, so the local Supabase CLI stack can't run; development
happens against a real (free-tier) Supabase Cloud project instead.

Note: Next.js 16 renamed `middleware.ts` → `proxy.ts` (exported function is `proxy`, not
`middleware`). This repo already follows that convention — don't reintroduce `middleware.ts`.

### Build order

Being built one module at a time, in this order (see git history / conversation for the full
architecture rationale — schema, RLS policy shape, AI command bar guardrails, etc.):

1. **Auth + multi-tenancy foundation** — done. `profiles`, `staff_members`, `tenants`,
   `tenant_memberships`, `staff_tenant_assignments`, RLS policies, login, role-aware admin shell.
2. **Website builder core** — done. `sites`, `sections`, `site_themes`, `starter_templates`
   tables; `lib/sections/registry.ts` maps each of the 9 section types to its Zod schema, default
   content, `Renderer`, and `EditorForm`; tenant → sites → builder pages with manual
   add/edit/reorder/toggle-visibility/delete, all Server Actions validated against the registry.
3. **Public renderer + live preview** — done. `app/s/[subdomain]/page.tsx` (public, anon-readable
   via RLS, gated on `sites.status = 'live'`), staff-only full-page preview at
   `.../sites/[siteId]/preview`, both sharing `lib/sections/SitePage.tsx`.
4. **Publish + version history** — done. `site_versions` (immutable snapshots) +
   `sites.published_snapshot`. Publish snapshots current `sections`/`site_themes`/`seo`, writes it
   to `sites.published_snapshot`, and sets the site live — draft edits after that don't affect the
   public site until Publish is clicked again. The public route reads `published_snapshot`
   directly, not the draft tables. Restore copies an old snapshot into draft only, never live.
5. **Media library** — done. `media_assets` table + a public Supabase Storage bucket (`media`,
   objects at `{tenant_id}/{filename}`). `MediaPicker` (upload + pick-from-library dialog) is wired
   into every image field: Hero, About, Gallery, Testimonials (added `avatarUrl`). Gotcha worth
   remembering: `storage.buckets` has RLS enabled by default with **no policies**, which makes the
   Storage API fail with a misleading "Bucket not found" for every non-superuser request — even
   with correct `storage.objects` policies — until a read policy is added on `storage.buckets`
   itself (see migration 0005's `media_bucket_read`).
6. **AI command bar** — code complete, live verification pending. `ai_command_log` (audit trail +
   undo source), `lib/ai/tools.ts` (fixed 7-tool set: `update_section_content`, `add_section`,
   `remove_section`, `reorder_sections`, `update_theme`, `update_seo`, `request_clarification` — no
   raw-SQL/arbitrary-query tool exists), `lib/ai/context.ts` (assembles system prompt from current
   sections/theme/SEO + `z.toJSONSchema()` of each section schema), `/api/ai/command` route (manual
   tool-calling loop, `claude-sonnet-5`, pre-LLM auth/write-access check, ≤20 tool calls / ≤12
   turns, every tool re-verifies `section_id` belongs to `site_id` before writing — never trusts
   IDs the model echoes back), command bar UI + "Undo last AI change" in the builder page. Every
   layer up to the actual LLM call has been verified (auth guard, RLS, tool validation, error
   handling); the live round-trip is blocked on the Anthropic account needing API credits
   (console.anthropic.com → Plans & Billing) — not a code issue. Re-verify against the example
   commands once credits are added, then this can be marked done.
7. **Theme editor** — done. `lib/theme/schema.ts` (`site_themes.tokens` Zod schema: fonts, colors,
   radius, buttonStyle — no new migration needed, the column already existed from Phase 2) +
   `mergeThemeTokens` (2-level merge so a partial patch to `colors` doesn't wipe the rest of it —
   shared by the manual editor's full-replace `setThemeTokens` and the AI's partial-patch
   `update_theme`, both now schema-validated). Renders with **zero changes to the 9 section
   Renderers**: this shadcn/Tailwind v4 setup already drives `bg-primary`, `rounded-lg`,
   `var(--muted)` etc. off plain CSS custom properties (`--primary`, `--radius`, ...), so
   `SitePage.tsx` just overrides those variables inline on a wrapper `div` scoped to that site's
   content — verified the admin shell's own `--primary`/`--radius` are untouched outside that
   wrapper. Foreground text color on primary/accent is auto-computed via relative luminance so
   custom colors stay readable. Fonts load via a dynamically injected Google Fonts `<link>` (best
   effort — an unrecognized font name 404s harmlessly and falls back down the stack). Editor page
   at `.../sites/[siteId]/theme`.
8. Analytics + redirect layer (unifies NFC tap / QR scan tracking with website analytics via
   short links, e.g. `tapreach.in/r/xxxx`)
9. Refinements (starter templates, client self-serve access, etc.)

Core modeling decision: each website section (Hero, About, Services, Gallery, Pricing,
Testimonials, Contact, FAQ, Footer) is one row in `sections` with a `content jsonb` column
validated by a per-section-type Zod schema — the single source of truth shared by the AI tool
layer, the manual editor forms, and the renderer components (`lib/sections/registry.ts`).

## General

- Only one founder (Garvit, this session's user) is technical; the other two (Utkarsh — sales/
  design, Love — ops) are not developers. Prefer clear, demoable increments over large unreviewed
  changes to either app.
- Don't commit `node_modules/`, `venv/`, `.env`/`.env.local`, or build output — both apps have
  `.gitignore` coverage for these already; keep it that way.
