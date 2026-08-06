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
    <section className="relative bg-[#111111] py-20 md:py-28" data-testid="faq-section">
      <div className="mx-auto max-w-2xl px-6 md:px-8">
        <Chapter number="09" label="FAQ" align="center" title={<>Questions, <span className="text-gradient-green">answered.</span></>} />
        <div className="mt-12 space-y-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <div
                  className={`overflow-hidden rounded-xl border transition-[border-color,background-color] duration-200 ${
                    isOpen ? "border-white/[0.12] bg-[#161616]" : "border-white/[0.06] bg-[#141414] hover:border-white/[0.1]"
                  }`}
                  data-testid={`faq-item-${i + 1}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    data-testid={`faq-question-${i + 1}`}
                  >
                    <span className="text-[15px] font-medium text-white">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${isOpen ? "border-[#7ae02e]/30 text-[#7ae02e]" : "border-white/[0.08] text-[#71717a]"}`}
                    >
                      <Plus size={14} strokeWidth={2} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <p className="font-body px-5 pb-4 text-sm leading-relaxed text-[#71717a]" data-testid={`faq-answer-${i + 1}`}>
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
