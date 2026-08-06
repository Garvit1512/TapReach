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
      <div key={label} className="mx-8 flex items-center gap-2.5 text-[#52525b] transition-colors duration-200 hover:text-[#71717a]" data-testid={`trusted-${label.toLowerCase()}`}>
        <Icon size={18} strokeWidth={1.5} />
        <span className="font-body text-sm font-medium">{label}</span>
      </div>
    ))}
  </div>
);

const TrustedBy = () => (
  <section className="section-divider relative bg-[#090909] py-10" data-testid="trusted-by-section">
    <p className="font-body mb-6 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[#52525b]">
      Trusted by local businesses everywhere
    </p>
    <div className="relative max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="animate-marquee flex w-max max-w-none">
        <Row />
        <Row />
      </div>
    </div>
  </section>
);

export default TrustedBy;
