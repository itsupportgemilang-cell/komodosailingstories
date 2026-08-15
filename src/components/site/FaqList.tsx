import type { FaqItem } from "@/types/content";

export function FaqList({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <details
          key={i}
          className="group rounded-[1.5rem] border border-border bg-card px-6 py-5 transition-colors duration-300 open:border-accent/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium">
            {item.question}
            <span className="circle-btn size-9 shrink-0 text-lg leading-none transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
