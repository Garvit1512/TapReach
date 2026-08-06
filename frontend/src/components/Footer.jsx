import { MessageCircle, Mail } from "lucide-react";
import Logo from "./Logo";
import { scrollTo } from "./shared";

const COLS = [
  {
    title: "Products",
    links: [
      { label: "Premium Custom Card", href: "#products" },
      { label: "Standard NFC Card", href: "#products" },
      { label: "Basic QR Card", href: "#products" },
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
  { icon: MessageCircle, label: "WhatsApp", testId: "social-whatsapp", href: "https://wa.me/919953070340" },
  { icon: Mail, label: "Email", testId: "social-email", href: "mailto:tapreach.co@gmail.com" },
];

const Footer = () => (
  <footer className="section-divider relative overflow-hidden bg-[#111111] pt-16" data-testid="footer">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="font-body mt-4 max-w-xs text-sm leading-relaxed text-[#71717a]">
            One Tap. Endless Reach. Premium NFC displays that turn every customer into a review.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#71717a] transition-[color,border-color] duration-200 hover:border-white/[0.14] hover:text-[#fafafa]"
                data-testid={s.testId}
              >
                <s.icon size={15} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="font-body text-xs font-medium text-[#52525b]">{c.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => l.href !== "#" && scrollTo(l.href)}
                    className="font-body text-sm text-[#71717a] transition-colors duration-200 hover:text-[#fafafa]"
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
      <p className="whitespace-nowrap text-center text-[12vw] font-semibold leading-none tracking-[-0.04em] text-white/[0.03]">
        TAPREACH
      </p>
    </div>

    <div className="border-t border-white/[0.06]">
      <div className="font-body mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-[#52525b] md:flex-row md:px-8">
        <span>© {new Date().getFullYear()} TapReach. All rights reserved.</span>
        <span>Turn every customer into a review.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
