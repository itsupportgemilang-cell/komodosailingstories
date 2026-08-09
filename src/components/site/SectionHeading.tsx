import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string | undefined;
  title: React.ReactNode;
  description?: string | undefined;
  align?: "left" | "center";
  className?: string | undefined;
  as?: "h2" | "h1";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as = "h2",
}: SectionHeadingProps) {
  const Tag = as;
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center max-w-3xl",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow text-accent mb-5">{eyebrow}</p> : null}
      <Tag className="display text-[clamp(2rem,4.2vw,3.5rem)]">{title}</Tag>
      {description ? (
        <p className="mt-6 text-muted-foreground text-base leading-relaxed max-w-xl">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}