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
    <section className="spotlight relative bg-[#111111] py-20 md:py-28" data-testid="solution-section">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <Chapter
          number="02"
          label="The Solution"
          align="center"
          title={<>One beautiful display. <span className="text-gradient-green">Zero friction.</span></>}
          sub="TapReach turns the happiest moment of the customer journey into a five-star review."
        />

        <div ref={ref} className="relative mx-auto mt-16 max-w-2xl">
          <div className="absolute left-6 top-0 h-full w-px bg-white/[0.06] md:left-1/2" />
          <motion.div
            className="absolute left-6 top-0 h-full w-px origin-top bg-[#7ae02e] md:left-1/2"
            style={{ scaleY: lineScale }}
          />
          <div className="space-y-12">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.04 * i}>
                <div className={`relative flex items-start gap-6 md:w-1/2 ${i % 2 ? "md:ml-auto md:pl-12" : "md:flex-row-reverse md:pr-12 md:text-right"}`}>
                  <div
                    className={`absolute left-6 top-0.5 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-lg border border-white/[0.08] bg-[#161616] text-[#7ae02e] ${
                      i % 2 ? "md:-left-0" : "md:left-auto md:-right-0 md:translate-x-1/2"
                    }`}
                  >
                    <s.icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="pl-14 md:pl-0">
                    <span className="font-body text-[11px] font-medium tabular-nums text-[#52525b]">Step {i + 1}</span>
                    <h3 className="mt-1.5 text-xl font-semibold tracking-[-0.02em] text-white">{s.title}</h3>
                    <p className="font-body mt-2 text-[15px] leading-relaxed text-[#71717a]">{s.text}</p>
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
