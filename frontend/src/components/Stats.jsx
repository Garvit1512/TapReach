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
      duration: 2.2,
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
  { to: 500, suffix: "+", label: "Businesses Served" },
  { to: 25000, suffix: "+", label: "Reviews Generated" },
  { to: 60, suffix: "+", label: "Cities Covered" },
  { to: 98, suffix: "%", label: "Happy Clients" },
];

const Stats = () => (
  <section id="about" className="relative border-y border-white/5 bg-black py-24 md:py-28" data-testid="stats-section">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-[#8BFF00]/[0.05] blur-[120px]" />
    <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-12 px-6 md:px-12 lg:grid-cols-4">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.1} className="text-center">
          <p className="text-5xl font-black tracking-tighter text-white md:text-6xl">
            <Counter to={s.to} suffix={s.suffix} testId={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`} />
          </p>
          <p className="font-body mt-3 text-sm font-medium uppercase tracking-[0.2em] text-[#B8B8B8]">{s.label}</p>
          <div className="mx-auto mt-5 h-px w-10 bg-gradient-to-r from-transparent via-[#8BFF00] to-transparent" />
        </Reveal>
      ))}
    </div>
  </section>
);

export default Stats;
