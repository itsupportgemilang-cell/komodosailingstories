import type { ItineraryDay } from "@/types/content";
import { Reveal } from "./Reveal";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  if (!days.length) return null;
  return (
    <ol className="border-l border-border">
      {days.map((day, i) => (
        <Reveal as="li" key={`${day.day}-${i}`} delay={i * 60} className="relative pb-14 pl-8">
          <span className="absolute top-2 -left-[4.5px] size-2 rounded-full bg-accent" />
          <p className="eyebrow text-accent">{day.day}</p>
          <h3 className="mt-2 font-serif text-2xl">{day.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {day.description}
          </p>
        </Reveal>
      ))}
    </ol>
  );
}