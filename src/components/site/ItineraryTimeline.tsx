import type { ItineraryDay } from "@/types/content";
import { Reveal } from "./Reveal";

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  if (!days.length) return null;
  return (
    <ol className="space-y-4">
      {days.map((day, i) => (
        <Reveal as="li" key={`${day.day}-${i}`} delay={i * 60}>
          <div className="float-card flex gap-5 p-6 sm:p-8">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <span className="pill !py-1 !text-[0.66rem] text-accent">{day.day}</span>
              <h3 className="mt-3 text-xl font-medium">{day.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {day.description}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
