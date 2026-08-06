import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Chapter, Reveal, GlowButton, scrollTo } from "./shared";

const TIERS = [
  {
    name: "Basic",
    price: "Rs. 400",
    per: "one-time",
    desc: "The fastest way to start collecting Google reviews.",
    features: ["PVC QR review card", "Instant Google review link", "Works on any smartphone", "No app required", "Ready in 3-5 days"],
    featured: false,
    testId: "pricing-card-basic",
  },
  {
    name: "Standard",
    price: "Rs. 750",
    per: "one-time",
    desc: "NFC + QR for a true one-tap experience.",
    features: ["NFC + QR review card", "Tap or scan — either works", "Works on iPhone and Android", "Free review-link setup", "Ready in 3-5 days"],
    featured: false,
    testId: "pricing-card-standard",
  },
  {
    name: "Premium",
    price: "Rs. 1,000",
    per: "one-time",
    desc: "Our flagship: custom-designed with four tap destinations.",
    features: ["Custom card design, your brand", "NFC plus QR dual access", "4 QR codes: reviews, website, Instagram, WhatsApp", "Priority production", "Free review-link setup"],
    featured: true,
    testId: "pricing-card-premium",
  },
];

const Pricing = () => (
  <section id="pricing" className="relative bg-[#090909] py-20 md:py-28" data-testid="pricing-section">
    <div className="relative mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="08"
        label="Pricing"
        align="center"
        title={<>One review is worth more <span className="text-gradient-green">than the display.</span></>}
        sub="Transparent, one-time pricing. Design, NFC programming and review-link setup are included before delivery."
      />
      <div className="mt-14 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08} className="h-full">
            <div
              className={`h-full rounded-xl ${
                t.featured
                  ? "border border-[#7ae02e]/30 bg-[#111111] shadow-[0_0_0_1px_rgba(122,224,46,0.1)]"
                  : "surface surface-hover"
              }`}
              data-testid={t.testId}
            >
              <TierCard t={t} featured={t.featured} />
            </div>
          </Reveal>
        ))}
      </div>
      <div className="font-body mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center gap-2 text-center text-sm text-[#71717a] sm:flex-row sm:gap-4">
        <span className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#7ae02e]" /> No monthly subscription</span>
        <span className="hidden h-1 w-1 rounded-full bg-[#3f3f46] sm:block" />
        <span>Approve the design before production starts.</span>
      </div>
    </div>
  </section>
);

const TierCard = ({ t, featured = false }) => (
  <div className="relative flex h-full flex-col p-6 md:p-7">
    {featured && (
      <span className="absolute right-6 top-6 rounded-md bg-[#7ae02e] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#090909]">
        Best Value
      </span>
    )}
    <h3 className="text-base font-semibold text-white">{t.name}</h3>
    <p className="font-body mt-1 text-sm text-[#71717a]">{t.desc}</p>
    <div className="mt-6 flex items-baseline gap-1.5">
      <span className={`text-4xl font-semibold tracking-[-0.03em] ${featured ? "text-gradient-green" : "text-white"}`}>{t.price}</span>
      <span className="font-body text-sm text-[#71717a]">{t.per}</span>
    </div>
    <ul className="mt-6 flex-1 space-y-3">
      {t.features.map((f) => (
        <li key={f} className="font-body flex items-center gap-2.5 text-sm text-[#a1a1aa]">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#7ae02e]/10">
            <Check size={10} strokeWidth={3} className="text-[#7ae02e]" />
          </span>
          {f}
        </li>
      ))}
    </ul>
    {featured ? (
      <GlowButton className="mt-6 w-full" onClick={() => scrollTo("#contact")} data-testid={`pricing-${t.name.toLowerCase()}-cta`}>
        Order {t.name} <ArrowRight size={15} strokeWidth={2.5} />
      </GlowButton>
    ) : (
      <button
        onClick={() => scrollTo("#contact")}
        className="mt-6 w-full rounded-lg border border-white/[0.1] bg-white/[0.03] py-2.5 text-sm font-medium text-[#fafafa] transition-[border-color,background-color] duration-200 hover:border-white/[0.16] hover:bg-white/[0.06]"
        data-testid={`pricing-${t.name.toLowerCase()}-cta`}
      >
        Order {t.name}
      </button>
    )}
  </div>
);

export default Pricing;
