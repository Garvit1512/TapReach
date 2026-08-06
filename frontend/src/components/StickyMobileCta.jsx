import { ArrowRight, ShoppingBag } from "lucide-react";
import { scrollTo } from "./shared";

const StickyMobileCta = () => (
  <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#111111]/90 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden" data-testid="sticky-mobile-cta">
    <div className="mx-auto flex max-w-md gap-2">
      <button
        onClick={() => scrollTo("#products")}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#7ae02e]"
        aria-label="View products"
      >
        <ShoppingBag size={17} />
      </button>
      <button
        onClick={() => scrollTo("#contact")}
        className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#7ae02e] px-4 text-sm font-semibold text-[#090909]"
      >
        Get Free Mockup <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

export default StickyMobileCta;
