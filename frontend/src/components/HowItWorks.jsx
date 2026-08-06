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
    <section id="how-it-works" className="relative bg-[#090909] py-20 md:py-28" data-testid="how-it-works-section">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Chapter
          number="05"
          label="How It Works"
          align="center"
          title={<>From order to five stars <span className="text-gradient-green">in five steps.</span></>}
        />

        <div ref={ref} className="relative mt-16">
          <div className="absolute left-5 top-0 h-full w-px bg-white/[0.06] lg:left-0 lg:top-5 lg:h-px lg:w-full" />
          <motion.div
            className="absolute left-5 top-0 h-full w-px origin-top bg-[#7ae02e] lg:left-0 lg:top-5 lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r lg:from-[#7ae02e] lg:to-[#7ae02e]/40"
            style={{ scaleY: lineScale, scaleX: lineScale }}
          />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="relative pl-14 lg:pl-0 lg:pt-16" data-testid={`step-${i + 1}`}>
                  <div className="absolute left-5 top-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-lg border border-white/[0.08] bg-[#161616] text-[#7ae02e] lg:left-0 lg:top-5 lg:-translate-y-1/2 lg:translate-x-0">
                    <s.icon size={16} strokeWidth={1.75} />
                  </div>
                  <span className="font-body text-[11px] font-medium tabular-nums text-[#52525b]">0{i + 1}</span>
                  <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-white">{s.title}</h3>
                  <p className="font-body mt-1.5 text-sm leading-relaxed text-[#71717a]">{s.text}</p>
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
