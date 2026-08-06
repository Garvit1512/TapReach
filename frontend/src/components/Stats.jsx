import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Reveal, EASE } from "./shared";

const Counter = ({ to, suffix = "", testId }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: EASE,
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums" data-testid={testId}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const STATS = [
  { to: 24, suffix: "-Hr", label: "Production Turnaround" },
  { to: 3, suffix: "-5 Day", label: "Delivery Window" },
  { to: 4, suffix: "-in-1", label: "Tap Destinations (Premium)" },
  { to: 100, suffix: "%", label: "Design Approved Before Print" },
];

const Stats = () => (
  <section id="about" className="section-divider relative bg-[#090909] py-20 md:py-24" data-testid="stats-section">
    <div className="relative mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:px-8 lg:grid-cols-4 lg:gap-8">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="text-center">
          <p className="text-4xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
            <Counter to={s.to} suffix={s.suffix} testId={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`} />
          </p>
          <p className="font-body mt-2 text-[13px] font-medium text-[#71717a]">{s.label}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Stats;
