import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { Star, ArrowRight, Check, Nfc, MousePointerClick } from "lucide-react";
import { GlowButton, GhostButton, SectionTag, scrollTo, EASE } from "./shared";
import { LogoMark } from "./Logo";

const LINES = [
  { text: "Get More", cls: "text-white" },
  { text: "Google Reviews.", cls: "text-white" },
  { text: "One Tap Away.", cls: "text-gradient-green" },
];

const NfcWaves = ({ active }) => (
  <svg width="72" height="48" viewBox="0 0 72 48" fill="none" className="overflow-visible">
    {[0, 1, 2].map((i) => (
      <motion.path
        key={i}
        d={`M${14 + i * 4} ${40 - i * 2} A ${16 + i * 9} ${16 + i * 9} 0 0 1 ${58 - i * 2} ${14 + i * 4}`}
        stroke="#8BFF00"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ opacity: 0.15 }}
        animate={active ? { opacity: [0.15, 1, 0.15] } : { opacity: [0.1, 0.45, 0.1] }}
        transition={{ duration: active ? 1 : 2.6, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
        style={{ filter: "drop-shadow(0 0 6px rgba(139,255,0,0.7))" }}
      />
    ))}
  </svg>
);

const Stars = ({ size = 16, animateIn = false, gap = 0.12 }) => (
  <div className="flex gap-1">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.span
        key={i}
        initial={animateIn ? { scale: 0, rotate: -90 } : false}
        animate={animateIn ? { scale: 1, rotate: 0 } : {}}
        transition={{ delay: 0.5 + i * gap, type: "spring", stiffness: 260, damping: 14 }}
      >
        <Star size={size} fill="#8BFF00" stroke="#8BFF00" strokeWidth={1} />
      </motion.span>
    ))}
  </div>
);

const ReviewPhone = ({ posted }) => (
  <motion.div
    key="phone"
    initial={{ x: 150, y: 60, opacity: 0, rotate: 10 }}
    animate={{ x: 0, y: 0, opacity: 1, rotate: 4 }}
    exit={{ x: 150, y: 60, opacity: 0, rotate: 10 }}
    transition={{ type: "spring", stiffness: 110, damping: 17 }}
    className="absolute -bottom-4 -right-10 z-20 w-[215px] md:-right-16 md:w-[235px]"
    data-testid="hero-review-phone"
  >
    <div className="rounded-[2.2rem] border border-white/15 bg-[#050505] p-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]">
      <div className="rounded-[1.8rem] border border-white/5 bg-[#101010] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-black">G</div>
          <div>
            <p className="text-[11px] font-bold text-white">Google Reviews</p>
            <p className="font-body text-[9px] text-[#B8B8B8]">Luxe Salon &amp; Spa</p>
          </div>
        </div>
        <p className="font-body mt-4 text-[10px] text-[#B8B8B8]">Rate your experience</p>
        <div className="mt-1.5">
          <Stars size={18} animateIn />
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="h-2 w-full rounded-full bg-white/10" />
          <div className="h-2 w-4/5 rounded-full bg-white/10" />
          <div className="h-2 w-3/5 rounded-full bg-white/10" />
        </div>
        <AnimatePresence mode="wait">
          {posted ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-[#8BFF00]/15 py-2 text-[11px] font-bold text-[#8BFF00]"
            >
              <Check size={13} strokeWidth={3} /> Review posted
            </motion.div>
          ) : (
            <motion.div key="post" exit={{ opacity: 0 }} className="mt-4 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] py-2 text-center text-[11px] font-bold text-black">
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
    animate={{ y: [0, -16, 0] }}
    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
    className="preserve-3d relative"
  >
    <motion.button
      onClick={onTap}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="preserve-3d relative block cursor-pointer outline-none"
      style={{ transform: "rotateY(-14deg) rotateX(7deg)" }}
      aria-label="Tap the NFC stand"
      data-testid="hero-nfc-stand"
    >
      <div className="relative w-[270px] rounded-[2rem] border border-white/12 bg-gradient-to-b from-[#1a1a1a] via-[#101010] to-[#080808] p-7 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] md:w-[300px]">
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_0%,rgba(139,255,0,0.12),transparent_55%)]" />
        <div className="flex items-start justify-between">
          <LogoMark size={44} id="stand" />
          <NfcWaves active={tapped} />
        </div>
        <div className="mt-8 text-left">
          <p className="text-2xl font-black tracking-tight text-white">
            Tap to <span className="text-gradient-green">Review</span>
          </p>
          <p className="font-body mt-2 text-sm leading-relaxed text-[#B8B8B8]">
            Hold your phone near this stand to rate us on Google.
          </p>
        </div>
        <div className="mt-6">
          <Stars size={15} />
        </div>
        <div className="mt-7 flex items-center gap-2 rounded-full border border-[#8BFF00]/25 bg-[#8BFF00]/10 px-4 py-2">
          <Nfc size={14} className="text-[#8BFF00]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8BFF00]">NFC + QR Enabled</span>
        </div>
      </div>
      <div className="mx-auto mt-[-4px] h-[14px] w-[180px] rounded-b-[1.4rem] border-x border-b border-white/10 bg-gradient-to-b from-[#141414] to-[#050505]" />
      <div className="mx-auto h-[7px] w-[220px] rounded-full bg-black shadow-[0_18px_40px_rgba(139,255,0,0.22)]" />
      <span className="ping-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8BFF00]/40" />
    </motion.button>

    <AnimatePresence>{tapped && <ReviewPhone posted={tapped > 1} />}</AnimatePresence>
  </motion.div>
);

const Hero = () => {
  const ref = useRef(null);
  const [tapped, setTapped] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 60, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), { stiffness: 60, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (tapped !== 1) return;
    const t = setTimeout(() => setTapped(2), 2100);
    return () => clearTimeout(t);
  }, [tapped]);

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${(i * 37 + 13) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 2 + ((i * 7) % 3),
        dur: 5 + ((i * 13) % 6),
        delay: (i * 0.7) % 4,
      })),
    []
  );

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
      className="relative flex min-h-screen items-center overflow-hidden pb-24 pt-36 md:pt-40"
      data-testid="hero-section"
    >
      <div className="pointer-events-none absolute -left-40 top-[-10%] h-[560px] w-[560px] rounded-full bg-[#8BFF00]/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-[-20%] h-[620px] w-[620px] rounded-full bg-[#65E600]/[0.06] blur-[150px]" />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute rounded-full bg-[#8BFF00]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [0, -34, 0], opacity: [0.08, 0.55, 0.08] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-20 px-6 md:px-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7, ease: EASE }}>
            <SectionTag>One Tap. Endless Reach.</SectionTag>
          </motion.div>

          <h1 className="mt-8 text-5xl font-black leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl" data-testid="hero-heading">
            {LINES.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${l.cls}`}
                  initial={{ y: "112%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.35 + i * 0.14, duration: 0.95, ease: EASE }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
            className="font-body mt-7 max-w-xl text-lg leading-relaxed text-[#B8B8B8] md:text-xl"
            data-testid="hero-subheading"
          >
            Beautiful NFC Review Displays designed to help local businesses collect more Google reviews — effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <GlowButton onClick={() => scrollTo("#contact")} data-testid="hero-book-demo-btn">
              Book Free Demo <ArrowRight size={18} strokeWidth={2.5} />
            </GlowButton>
            <GhostButton onClick={() => scrollTo("#products")} data-testid="hero-view-products-btn">
              View Products
            </GhostButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="font-body mt-12 flex items-center gap-8 text-sm text-[#B8B8B8]"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8BFF00] shadow-[0_0_8px_#8BFF00]" /> No app required
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8BFF00] shadow-[0_0_8px_#8BFF00]" /> Works on iPhone &amp; Android
            </span>
          </motion.div>
        </div>

        <motion.div
          style={{ y: parallaxY, opacity: fade }}
          initial={{ opacity: 0, scale: 0.9, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.1, ease: EASE }}
          className="relative flex justify-center [perspective:1200px] lg:justify-end"
        >
          <motion.div style={{ rotateX, rotateY }} className="preserve-3d relative">
            <NfcStand tapped={tapped} onTap={() => setTapped(1)} />
          </motion.div>
          <AnimatePresence>
            {!tapped && (
              <motion.button
                onClick={() => setTapped(1)}
                exit={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="glass absolute -bottom-14 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[#8BFF00]"
                data-testid="hero-tap-hint"
              >
                <MousePointerClick size={14} /> Tap the stand
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
