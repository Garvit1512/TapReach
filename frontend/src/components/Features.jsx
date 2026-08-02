import { Smartphone, Apple, Zap, SlidersHorizontal, Gem, Palette, QrCode, Truck, Droplets, Sparkles } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const FEATURES = [
  { icon: Smartphone, title: "Works on Android", text: "Native NFC support on virtually every modern Android phone." },
  { icon: Apple, title: "Works on iPhone", text: "iPhone 7 and newer tap instantly — no settings to change.", big: true },
  { icon: Zap, title: "No App Required", text: "Customers never download anything. Tap and go." },
  { icon: SlidersHorizontal, title: "Fully Customizable", text: "Your logo, your colors, your review link — retarget anytime." },
  { icon: Gem, title: "Premium Acrylic", text: "Museum-grade cast acrylic with polished, laser-cut edges.", big: true },
  { icon: Palette, title: "Custom Branding", text: "Designed to look like it was made by your brand, for your brand." },
  { icon: QrCode, title: "QR Backup", text: "A beautifully integrated QR code covers the 1% without NFC." },
  { icon: Truck, title: "Fast Delivery", text: "Designed, printed and shipped to your door within days." },
  { icon: Droplets, title: "Water Resistant", text: "Spill-proof, wipe-clean surfaces built for busy counters." },
  { icon: Sparkles, title: "Premium Finish", text: "Matte-laminated, fingerprint-resistant, unmistakably premium.", big: true },
];

const Features = () => (
  <section className="relative bg-[#0B0B0B] py-24 md:py-32" data-testid="features-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.04"
        label="Features"
        title={<>Engineered to disappear. <span className="text-gradient-green">Designed to be noticed.</span></>}
        sub="Every detail exists for one reason — to make leaving a review feel effortless."
      />
      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 4) * 0.06} className={f.big ? "sm:col-span-2" : ""}>
            <div
              className="glass group h-full rounded-3xl p-7 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[#8BFF00]/30 hover:shadow-[0_20px_50px_-20px_rgba(139,255,0,0.25)]"
              data-testid={`feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8BFF00]/20 bg-[#8BFF00]/10 text-[#8BFF00] transition-transform duration-500 group-hover:scale-110">
                <f.icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-white">{f.title}</h3>
              <p className="font-body mt-2 text-sm leading-relaxed text-[#B8B8B8]">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
