import { SECTION_REGISTRY } from "./registry";
import type { Section } from "./types";
import type { ThemeTokens } from "@/lib/theme/schema";
import { themeCssVars, googleFontsHref } from "@/lib/theme/css";

export function SitePage({
  sections,
  theme,
  siteId = "default",
}: {
  sections: Section[];
  theme?: Partial<ThemeTokens>;
  siteId?: string;
}) {
  const fontBody = theme?.fonts?.body;
  const fontHeading = theme?.fonts?.heading || fontBody;
  const fontsHref = googleFontsHref(theme?.fonts);

  return (
    <div
      data-site-theme={siteId}
      data-button-style={theme?.buttonStyle ?? "solid"}
      className="bg-background text-foreground"
      style={{ ...themeCssVars(theme), fontFamily: fontBody ? `${fontBody}, sans-serif` : undefined }}
    >
      {fontsHref && <link rel="stylesheet" href={fontsHref} />}
      {fontHeading && fontHeading !== fontBody && (
        <style>
          {`[data-site-theme="${siteId}"] h1,[data-site-theme="${siteId}"] h2,[data-site-theme="${siteId}"] h3{font-family:${fontHeading}, sans-serif;}`}
        </style>
      )}
      {theme?.buttonStyle === "outline" && (
        <style>
          {`[data-site-theme="${siteId}"][data-button-style="outline"] .bg-primary{background-color:transparent;color:var(--primary);border:1px solid var(--primary);}`}
        </style>
      )}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        {sections.map((section) => {
          const { Renderer } = SECTION_REGISTRY[section.type];
          return <Renderer key={section.id} content={section.content} />;
        })}
        {sections.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            This site doesn&apos;t have any content yet.
          </p>
        )}
      </div>
    </div>
  );
}
