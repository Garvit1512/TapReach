export const LogoMark = ({ size = 40, id = "lg" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" data-testid="logo-mark">
    <defs>
      <linearGradient id={`trg-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8BFF00" />
        <stop offset="100%" stopColor="#65E600" />
      </linearGradient>
    </defs>
    <path d="M41 5.5c7 1.2 11.5 5.7 12.7 12.7" stroke={`url(#trg-${id})`} strokeWidth="4" strokeLinecap="round" />
    <path d="M41 13.5c4.4.8 7.2 3.6 8 8" stroke={`url(#trg-${id})`} strokeWidth="4" strokeLinecap="round" />
    <circle cx="41.5" cy="26.5" r="2.4" fill={`url(#trg-${id})`} />
    <rect x="16" y="30" width="22" height="22" rx="6" transform="rotate(45 27 41)" stroke="#FFFFFF" strokeWidth="3.5" />
    <rect x="14.5" y="20.5" width="25" height="25" rx="7" transform="rotate(45 27 33)" fill={`url(#trg-${id})`} />
  </svg>
);

const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-2.5" data-testid="logo">
    <LogoMark size={compact ? 34 : 40} />
    <span className={`font-black tracking-tight ${compact ? "text-xl" : "text-2xl"}`}>
      <span className="text-white">Tap</span>
      <span className="text-gradient-green">Reach</span>
    </span>
  </div>
);

export default Logo;
