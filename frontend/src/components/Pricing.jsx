import { Check, ArrowRight } from "lucide-react";
import { Chapter, Reveal, GlowButton, scrollTo } from "./shared";

const TIERS = [
  {
    name: "Starter",
    price: "₹499",
    per: "one-time",
    desc: "The perfect first tap.",
    features: ["PVC NFC Review Card", "Custom branding & logo", "QR backup included", "Works on iPhone & Android", "Free link retargeting"],
    featured: false,
    testId: "pricing-card-starter",
  },
  {
    name: "Professional",
    price: "₹999",
    per: "one-time",
    desc: "Our flagship counter display.",
    features: ["Premium acrylic review stand", "Fully custom design", "NFC + QR dual tap", "Water resistant finish", "Priority support", "Free link retargeting"],
    featured: true,
    testId: "pricing-card-pro",
  },
  {
    name: "Business",
    price: "Custom",
    per: "quote",
    desc: "For multi-location brands.",
    features: ["Multiple branches", "Bulk custom displays", "On-site installation", "Dedicated account manager", "Review analytics support"],
    featured: false,
    testId: "pricing-card-business",
  },
];

const Pricing = () => (
  <section id="pricing" className="relative bg-black py-24 md:py-32" data-testid="pricing-section">
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[#8BFF00]/[0.04] blur-[140px]" />
    <div className="relative mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.08"
        label="Pricing"
        align="center"
        title={<>One review is worth more <span className="text-gradient-green">than the display.</span></>}
        sub="Transparent, one-time pricing. No subscriptions, no surprises."
      />
      <div className="mt-16 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12} className="h-full">
            {t.featured ? (
              <div className="relative h-full overflow-hidden rounded-[2rem] p-px" data-testid={t.testId}>
                <div className="absolute inset-[-120%] animate-[spin_7s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#8BFF00_50deg,transparent_110deg,transparent_180deg,#65E600_240deg,transparent_300deg)]" />
                <TierCard t={t} featured />
              </div>
            ) : (
              <div className="h-full rounded-[2rem] border border-white/8 bg-[#0B0B0B] transition-[border-color,transform] duration-500 hover:-translate-y-1.5 hover:border-white/20" data-testid={t.testId}>
                <TierCard t={t} />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const TierCard = ({ t, featured = false }) => (
  <div className={`relative flex h-full flex-col rounded-[calc(2rem-1px)] p-9 ${featured ? "bg-[#0B0B0B]" : ""}`}>
    {featured && (
      <span className="absolute right-7 top-7 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
        Most Popular
      </span>
    )}
    <h3 className="text-lg font-bold text-white">{t.name}</h3>
    <p className="font-body mt-1 text-sm text-[#B8B8B8]">{t.desc}</p>
    <div className="mt-7 flex items-baseline gap-2">
      <span className={`text-5xl font-black tracking-tighter ${featured ? "text-gradient-green" : "text-white"}`}>{t.price}</span>
      <span className="font-body text-sm text-[#B8B8B8]">{t.per}</span>
    </div>
    <ul className="mt-8 flex-1 space-y-3.5">
      {t.features.map((f) => (
        <li key={f} className="font-body flex items-center gap-3 text-sm text-[#B8B8B8]">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8BFF00]/15">
            <Check size={11} strokeWidth={3} className="text-[#8BFF00]" />
          </span>
          {f}
        </li>
      ))}
    </ul>
    {featured ? (
      <GlowButton className="mt-9 w-full" onClick={() => scrollTo("#contact")} data-testid="pricing-pro-cta">
        Get Professional <ArrowRight size={16} strokeWidth={2.5} />
      </GlowButton>
    ) : (
      <button
        onClick={() => scrollTo("#contact")}
        className="glass mt-9 w-full rounded-full py-3.5 text-sm font-bold text-white transition-[background-color,transform] duration-300 hover:scale-[1.02] hover:bg-white/10 active:scale-95"
        data-testid={`pricing-${t.name.toLowerCase()}-cta`}
      >
        {t.name === "Business" ? "Request Quote" : `Get ${t.name}`}
      </button>
    )}
  </div>
);

export default Pricing;
