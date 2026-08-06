import { CheckCircle2, Smartphone, Clock } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const PROMISES = [
  {
    icon: CheckCircle2,
    title: "You approve before we print",
    body: "You see and sign off on the final design before a single card goes to production. No surprises, no reprints.",
  },
  {
    icon: Smartphone,
    title: "Tested on iPhone and Android",
    body: "Every card is quality-checked on both platforms before it reaches your counter, so the first tap always works.",
  },
  {
    icon: Clock,
    title: "Delhi-based, fast turnaround",
    body: "Cards are designed, programmed and delivered within days of approval — not weeks.",
  },
];

const Testimonials = () => (
  <section className="relative bg-[#111111] py-20 md:py-28" data-testid="testimonials-section">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="07"
        label="Our Promise"
        align="center"
        title={<>Built for owners who <span className="text-gradient-green">stopped asking</span> for reviews.</>}
      />
      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {PROMISES.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <figure
              className="surface surface-hover relative flex h-full flex-col rounded-xl p-6"
              data-testid={`promise-${i + 1}`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7ae02e]/10 text-[#7ae02e]">
                <p.icon size={18} strokeWidth={1.75} />
              </span>
              <figcaption className="mt-4 text-base font-semibold text-white">{p.title}</figcaption>
              <p className="font-body mt-2 flex-1 text-[15px] leading-relaxed text-[#a1a1aa]">{p.body}</p>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
