import { Smartphone, Apple, Zap, SlidersHorizontal, Gem, Palette, QrCode, Truck, Droplets, Sparkles } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const FEATURES = [
  { icon: Smartphone, title: "Works on Android", text: "Native NFC support on virtually every modern Android phone." },
  { icon: Apple, title: "Works on iPhone", text: "iPhone 7 and newer tap instantly — no settings to change.", big: true },
  { icon: Zap, title: "No App Required", text: "Customers never download anything. Tap and go." },
  { icon: SlidersHorizontal, title: "Fully Customizable", text: "Your logo, your colors, your review link — retarget anytime." },
  { icon: Gem, title: "Premium Materials", text: "Durable, laminated PVC cards with a matte, museum-grade finish.", big: true },
  { icon: Palette, title: "Custom Branding", text: "Designed to look like it was made by your brand, for your brand." },
  { icon: QrCode, title: "QR Backup", text: "A beautifully integrated QR code covers the 1% without NFC." },
  { icon: Truck, title: "Fast Delivery", text: "Designed, printed and shipped to your door within days." },
  { icon: Droplets, title: "Water Resistant", text: "Spill-proof, wipe-clean surfaces built for busy counters." },
  { icon: Sparkles, title: "Premium Finish", text: "Matte-laminated, fingerprint-resistant, unmistakably premium.", big: true },
];

const Features = () => (
  <section className="relative bg-[#111111] py-20 md:py-28" data-testid="features-section">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="04"
        label="Features"
        title={<>Engineered to disappear. <span className="text-gradient-green">Designed to be noticed.</span></>}
        sub="Every detail exists for one reason — to make leaving a review feel effortless."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.05} className={f.big ? "sm:col-span-2" : ""}>
            <div
              className="group surface surface-hover h-full rounded-xl p-6"
              data-testid={`feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#7ae02e]">
                <f.icon size={17} strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.01em] text-white">{f.title}</h3>
              <p className="font-body mt-1.5 text-sm leading-relaxed text-[#71717a]">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
