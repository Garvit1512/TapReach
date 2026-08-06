import { Palette, Link2, PackageCheck, TrendingUp } from "lucide-react";

const ITEMS = [
  { icon: Palette, title: "Free mockup first", text: "See your logo and colors on the display before production." },
  { icon: Link2, title: "Review link setup", text: "We program NFC and QR to open your Google review page." },
  { icon: PackageCheck, title: "Ready in 3-5 days", text: "Approved designs move quickly into production and dispatch." },
  { icon: TrendingUp, title: "Built for more reviews", text: "Place it where happy customers naturally pause and tap." },
];

const ConversionStrip = () => (
  <section className="section-divider relative bg-[#090909]" data-testid="conversion-strip">
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="bg-[#090909] px-6 py-6 md:px-7">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#7ae02e]">
              <Icon size={16} strokeWidth={1.75} />
            </span>
            <div>
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <p className="font-body mt-1 text-sm leading-relaxed text-[#71717a]">{text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ConversionStrip;
