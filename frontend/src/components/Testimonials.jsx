import { Star, Quote } from "lucide-react";
import { Chapter, Reveal } from "./shared";

const TESTIMONIALS = [
  {
    quote: "We went from 3 reviews a month to 40. The stand paid for itself in the first week — guests actually enjoy tapping it.",
    name: "Aarav Mehta",
    business: "Luxe Salon & Spa",
    city: "Mumbai",
    initials: "AM",
  },
  {
    quote: "Members tap after every workout while the endorphins are high. Our Google rating jumped from 4.1 to 4.8 in two months.",
    name: "Priya Sharma",
    business: "IronWorks Fitness",
    city: "Bengaluru",
    initials: "PS",
  },
  {
    quote: "It looks like it belongs on our counter. Customers ask about it constantly — and then they leave a review. Perfect loop.",
    name: "Rohan Kapoor",
    business: "Ember & Oak Cafe",
    city: "Delhi",
    initials: "RK",
  },
];

const Testimonials = () => (
  <section className="relative bg-[#0B0B0B] py-24 md:py-32" data-testid="testimonials-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.07"
        label="Testimonials"
        align="center"
        title={<>Owners who stopped <span className="text-gradient-green">asking</span> for reviews.</>}
      />
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.12}>
            <figure
              className="glass relative flex h-full flex-col rounded-3xl p-8 transition-[border-color,transform] duration-500 hover:-translate-y-2 hover:border-[#8BFF00]/25"
              data-testid={`testimonial-${i + 1}`}
            >
              <Quote size={26} className="text-[#8BFF00]/40" fill="currentColor" strokeWidth={0} />
              <blockquote className="font-body mt-5 flex-1 text-base leading-relaxed text-white/90">"{t.quote}"</blockquote>
              <div className="mt-6 flex gap-1">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} size={14} fill="#8BFF00" stroke="#8BFF00" />
                ))}
              </div>
              <figcaption className="mt-6 flex items-center gap-4 border-t border-white/8 pt-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#8BFF00]/25 to-[#65E600]/10 text-sm font-black text-[#8BFF00]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="font-body text-xs text-[#B8B8B8]">
                    {t.business} · {t.city}
                  </p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
