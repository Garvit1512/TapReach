# TapReach — PRD

## Original Problem Statement
Design and develop a premium, Awwwards-level startup website for "TapReach", a premium NFC technology startup helping local businesses collect more Google reviews via NFC Review Displays, NFC Business Cards, NFC Menus and QR solutions. Not ecommerce. Must feel like Stripe/Apple/Linear/Arc/CRED/Nothing/Framer/Raycast/Vercel. Black + neon green (#8BFF00/#65E600) + white only. Satoshi/General Sans typography. 13 sections, Framer Motion animations, lenis smooth scroll, interactive 3D NFC stand hero, contact/book-demo form, fully responsive, premium craft throughout.

## Architecture
- Frontend: React 19 (CRA + craco), Tailwind CSS, Framer Motion, lenis smooth scrolling, lucide-react icons, sonner toasts. Single-page landing with 13 sections, numbered manifesto chapters, editorial marquee, hand-crafted CSS/SVG product art (no stock product photos).
- Backend: FastAPI + MongoDB (motor). `POST /api/demo` (book-demo enquiries), `GET /api/demo` (list), `GET /api/` health.
- Logo: recreated as crisp SVG component (green NFC diamond + waves, "Tap" white / "Reach" green).

## User Personas
- Local business owner (salon/gym/cafe/clinic/hotel) wanting more Google reviews without staff effort.
- Multi-location brand manager evaluating bulk NFC deployment.
- Walk-in visitor who wants to see/tap the product (interactive hero demo).

## Core Requirements (static)
- 13 landing sections, premium dark aesthetic, brand colors only, responsive, smooth motion, working demo-booking form.

## Implemented (2026-08-01)
- Kinetic hero: masked line-by-line heading reveal, floating particles, glow gradients, mouse-tracking parallax, 3D CSS NFC stand; clicking the stand animates a phone opening a Google Review page with star fill + "Review posted" state.
- Trusted-by editorial marquee (slow, pause on hover).
- Problem (4 pain cards, CH.01), Solution timeline with scroll-drawn line (CH.02).
- Products bento grid: 5 hand-crafted CSS/SVG product renders, 2 "Coming Soon" (CH.03).
- Features 10-item glass grid (CH.04), How It Works 5-step scroll-lit timeline (CH.05).
- Gallery with spotlight/clipped-frame tiles + dark interior imagery (CH.06), animated stat counters (CH.07 stats strip), testimonials (CH.07), pricing 3 tiers with rotating conic neon border on Pro (CH.08), FAQ accordion (CH.09), contact split CTA + working demo form saved to MongoDB (CH.10).
- Sticky blur navbar + mobile menu, scroll progress bar, noise overlay, giant TAPREACH footer, SEO meta/OG tags, Satoshi via Fontshare.
- Verified: API curl (health, POST/GET demo), hero tap interaction, form submission end-to-end via UI, mobile viewport, no console errors.

## Backlog
- P0: none blocking.
- P1: Email notification on new demo request (Resend managed integration); admin view page for demo requests; real social links/phone/email from owner; Privacy/Terms pages.
- P2: Individual product detail pages, AI-generated luxury product photography, blog/SEO content, WhatsApp click-to-chat, analytics events, Lighthouse audit pass.

## Next Tasks
1. Wire Resend email on demo booking.
2. Collect real business contact details + social URLs from owner.
3. Add /admin demo-request list page.
