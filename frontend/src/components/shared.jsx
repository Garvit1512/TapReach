import { motion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 24, className = "", once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionTag = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wide text-[#a1a1aa]">
    <span className="h-1 w-1 rounded-full bg-[#7ae02e]" />
    {children}
  </span>
);

export const Chapter = ({ number, label, title, sub, align = "left" }) => (
  <div className={align === "center" ? "text-center" : "text-left"}>
    <Reveal>
      <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        {number && (
          <span className="font-body text-[11px] font-medium tabular-nums tracking-wider text-[#52525b]">{number}</span>
        )}
        <SectionTag>{label}</SectionTag>
      </div>
    </Reveal>
    <Reveal delay={0.06}>
      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">{title}</h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.12}>
        <p className={`font-body mt-4 max-w-2xl text-base leading-relaxed text-[#71717a] md:text-[17px] ${align === "center" ? "mx-auto" : ""}`}>{sub}</p>
      </Reveal>
    )}
  </div>
);

export const GlowButton = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-lg bg-[#7ae02e] px-6 py-3 text-sm font-semibold text-[#090909] transition-[background-color,opacity] duration-200 hover:bg-[#8bff00] active:opacity-90 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-transparent px-6 py-3 text-sm font-medium text-[#fafafa] transition-[border-color,background-color] duration-200 hover:border-white/[0.18] hover:bg-white/[0.04] active:bg-white/[0.06] ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const scrollTo = (hash) => {
  if (window.__lenis) window.__lenis.scrollTo(hash, { offset: -72, duration: 1.2 });
  else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
};
