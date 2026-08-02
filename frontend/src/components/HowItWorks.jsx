import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PenTool, Wand2, Package, Nfc, TrendingUp } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const STEPS = [
  { icon: PenTool, title: "Choose Design", text: "Pick a product and share your brand kit." },
  { icon: Wand2, title: "We Customize", text: "We craft it around your logo and review link." },
  { icon: Package, title: "We Deliver", text: "Arrives ready to use — zero setup needed." },
  { icon: Nfc, title: "Customers Tap", text: "Every happy customer is one tap from a review." },
  { icon: TrendingUp, title: "Reviews Increase", text: "Watch your rating and rankings climb." },
];

const HowItWorks = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });

  return (
    <section id="how-it-works" className="relative bg-black py-24 md:py-32" data-testid="how-it-works-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Chapter
          number="CH.05"
          label="How It Works"
          align="center"
          title={<>From order to five stars <span className="text-gradient-green">in five steps.</span></>}
        />

        <div ref={ref} className="relative mt-24">
          <div className="absolute left-6 top-0 h-full w-px bg-white/8 lg:left-0 lg:top-6 lg:h-px lg:w-full" />
          <motion.div
            className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-[#8BFF00] to-[#65E600] shadow-[0_0_12px_rgba(139,255,0,0.55)] lg:left-0 lg:top-6 lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
            style={{ scaleY: lineScale, scaleX: lineScale }}
          />
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12}>
                <div className="relative pl-16 lg:pl-0 lg:pt-20" data-testid={`step-${i + 1}`}>
                  <div className="absolute left-6 top-0 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl border border-[#8BFF00]/30 bg-black text-[#8BFF00] shadow-[0_0_24px_rgba(139,255,0,0.25)] lg:left-0 lg:top-6 lg:-translate-y-1/2 lg:translate-x-0">
                    <s.icon size={19} strokeWidth={1.8} />
                  </div>
                  <span className="font-body text-xs font-semibold tracking-[0.3em] text-[#8BFF00]/60">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-white">{s.title}</h3>
                  <p className="font-body mt-2 text-sm leading-relaxed text-[#B8B8B8]">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
