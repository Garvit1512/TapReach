import { Chapter, Reveal } from "./shared";
import { LogoMark } from "./Logo";

const IMAGES = {
  salon: "https://images.unsplash.com/photo-1663811397207-418a92396ad5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbHV4dXJ5JTIwc2Fsb24lMjBkYXJrJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzg1NjE0NTIwfDA&ixlib=rb-4.1.0&q=85",
  gym: "https://images.unsplash.com/photo-1637430308606-86576d8fef3c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbW9kZXJuJTIwbHV4dXJ5JTIwZ3ltJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzg1NjE0NTIwfDA&ixlib=rb-4.1.0&q=85",
  cafe: "https://images.unsplash.com/photo-1745066113904-e8449839197b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjBkYXJrJTIwY2FmZSUyMGludGVyaW9yfGVufDB8fHx8MTc4NTYxNDUyMHww&ixlib=rb-4.1.0&q=85",
};

const MiniStand = ({ id }) => (
  <div className="glass flex items-center gap-3 rounded-2xl p-3 pr-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
    <LogoMark size={30} id={id} />
    <div>
      <p className="text-[11px] font-black text-white">Tap to Review</p>
      <p className="font-body text-[9px] text-[#B8B8B8]">TapReach Display</p>
    </div>
  </div>
);

const TILES = [
  { label: "Salon", img: IMAGES.salon, tall: true },
  { label: "Gym", img: IMAGES.gym },
  { label: "Cafe", img: IMAGES.cafe },
  { label: "Reception" },
  { label: "Restaurant", tall: true },
  { label: "Hotel" },
];

const Gallery = () => (
  <section className="relative bg-[#0B0B0B] py-24 md:py-32" data-testid="gallery-section">
    <div className="mx-auto max-w-7xl px-6 md:px-12">
      <Chapter
        number="CH.06"
        label="In The Wild"
        title={<>Made for the spaces <span className="text-gradient-green">you've perfected.</span></>}
        sub="TapReach displays sit quietly in the world's most considered interiors — until the moment they're needed."
      />
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t, i) => (
          <Reveal key={t.label} delay={(i % 3) * 0.08}>
            <div
              className={`group relative overflow-hidden rounded-3xl border border-white/8 ${t.tall ? "h-[420px]" : "h-[340px]"}`}
              data-testid={`gallery-${t.label.toLowerCase()}`}
            >
              {t.img ? (
                <img
                  src={t.img}
                  alt={`${t.label} interior with TapReach display`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.4] transition-[transform,filter] duration-[1.2s] ease-out group-hover:scale-105 group-hover:brightness-[0.5]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1a1a1a,#050505_70%)] transition-transform duration-[1.2s] group-hover:scale-105">
                  <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full bg-[#8BFF00]/[0.05] blur-[50px]" />
                </div>
              )}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,255,0,0.08),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8BFF00]/80">0{i + 1}</span>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-white">{t.label}</h3>
                </div>
                <div className="translate-y-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <MiniStand id={`g-${i}`} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
