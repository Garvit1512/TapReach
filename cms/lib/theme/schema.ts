import { z } from "zod";

export const themeTokensSchema = z.object({
  fonts: z.object({
    heading: z.string().default("Inter"),
    body: z.string().default("Inter"),
  }),
  colors: z.object({
    primary: z.string().default("#111111"),
    accent: z.string().default("#7ae02e"),
    background: z.string().default("#ffffff"),
    text: z.string().default("#111111"),
  }),
  radius: z.string().default("12px"),
  buttonStyle: z.enum(["solid", "outline"]).default("solid"),
});

export type ThemeTokens = z.infer<typeof themeTokensSchema>;

// Not themeTokensSchema.parse({}) — fonts/colors are required nested objects
// with no top-level default (only their individual leaf fields default), so
// parsing a truly empty object throws instead of cascading field defaults.
export const defaultThemeTokens: ThemeTokens = {
  fonts: { heading: "Inter", body: "Inter" },
  colors: { primary: "#111111", accent: "#7ae02e", background: "#ffffff", text: "#111111" },
  radius: "12px",
  buttonStyle: "solid",
};

// site_themes.tokens is merged one level deep per top-level key (fonts, colors)
// so a patch like {colors: {primary: "#f00"}} updates just that color instead
// of wiping out the rest of the colors object with a shallow spread.
export function mergeThemeTokens(
  before: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...before, ...patch };
  for (const key of ["fonts", "colors"] as const) {
    if (patch[key] && typeof patch[key] === "object") {
      merged[key] = { ...(before[key] as object | undefined), ...(patch[key] as object) };
    }
  }
  return merged;
}
