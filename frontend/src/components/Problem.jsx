import { MessageSquareOff, QrCode, TrendingDown, Repeat } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const PAINS = [
  {
    icon: MessageSquareOff,
    n: "01",
    title: "Customers forget",
    text: "Happy customers walk out the door — and the review you earned never gets written.",
  },
  {
    icon: QrCode,
    n: "02",
    title: "QR codes look outdated",
    text: "Faded printouts taped to the counter don't match the premium business you've built.",
  },
  {
    icon: TrendingDown,
    n: "03",
    title: "Visibility slips away",
    text: "Fewer reviews means lower rankings — and competitors show up where you should.",
  },
  {
    icon: Repeat,
    n: "04",
    title: "Inconsistent collection",
    text: "Asking verbally works sometimes. A system works every single time.",
  },
];

const Problem = () => (
  <section className="relative bg-black py-24 md:py-32" data-testid="problem-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.01"
        label="The Problem"
        title={<>Great businesses stay <span className="text-gradient-green">invisible.</span></>}
        sub="You deliver five-star experiences every day. But online, silence looks like mediocrity."
      />
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.1}>
            <div
              className="group relative h-full rounded-3xl border border-white/8 bg-[#0B0B0B] p-8 transition-[border-color,transform] duration-500 hover:-translate-y-2 hover:border-[#ff5a5a]/25"
              data-testid={`problem-card-${i + 1}`}
            >
              <span className="font-body text-xs font-semibold tracking-[0.3em] text-white/25">{p.n}</span>
              <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#111111] text-[#ff6b6b]/80 transition-colors duration-500 group-hover:border-[#ff5a5a]/30">
                <p.icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight text-white">{p.title}</h3>
              <p className="font-body mt-3 text-sm leading-relaxed text-[#B8B8B8]">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Problem;
