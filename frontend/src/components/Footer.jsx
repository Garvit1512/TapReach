import { Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";
import Logo from "./Logo";
import { scrollTo } from "./shared";

const COLS = [
  {
    title: "Products",
    links: [
      { label: "NFC Review Stand", href: "#products" },
      { label: "PVC Review Card", href: "#products" },
      { label: "Table Stand", href: "#products" },
      { label: "Digital Business Card", href: "#products" },
      { label: "NFC Menu", href: "#products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", testId: "social-instagram" },
  { icon: Linkedin, label: "LinkedIn", testId: "social-linkedin" },
  { icon: MessageCircle, label: "WhatsApp", testId: "social-whatsapp" },
  { icon: Mail, label: "Email", testId: "social-email" },
];

const Footer = () => (
  <footer className="relative overflow-hidden border-t border-white/8 bg-[#0B0B0B] pt-20" data-testid="footer">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="font-body mt-5 max-w-xs text-sm leading-relaxed text-[#B8B8B8]">
            One Tap. Endless Reach. Premium NFC displays that turn every customer into a review.
          </p>
          <div className="mt-7 flex gap-3">
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                aria-label={s.label}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-[#B8B8B8] transition-[color,border-color,transform] duration-300 hover:scale-110 hover:border-[#8BFF00]/40 hover:text-[#8BFF00]"
                data-testid={s.testId}
              >
                <s.icon size={17} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-body text-xs font-bold uppercase tracking-[0.22em] text-white/60">{c.title}</h4>
            <ul className="mt-5 space-y-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => l.href !== "#" && scrollTo(l.href)}
                    className="font-body text-sm text-[#B8B8B8] transition-colors duration-200 hover:text-[#8BFF00]"
                    data-testid={`footer-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="select-none overflow-hidden" aria-hidden="true">
      <p className="whitespace-nowrap text-center text-[13vw] font-black leading-[0.85] tracking-tighter text-white/[0.04]">
        TAPREACH
      </p>
    </div>

    <div className="border-t border-white/5">
      <div className="font-body mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-[#5c5c5c] md:flex-row md:px-12">
        <span>© {new Date().getFullYear()} TapReach. All rights reserved.</span>
        <span>Turn every customer into a review.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
