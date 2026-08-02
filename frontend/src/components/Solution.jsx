import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Nfc, Star, TrendingUp } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const STEPS = [
  {
    icon: Nfc,
    title: "The customer taps",
    text: "One tap of any smartphone on your TapReach display. No app, no typing, no searching.",
  },
  {
    icon: Star,
    title: "Google Review opens",
    text: "Your Google review page opens instantly — at the exact moment the experience is fresh.",
  },
  {
    icon: TrendingUp,
    title: "Your business grows",
    text: "More reviews mean higher rankings, more trust, and a steady stream of new customers.",
  },
];

const Solution = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.6"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section className="spotlight relative bg-[#0B0B0B] py-24 md:py-32" data-testid="solution-section">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <Chapter
          number="CH.02"
          label="The Solution"
          align="center"
          title={<>One beautiful display. <span className="text-gradient-green">Zero friction.</span></>}
          sub="TapReach turns the happiest moment of the customer journey into a five-star review."
        />

        <div ref={ref} className="relative mx-auto mt-20 max-w-2xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/8 md:left-1/2" />
          <motion.div
            className="absolute left-6 top-0 h-full w-px origin-top bg-gradient-to-b from-[#8BFF00] to-[#65E600] shadow-[0_0_12px_rgba(139,255,0,0.6)] md:left-1/2"
            style={{ scaleY: lineScale }}
          />
          <div className="space-y-16">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.05 * i}>
                <div className={`relative flex items-start gap-8 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-14" : "md:flex-row-reverse md:pr-14 md:text-right"}`}>
                  <div
                    className={`absolute left-6 top-1 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl border border-[#8BFF00]/30 bg-[#0B0B0B] text-[#8BFF00] shadow-[0_0_24px_rgba(139,255,0,0.25)] ${
                      i % 2 ? "md:-left-0" : "md:left-auto md:-right-0 md:translate-x-1/2"
                    }`}
                  >
                    <s.icon size={20} strokeWidth={1.8} />
                  </div>
                  <div className="pl-16 md:pl-0">
                    <span className="font-body text-xs font-semibold tracking-[0.3em] text-[#8BFF00]/60">STEP {i + 1}</span>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-white">{s.title}</h3>
                    <p className="font-body mt-3 text-base leading-relaxed text-[#B8B8B8]">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
