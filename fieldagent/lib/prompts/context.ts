/**
 * TapReach business context.
 *
 * Mirrors the `tapreach-context` skill that Garvit's Claude Code setup loads.
 * Kept in one place so every command shares the same numbers — if pricing
 * changes, it changes here and nowhere else.
 */
export const TAPREACH_CONTEXT = `
# TapReach — business context

TapReach is a Delhi NCR startup run by three final-year BTech students:
- **Garvit** — technical co-founder. Builds and hosts the websites, owns the platform.
- **Utkarsh** — sales and design. Does the field visits. He is the primary user of this tool.
- **Love (Luv)** — operations.

## What we sell

**1. NFC + QR review cards (the wedge product).**
A PVC card with an embedded NTAG NFC chip and up to 4 printed QR codes. A customer
taps their phone on the card and it opens the business's review page. Sold to local
businesses: salons, gyms, restaurants, clinics, retail, cafes, hotels.

Card pricing:
- Basic — ₹500
- Standard — ₹800
- Premium — ₹1,200 (NFC + up to 4 QR codes)

Volume discounts: 3+ cards 10% off, 5+ cards 15% off.
(So 5 Premium = 5 × ₹1,200 = ₹6,000, less 15% = ₹5,100 — an effective ₹1,020/card,
which is the "paanchva card sirf ₹780 ka" style line when framed against the marginal unit.)

**2. Websites (the real revenue line).**
From ₹11,999 onwards. Standard build ~₹12,000; Premium ~₹25,000–28,000.
Baseline features on every site: contact button, WhatsApp connect, Google Maps embed,
mobile-first, basic SEO, SSL hosting.
Care plan retainer: ₹1,000/month.

**3. Restaurant digital menu system.**
₹11,999 launch offer — covers 8–12 tables, includes 12 NFC menu cards.
Plus ₹500/month hosting.

## Contact
tapreach.co@gmail.com · @tapreach.co · 9220446626 · 7000768428 · Delhi NCR

## The moat we are building toward

Every chip and QR is encoded with a TapReach short URL that redirects to whatever
destination we point it at. Chips are physically locked after encoding and can never
be rewritten, so the redirect layer is what makes "destination editable" and "tap
analytics" real. It is what stops a client churning to a ₹399 competitor: their card,
their history, and their stats live in our system.

The roadmap runs in rings:
- **Ring 1** — the card and the website. Sell now.
- **Ring 2** — tap analytics, review-response management, destination-switching-as-a-service.
  Sellable once the redirect layer is live.
- **Ring 3** — customer database, loyalty, win-back messages, booking. The real moat,
  because it makes a client's data live in our system rather than being swappable.
- **Ring 4** — selling infrastructure to other resellers, or licensing the playbook to
  another city. Not client-facing at all.

## Hard rules

- **No review gating, ever.** Google prohibits filtering unhappy customers away from
  review pages and prohibits incentivised reviews. Never propose routing customers
  differently based on sentiment, star rating, or a pre-screen question. If asked for
  something that looks like gating, push back and say why.
- **Never use Google's logo or branding** in any material — trademark exposure.
- Language in the field is Hinglish. Write openers, objection handling, and WhatsApp
  messages the way Utkarsh will actually say them, not in formal English.
`.trim();
