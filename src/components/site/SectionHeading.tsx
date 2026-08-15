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
      className={cn("max-w-2xl", align === "center" && "mx-auto max-w-3xl text-center", className)}
    >
      {eyebrow ? <span className="pill mb-6 text-accent">{eyebrow}</span> : null}
      <Tag className="display text-[clamp(2rem,4.2vw,3.5rem)]">{title}</Tag>
      {description ? (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
