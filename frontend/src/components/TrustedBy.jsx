import { Scissors, Dumbbell, Coffee, UtensilsCrossed, Stethoscope, Building2 } from "lucide-react";

const ITEMS = [
  { icon: Scissors, label: "Salons" },
  { icon: Dumbbell, label: "Gyms" },
  { icon: Coffee, label: "Cafes" },
  { icon: UtensilsCrossed, label: "Restaurants" },
  { icon: Stethoscope, label: "Clinics" },
  { icon: Building2, label: "Hotels" },
];

const Row = () => (
  <div className="flex shrink-0 items-center">
    {ITEMS.map(({ icon: Icon, label }) => (
      <div key={label} className="mx-10 flex items-center gap-3 text-[#5c5c5c] transition-colors duration-300 hover:text-[#B8B8B8]" data-testid={`trusted-${label.toLowerCase()}`}>
        <Icon size={22} strokeWidth={1.6} />
        <span className="font-body text-xl font-medium tracking-wide">{label}</span>
      </div>
    ))}
  </div>
);

const TrustedBy = () => (
  <section className="relative border-y border-white/5 bg-[#0B0B0B] py-12" data-testid="trusted-by-section">
    <p className="font-body mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-[#5c5c5c]">
      Trusted by local businesses everywhere
    </p>
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="animate-marquee flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  </section>
);

export default TrustedBy;
