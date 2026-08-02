import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 44, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-70px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionTag = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-[#8BFF00]/25 bg-[#8BFF00]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8BFF00]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#8BFF00] shadow-[0_0_10px_#8BFF00]" />
    {children}
  </span>
);

export const Chapter = ({ number, label, title, sub, align = "left" }) => (
  <div className={align === "center" ? "text-center" : "text-left"}>
    <Reveal>
      <div className={`flex items-baseline gap-4 ${align === "center" ? "justify-center" : ""}`}>
        <span className="font-body text-sm font-semibold tracking-[0.3em] text-[#8BFF00]/70">{number}</span>
        <SectionTag>{label}</SectionTag>
      </div>
    </Reveal>
    <Reveal delay={0.08}>
      <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.16}>
        <p className={`font-body mt-5 max-w-2xl text-lg leading-relaxed text-[#B8B8B8] ${align === "center" ? "mx-auto" : ""}`}>{sub}</p>
      </Reveal>
    )}
  </div>
);

export const GlowButton = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] px-8 py-4 text-base font-bold text-black shadow-[0_0_24px_rgba(139,255,0,0.3)] transition-[box-shadow,transform] duration-300 hover:scale-[1.04] hover:shadow-[0_0_48px_rgba(139,255,0,0.55)] active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, className = "", ...props }) => (
  <button
    className={`glass inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium text-white transition-[background-color,transform] duration-300 hover:scale-[1.03] hover:bg-white/10 active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const scrollTo = (hash) => {
  if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -76, duration: 1.4 });
  else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
};
