import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Star, ArrowRight, Check, Nfc, MousePointerClick } from "lucide-react";
import { GlowButton, GhostButton, SectionTag, scrollTo, EASE } from "./shared";
import { LogoMark } from "./Logo";

const LINES = [
  { text: "Get More", cls: "text-[#fafafa]" },
  { text: "Google Reviews.", cls: "text-[#fafafa]" },
  { text: "One Tap Away.", cls: "text-gradient-green" },
];

const NfcWaves = ({ active }) => (
  <svg width="72" height="48" viewBox="0 0 72 48" fill="none" className="overflow-visible">
    {[0, 1, 2].map((i) => (
      <motion.path
        key={i}
        d={`M${14 + i * 4} ${40 - i * 2} A ${16 + i * 9} ${16 + i * 9} 0 0 1 ${58 - i * 2} ${14 + i * 4}`}
        stroke="#7AE02E"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ opacity: 0.2 }}
        animate={active ? { opacity: [0.2, 0.8, 0.2] } : { opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: active ? 1 : 2.6, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
      />
    ))}
  </svg>
);

const Stars = ({ size = 16, animateIn = false, gap = 0.12 }) => (
  <div className="flex gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.span
        key={i}
        initial={animateIn ? { scale: 0, rotate: -90 } : false}
        animate={animateIn ? { scale: 1, rotate: 0 } : {}}
        transition={{ delay: 0.5 + i * gap, type: "spring", stiffness: 260, damping: 14 }}
      >
        <Star size={size} fill="#7AE02E" stroke="#7AE02E" strokeWidth={1} />
      </motion.span>
    ))}
  </div>
);

const ReviewPhone = ({ posted }) => (
  <motion.div
    key="phone"
    initial={{ x: 120, y: 40, opacity: 0, rotate: 8 }}
    animate={{ x: 0, y: 0, opacity: 1, rotate: 3 }}
    exit={{ x: 120, y: 40, opacity: 0, rotate: 8 }}
    transition={{ type: "spring", stiffness: 110, damping: 17 }}
    className="absolute -bottom-4 -right-10 z-20 w-[210px] md:-right-14 md:w-[225px]"
    data-testid="hero-review-phone"
  >
    <div className="rounded-[1.75rem] border border-white/[0.1] bg-[#111111] p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]">
      <div className="rounded-[1.4rem] border border-white/[0.06] bg-[#161616] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">G</div>
          <div>
            <p className="text-[11px] font-semibold text-white">Google Reviews</p>
            <p className="font-body text-[9px] text-[#71717a]">Luxe Salon &amp; Spa</p>
          </div>
        </div>
        <p className="font-body mt-4 text-[10px] text-[#71717a]">Rate your experience</p>
        <div className="mt-1.5">
          <Stars size={16} animateIn />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-1.5 w-full rounded bg-white/[0.08]" />
          <div className="h-1.5 w-4/5 rounded bg-white/[0.08]" />
          <div className="h-1.5 w-3/5 rounded bg-white/[0.08]" />
        </div>
        <AnimatePresence mode="wait">
          {posted ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-[#7ae02e]/10 py-2 text-[11px] font-semibold text-[#7ae02e]"
            >
              <Check size={12} strokeWidth={2.5} /> Review posted
            </motion.div>
          ) : (
            <motion.div key="post" exit={{ opacity: 0 }} className="mt-4 rounded-lg bg-[#7ae02e] py-2 text-center text-[11px] font-semibold text-[#090909]">
              Post review
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </motion.div>
);

const NfcStand = ({ tapped, onTap }) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    className="preserve-3d relative"
  >
    <motion.button
      onClick={onTap}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="preserve-3d relative block cursor-pointer outline-none"
      style={{ transform: "rotateY(-12deg) rotateX(6deg)" }}
      aria-label="Tap the NFC card"
      data-testid="hero-nfc-stand"
    >
      <div className="relative w-[260px] rounded-2xl border border-white/[0.1] bg-gradient-to-b from-[#1a1a1a] to-[#111111] p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] md:w-[290px]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_0%,rgba(122,224,46,0.08),transparent_55%)]" />
        <div className="flex items-start justify-between">
          <LogoMark size={40} id="stand" />
          <NfcWaves active={tapped} />
        </div>
        <div className="mt-7 text-left">
          <p className="text-xl font-semibold tracking-[-0.02em] text-white">
            Tap to <span className="text-gradient-green">Review</span>
          </p>
          <p className="font-body mt-2 text-sm leading-relaxed text-[#71717a]">
            Hold your phone near this card to rate us on Google.
          </p>
        </div>
        <div className="mt-5">
          <Stars size={14} />
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
          <Nfc size={13} className="text-[#7ae02e]" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#a1a1aa]">NFC + QR Enabled</span>
        </div>
      </div>
      <div className="mx-auto mt-[-3px] h-3 w-[160px] rounded-b-xl border-x border-b border-white/[0.08] bg-[#141414]" />
      <div className="mx-auto h-1.5 w-[200px] rounded-full bg-[#090909] shadow-[0_12px_32px_rgba(0,0,0,0.5)]" />
      <span className="ping-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7ae02e]/20" />
    </motion.button>

    <AnimatePresence>{tapped && <ReviewPhone posted={tapped > 1} />}</AnimatePresence>
  </motion.div>
);

const Hero = () => {
  const ref = useRef(null);
  const [tapped, setTapped] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 60, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 60, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (tapped !== 1) return;
    const t = setTimeout(() => setTapped(2), 2100);
    return () => clearTimeout(t);
  }, [tapped]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden pb-20 pt-32 md:pt-36"
      data-testid="hero-section"
    >
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[#7ae02e]/[0.04] blur-[120px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 px-6 md:px-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: EASE }}>
            <SectionTag>One Tap. Endless Reach.</SectionTag>
          </motion.div>

          <h1 className="mt-6 text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.04em] md:text-6xl lg:text-[4rem]" data-testid="hero-heading">
            {LINES.map((l, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className={`block ${l.cls}`}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: EASE }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
            className="font-body mt-6 max-w-lg text-[17px] leading-relaxed text-[#71717a]"
            data-testid="hero-subheading"
          >
            Custom NFC review displays for salons, gyms, cafes and clinics - designed, programmed and delivered ready to use.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <GlowButton onClick={() => scrollTo("#contact")} data-testid="hero-book-demo-btn">
              Get Free Mockup <ArrowRight size={16} strokeWidth={2.5} />
            </GlowButton>
            <GhostButton onClick={() => scrollTo("#products")} data-testid="hero-view-products-btn">
              View Products
            </GhostButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="font-body mt-10 flex flex-wrap items-center gap-6 text-[13px] text-[#52525b]"
          >
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#7ae02e]" /> No app required
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#7ae02e]" /> Works on iPhone &amp; Android
            </span>
          </motion.div>
        </div>

        <motion.div
          style={{ y: parallaxY, opacity: fade }}
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: EASE }}
          className="relative flex justify-center [perspective:1200px] lg:justify-end"
        >
          <motion.div style={{ rotateX, rotateY }} className="preserve-3d relative">
            <NfcStand tapped={tapped} onTap={() => setTapped(1)} />
          </motion.div>
          <AnimatePresence>
            {!tapped && (
              <motion.button
                onClick={() => setTapped(1)}
                exit={{ opacity: 0, y: 8 }}
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-white/[0.08] bg-[#111111]/90 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-[#a1a1aa] backdrop-blur-sm"
                data-testid="hero-tap-hint"
              >
                <MousePointerClick size={13} /> Tap the card
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


