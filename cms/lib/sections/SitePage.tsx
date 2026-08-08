import { SECTION_REGISTRY } from "./registry";
import type { Section } from "./types";

export function SitePage({ sections }: { sections: Section[] }) {
  return (
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
  );
}
