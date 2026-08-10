import type { CSSProperties } from "react";
import type { ThemeTokens } from "./schema";

// Simple WCAG-ish relative luminance check so button/badge text stays
// readable regardless of what primary/accent color the tenant picks.
function readableForeground(hex: string | undefined): string | undefined {
  if (!hex) return undefined;
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!match) return undefined;

  const channels = [match[1], match[2], match[3]].map((h) => parseInt(h, 16) / 255);
  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = channels.map(linear);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.55 ? "#111111" : "#ffffff";
}

export function themeCssVars(theme: Partial<ThemeTokens> | undefined): CSSProperties {
  const vars: Record<string, string> = {};
  const colors = theme?.colors;

  if (colors?.primary) {
    vars["--primary"] = colors.primary;
    vars["--primary-foreground"] = readableForeground(colors.primary) ?? "#ffffff";
  }
  if (colors?.accent) {
    vars["--accent"] = colors.accent;
    vars["--accent-foreground"] = readableForeground(colors.accent) ?? "#ffffff";
  }
  if (colors?.background) vars["--background"] = colors.background;
  if (colors?.text) vars["--foreground"] = colors.text;
  if (theme?.radius) vars["--radius"] = theme.radius;

  return vars as CSSProperties;
}

function toGoogleFontsFamilyParam(name: string) {
  return encodeURIComponent(name).replace(/%20/g, "+");
}

// Best-effort: if the tenant typed a font name that isn't on Google Fonts,
// this request 404s harmlessly and the browser falls back down the stack.
export function googleFontsHref(fonts: Partial<ThemeTokens["fonts"]> | undefined): string | null {
  const names = Array.from(
    new Set([fonts?.heading, fonts?.body].filter((f): f is string => !!f && f.trim().length > 0)),
  );
  if (names.length === 0) return null;

  const families = names.map((n) => `family=${toGoogleFontsFamilyParam(n)}:wght@400;500;600;700`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
