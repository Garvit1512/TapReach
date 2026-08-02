import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Chapter, Reveal, EASE } from "./shared";

const FAQS = [
  { q: "Does it work on iPhone?", a: "Yes. Every iPhone from the iPhone 7 onwards reads NFC tags natively — your customers just hold their phone near the display and the review page opens. No settings, no app." },
  { q: "Does it work on Android?", a: "Absolutely. Virtually all modern Android phones have NFC enabled by default. And for the rare device without it, every TapReach product includes a beautifully integrated QR backup." },
  { q: "Does the customer need internet?", a: "The customer needs a normal mobile connection to open the Google review page — the same connection they'd use for anything else. The display itself needs no power, no WiFi and no charging." },
  { q: "Do customers need to install an app?", a: "Never. That's the entire point. One tap opens your Google review page directly in their browser. Zero downloads, zero friction." },
  { q: "How long does delivery take?", a: "Once you approve your custom design, we produce and dispatch within 3–5 business days. Most businesses are collecting reviews within a week of ordering." },
  { q: "Can I customize the design?", a: "Completely. Your logo, your brand colors, your review link — and if you ever rebrand or change links, we retarget your NFC chip remotely for free." },
];

const Faq = () => {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative bg-[#0B0B0B] py-24 md:py-32" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <Chapter number="CH.09" label="FAQ" align="center" title={<>Questions, <span className="text-gradient-green">answered.</span></>} />
        <div className="mt-14 space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-[border-color,background-color] duration-300 ${
                    isOpen ? "border-[#8BFF00]/30 bg-[#111111]" : "border-white/8 bg-[#0e0e0e] hover:border-white/20"
                  }`}
                  data-testid={`faq-item-${i + 1}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
                    data-testid={`faq-question-${i + 1}`}
                  >
                    <span className="text-base font-bold text-white md:text-lg">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${isOpen ? "border-[#8BFF00]/40 text-[#8BFF00]" : "border-white/15 text-[#B8B8B8]"}`}
                    >
                      <Plus size={15} strokeWidth={2.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <p className="font-body px-7 pb-6 text-sm leading-relaxed text-[#B8B8B8] md:text-base" data-testid={`faq-answer-${i + 1}`}>
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Faq;
