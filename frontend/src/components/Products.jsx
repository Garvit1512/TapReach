import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Chapter, Reveal, scrollTo } from "./shared";
import { LogoMark } from "./Logo";

const Card = ({ id, badge, big }) => (
  <div className="relative flex h-full items-center justify-center">
    <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7ae02e]/[0.06] blur-[44px] ${big ? "h-40 w-40" : "h-36 w-36"}`} />
    <div className={`-rotate-6 rounded-xl border border-white/[0.1] bg-gradient-to-br from-[#1a1a1a] to-[#111111] p-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:-rotate-3 group-hover:-translate-y-1 ${big ? "w-64" : "w-56"}`}>
      <div className="flex items-center justify-between">
        <LogoMark size={28} id={id} />
        <div className="flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3.5 w-3.5 rounded-full border border-[#7ae02e]/40" style={{ opacity: 0.3 + i * 0.3 }} />
          ))}
        </div>
      </div>
      <p className="mt-5 text-xs font-semibold text-white">TapReach Review Card</p>
      <p className="font-body mt-0.5 text-[9px] text-[#71717a]">Hold phone to tap</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="inline-flex rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[8px] font-medium uppercase tracking-wider text-[#a1a1aa]">{badge}</div>
        <div className="grid grid-cols-4 gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`h-1 w-1 ${i % 3 ? "bg-white/30" : "bg-[#7ae02e]/60"}`} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Art = {
  cardBasic: <Card id="p-basic" badge="QR" />,
  cardStandard: <Card id="p-standard" badge="NFC + QR" />,
  cardPremium: <Card id="p-premium" badge="NFC + 4 QR" big />,
  bizcard: (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[40px]" />
      <div className="w-52 rotate-3 rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#161616] to-[#111111] p-4 opacity-90 transition-transform duration-500 group-hover:rotate-1">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-[#7ae02e]/15" />
          <div>
            <div className="h-1.5 w-16 rounded bg-white/15" />
            <div className="mt-1 h-1 w-12 rounded bg-white/[0.08]" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-1 w-full rounded bg-white/[0.08]" />
          <div className="h-1 w-4/5 rounded bg-white/[0.08]" />
          <div className="h-1 w-3/5 rounded bg-[#7ae02e]/25" />
        </div>
      </div>
    </div>
  ),
  menu: (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[40px]" />
      <div className="w-44 -rotate-2 rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#161616] to-[#111111] p-4 opacity-90 transition-transform duration-500 group-hover:rotate-0">
        <div className="mx-auto h-1.5 w-14 rounded bg-white/15" />
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-1 w-16 rounded bg-white/[0.08]" />
              <div className="h-1 w-7 rounded bg-[#7ae02e]/25" />
            </div>
          ))}
        </div>
        <div className="mx-auto mt-4 grid w-9 grid-cols-4 gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`h-1 w-1 ${i % 2 ? "bg-white/25" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
    </div>
  ),
};

const PRODUCTS = [
  { art: "cardPremium", name: "Premium Custom Card", desc: "Fully custom-designed card with NFC and 4 QR codes — reviews, website, Instagram and WhatsApp, all in one tap.", tag: "Best Value", price: "Rs. 1,000", soon: false, big: true },
  { art: "cardStandard", name: "Standard NFC Card", desc: "NFC + QR review card. Tap or scan — either way, one link straight to your Google reviews.", tag: "Most Popular", price: "Rs. 750", soon: false },
  { art: "cardBasic", name: "Basic QR Card", desc: "Simple PVC card with a QR code — the fastest way to start collecting Google reviews.", tag: "Starter", price: "Rs. 400", soon: false },
  { art: "bizcard", name: "Digital Business Card", desc: "Share your full profile with a tap: contact, socials, reviews and lead capture.", price: "Join waitlist", soon: true },
  { art: "menu", name: "Restaurant NFC Menu", desc: "Contactless smart menus guests open with a single tap, with QR backup included.", price: "Join waitlist", soon: true },
];

const Products = () => (
  <section id="products" className="relative bg-[#090909] py-20 md:py-28" data-testid="products-section">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="03"
        label="Products"
        title={<>Hardware that earns <span className="text-gradient-green">its place</span> on your counter.</>}
        sub="Pick the format that fits your customer moment. Every TapReach product includes custom branding, NFC programming and a QR fallback."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.06} className={p.big ? "md:col-span-2 lg:row-span-2" : ""}>
            <div
              className="group surface surface-hover relative flex h-full flex-col overflow-hidden rounded-2xl"
              data-testid={`product-card-${p.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className={`relative overflow-hidden border-b border-white/[0.06] bg-[#111111] ${p.big ? "h-64 md:h-[22rem]" : "h-52"}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(122,224,46,0.05),transparent_60%)]" />
                {Art[p.art]}
                {p.soon && (
                  <span className="absolute right-4 top-4 rounded-md border border-white/[0.08] bg-[#161616]/90 px-2.5 py-1 text-[10px] font-medium text-[#a1a1aa] backdrop-blur-sm" data-testid={`coming-soon-${p.art}`}>
                    Coming Soon
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-1 items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">{p.name}</h3>
                      {p.tag && (
                        <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-[#a1a1aa]">{p.tag}</span>
                      )}
                    </div>
                    <p className="font-body mt-1.5 text-sm leading-relaxed text-[#71717a]">{p.desc}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{p.price}</p>
                  </div>
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#71717a] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={15} />
                  </div>
                </div>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#fafafa] transition-[border-color,background-color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.06]"
                  data-testid={`product-${p.art}-cta`}
                >
                  {p.soon ? "Join Waitlist" : "Select Product"} <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Products;
