import type { FaqItem } from "@/types/content";

export function FaqList({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, i) => (
        <details key={i} className="group py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl">
            {item.question}
            <span className="text-accent transition-transform duration-300 group-open:rotate-45">
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