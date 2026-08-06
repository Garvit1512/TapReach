import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "./Logo";
import { scrollTo, EASE } from "./shared";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    scrollTo(href);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6"
      data-testid="navbar"
    >
      <nav
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-xl px-4 transition-all duration-300 md:px-5 ${
          scrolled
            ? "border border-white/[0.08] bg-[#111111]/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <button onClick={() => go("#home")} aria-label="TapReach home" data-testid="nav-logo-btn">
          <Logo compact />
        </button>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="font-body rounded-md px-3 py-1.5 text-[13px] font-medium text-[#a1a1aa] transition-colors duration-200 hover:text-[#fafafa]"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => go("#contact")}
            className="hidden items-center gap-1.5 rounded-lg bg-[#7ae02e] px-4 py-2 text-[13px] font-semibold text-[#090909] transition-colors duration-200 hover:bg-[#8bff00] sm:inline-flex"
            data-testid="nav-book-demo-btn"
          >
            Get Mockup <ArrowRight size={14} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#fafafa] lg:hidden"
            aria-label="Toggle menu"
            data-testid="nav-mobile-menu-btn"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-xl border border-white/[0.08] bg-[#111111]/95 backdrop-blur-xl lg:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="flex flex-col p-2">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.3, ease: EASE }}
                  onClick={() => go(l.href)}
                  className="rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-[#a1a1aa] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[#fafafa]"
                  data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {l.label}
                </motion.button>
              ))}
              <button
                onClick={() => go("#contact")}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#7ae02e] px-4 py-3 text-sm font-semibold text-[#090909]"
                data-testid="nav-mobile-book-demo-btn"
              >
                Get Free Mockup <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
