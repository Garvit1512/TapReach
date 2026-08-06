import { Chapter, Reveal } from "./shared";
import { LogoMark } from "./Logo";

const IMAGES = {
  salon: "https://images.unsplash.com/photo-1663811397207-418a92396ad5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbHV4dXJ5JTIwc2Fsb24lMjBkYXJrJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzg1NjE0NTIwfDA&ixlib=rb-4.1.0&q=85",
  gym: "https://images.unsplash.com/photo-1637430308606-86576d8fef3c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwyfHxkYXJrJTIwbW9kZXJuJTIwbHV4dXJ5JTIwZ3ltJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzg1NjE0NTIwfDA&ixlib=rb-4.1.0&q=85",
  cafe: "https://images.unsplash.com/photo-1745066113904-e8449839197b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNzl8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBtb2Rlcm4lMjBkYXJrJTIwY2FmZSUyMGludGVyaW9yfGVufDB8fHx8MTc4NTYxNDUyMHww&ixlib=rb-4.1.0&q=85",
};

const MiniStand = ({ id }) => (
  <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.1] bg-[#161616]/95 p-2.5 pr-4 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm">
    <LogoMark size={26} id={id} />
    <div>
      <p className="text-[10px] font-semibold text-white">Tap to Review</p>
      <p className="font-body text-[9px] text-[#71717a]">TapReach Display</p>
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
  <section className="relative bg-[#111111] py-20 md:py-28" data-testid="gallery-section">
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <Chapter
        number="06"
        label="In The Wild"
        title={<>Made for the spaces <span className="text-gradient-green">you've perfected.</span></>}
        sub="TapReach displays sit quietly in the world's most considered interiors — until the moment they're needed."
      />
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map((t, i) => (
          <Reveal key={t.label} delay={(i % 3) * 0.06}>
            <div
              className={`group relative overflow-hidden rounded-xl border border-white/[0.06] ${t.tall ? "h-[380px]" : "h-[300px]"}`}
              data-testid={`gallery-${t.label.toLowerCase()}`}
            >
              {t.img ? (
                <img
                  src={t.img}
                  alt={`${t.label} interior with TapReach display`}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover brightness-[0.45] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-[0.52]"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1a1a1a,#090909_70%)] transition-transform duration-700 group-hover:scale-[1.02]">
                  <div className="absolute right-[-24px] top-[-24px] h-32 w-32 rounded-full bg-[#7ae02e]/[0.04] blur-[40px]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="font-body text-[10px] font-medium tabular-nums text-[#52525b]">0{i + 1}</span>
                  <h3 className="mt-0.5 text-xl font-semibold tracking-[-0.02em] text-white">{t.label}</h3>
                </div>
                <div className="translate-y-2 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
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
