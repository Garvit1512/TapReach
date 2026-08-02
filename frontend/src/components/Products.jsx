import { ArrowUpRight } from "lucide-react";
import { Chapter, Reveal } from "./shared";
import { LogoMark } from "./Logo";

const Art = {
  stand: (
    <div className="relative flex h-full items-end justify-center pb-8">
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8BFF00]/10 blur-[60px]" />
      <div className="group-hover:-translate-y-2 transition-transform duration-700">
        <div className="w-48 rounded-3xl border border-white/12 bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] p-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]">
          <LogoMark size={40} id="p-stand" />
          <p className="mt-4 text-base font-black text-white">Tap to <span className="text-gradient-green">Review</span></p>
          <div className="mt-3 h-1.5 w-3/4 rounded-full bg-white/10" />
          <div className="mt-1.5 h-1.5 w-1/2 rounded-full bg-white/10" />
          <div className="mt-4 inline-flex rounded-full bg-[#8BFF00]/15 px-3 py-1 text-[8px] font-bold uppercase tracking-widest text-[#8BFF00]">NFC</div>
        </div>
        <div className="mx-auto h-2.5 w-24 rounded-b-xl border-x border-b border-white/10 bg-[#0a0a0a]" />
      </div>
    </div>
  ),
  card: (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8BFF00]/10 blur-[55px]" />
      <div className="w-64 -rotate-6 rounded-2xl border border-white/12 bg-gradient-to-br from-[#1c1c1c] via-[#101010] to-[#080808] p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)] transition-transform duration-700 group-hover:-rotate-3 group-hover:-translate-y-2">
        <div className="flex items-center justify-between">
          <LogoMark size={30} id="p-card" />
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-4 w-4 rounded-full border border-[#8BFF00]/60" style={{ opacity: 0.3 + i * 0.3 }} />
            ))}
          </div>
        </div>
        <p className="mt-6 text-xs font-bold text-white">TapReach Review Card</p>
        <p className="font-body mt-1 text-[9px] text-[#B8B8B8]">Hold phone to tap</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="h-5 w-8 rounded-md border border-[#8BFF00]/40 bg-[#8BFF00]/10" />
          <div className="grid grid-cols-4 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`h-1 w-1 ${i % 3 ? "bg-white/40" : "bg-[#8BFF00]/70"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  tent: (
    <div className="relative flex h-full items-end justify-center pb-10">
      <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8BFF00]/10 blur-[55px]" />
      <div className="transition-transform duration-700 group-hover:-translate-y-2">
        <div className="relative h-0 w-0 border-b-[150px] border-l-[95px] border-r-[95px] border-b-[#161616] border-l-transparent border-r-transparent drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]">
          <div className="absolute left-1/2 top-16 -translate-x-1/2 text-center">
            <LogoMark size={30} id="p-tent" />
            <p className="mt-2 whitespace-nowrap text-[10px] font-black text-white">Review us on <span className="text-gradient-green">Google</span></p>
          </div>
        </div>
      </div>
    </div>
  ),
  bizcard: (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-[50px]" />
      <div className="w-60 rotate-3 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141414] to-[#070707] p-5 opacity-80 transition-transform duration-700 group-hover:rotate-1">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#8BFF00]/20" />
          <div>
            <div className="h-2 w-20 rounded-full bg-white/20" />
            <div className="mt-1.5 h-1.5 w-14 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-white/10" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
          <div className="h-1.5 w-3/5 rounded-full bg-[#8BFF00]/30" />
        </div>
      </div>
    </div>
  ),
  menu: (
    <div className="relative flex h-full items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.06] blur-[50px]" />
      <div className="w-48 -rotate-2 rounded-2xl border border-white/10 bg-gradient-to-br from-[#141414] to-[#070707] p-5 opacity-80 transition-transform duration-700 group-hover:rotate-0">
        <div className="mx-auto h-2 w-16 rounded-full bg-white/20" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-1.5 w-20 rounded-full bg-white/10" />
              <div className="h-1.5 w-8 rounded-full bg-[#8BFF00]/30" />
            </div>
          ))}
        </div>
        <div className="mx-auto mt-5 grid w-10 grid-cols-4 gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className={`h-1.5 w-1.5 ${i % 2 ? "bg-white/30" : "bg-white/10"}`} />
          ))}
        </div>
      </div>
    </div>
  ),
};

const PRODUCTS = [
  { art: "stand", name: "NFC Review Stand", desc: "Premium acrylic counter stand. The flagship — one tap opens your Google review page.", tag: "Best Seller", soon: false, big: true },
  { art: "card", name: "PVC NFC Review Card", desc: "Wallet-sized tap card your team can carry anywhere. NFC + QR built in.", tag: "From ₹499", soon: false },
  { art: "tent", name: "Google Review Table Stand", desc: "Elegant table-tent display for restaurants, clinics and reception desks.", tag: "Popular", soon: false },
  { art: "bizcard", name: "Digital Business Card", desc: "Share your full profile with a tap — contact, socials, reviews, everything.", soon: true },
  { art: "menu", name: "Restaurant NFC Menu", desc: "Contactless smart menus that guests open with a single tap.", soon: true },
];

const Products = () => (
  <section id="products" className="relative bg-black py-24 md:py-32" data-testid="products-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.03"
        label="Products"
        title={<>Hardware that earns <span className="text-gradient-green">its place</span> on your counter.</>}
        sub="Every TapReach product is designed, customized and finished to match your brand — not ours."
      />
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.name} delay={(i % 3) * 0.08} className={p.big ? "md:col-span-2 lg:row-span-2" : ""}>
            <div
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/8 bg-[#0B0B0B] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-2 hover:border-[#8BFF00]/30 hover:shadow-[0_30px_80px_-30px_rgba(139,255,0,0.2)]"
              data-testid={`product-card-${p.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className={`relative overflow-hidden border-b border-white/5 bg-[#0e0e0e] ${p.big ? "h-72 md:h-[26rem]" : "h-60"}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(139,255,0,0.07),transparent_60%)]" />
                {Art[p.art]}
                {p.soon && (
                  <span className="glass absolute right-5 top-5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white" data-testid={`coming-soon-${p.art}`}>
                    Coming Soon
                  </span>
                )}
              </div>
              <div className="flex flex-1 items-start justify-between gap-4 p-7">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold tracking-tight text-white">{p.name}</h3>
                    {p.tag && (
                      <span className="rounded-full border border-[#8BFF00]/25 bg-[#8BFF00]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#8BFF00]">{p.tag}</span>
                    )}
                  </div>
                  <p className="font-body mt-2 text-sm leading-relaxed text-[#B8B8B8]">{p.desc}</p>
                </div>
                <div className="glass mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8BFF00] opacity-0 transition-[opacity,transform] duration-500 group-hover:opacity-100">
                  <ArrowUpRight size={17} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Products;
