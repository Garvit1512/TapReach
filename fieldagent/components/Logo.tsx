/** The TapReach mark, ported from frontend/src/components/Logo.jsx. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="tr-mark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8BFF00" />
          <stop offset="1" stopColor="#7AE02E" />
        </linearGradient>
      </defs>
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        rx="11"
        transform="rotate(45 32 32)"
        fill="url(#tr-mark)"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="font-[family-name:var(--font-display)] text-[15px] font-bold tracking-tight">
      <span className="text-fg">Tap</span>
      <span className="text-green">Reach</span>
    </span>
  );
}
