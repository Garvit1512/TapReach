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
    const onScroll = () => setScrolled(window.scrollY > 40);
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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-white/10 bg-black/70 backdrop-blur-2xl" : "border-b border-transparent bg-transparent"
      }`}
      data-testid="navbar"
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 md:px-12">
        <button onClick={() => go("#home")} aria-label="TapReach home" data-testid="nav-logo-btn">
          <Logo compact />
        </button>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="font-body group relative text-sm font-medium text-[#B8B8B8] transition-colors duration-300 hover:text-white"
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-[#8BFF00] transition-[width] duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go("#contact")}
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] px-6 py-2.5 text-sm font-bold text-black shadow-[0_0_18px_rgba(139,255,0,0.3)] transition-[box-shadow,transform] duration-300 hover:scale-105 hover:shadow-[0_0_36px_rgba(139,255,0,0.55)] active:scale-95 sm:inline-flex"
            data-testid="nav-book-demo-btn"
          >
            Book Demo <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="glass inline-flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            aria-label="Toggle menu"
            data-testid="nav-mobile-menu-btn"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden border-b border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                  onClick={() => go(l.href)}
                  className="rounded-xl px-4 py-3 text-left text-lg font-medium text-[#B8B8B8] transition-colors duration-200 hover:bg-white/5 hover:text-white"
                  data-testid={`nav-mobile-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                >
                  {l.label}
                </motion.button>
              ))}
              <button
                onClick={() => go("#contact")}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8BFF00] to-[#65E600] px-6 py-3.5 font-bold text-black"
                data-testid="nav-mobile-book-demo-btn"
              >
                Book Free Demo <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
