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
3. Public renderer + live preview
4. Publish + version history
5. Media library
6. AI command bar (Claude API, tool-calling)
7. Theme editor
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
