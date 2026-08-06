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
  <section className="relative bg-[#090909] py-20 md:py-28" data-testid="problem-section">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="01"
        label="The Problem"
        title={<>Great businesses stay <span className="text-gradient-green">invisible.</span></>}
        sub="You deliver five-star experiences every day. But online, silence looks like mediocrity."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PAINS.map((p, i) => (
          <Reveal key={p.n} delay={i * 0.08}>
            <div
              className="group surface surface-hover h-full rounded-xl p-6"
              data-testid={`problem-card-${i + 1}`}
            >
              <span className="font-body text-[11px] font-medium tabular-nums text-[#52525b]">{p.n}</span>
              <div className="mt-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#a1a1aa] transition-colors duration-200 group-hover:text-[#fafafa]">
                <p.icon size={18} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">{p.title}</h3>
              <p className="font-body mt-2 text-sm leading-relaxed text-[#71717a]">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Problem;
