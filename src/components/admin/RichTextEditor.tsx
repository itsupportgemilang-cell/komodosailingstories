import { useEffect, useRef } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Link2, Quote } from "lucide-react";
import { Label } from "@/components/ui/label";

const ACTIONS = [
  { icon: Bold, label: "Bold", command: "bold", value: "" },
  { icon: Italic, label: "Italic", command: "italic", value: "" },
  { icon: Heading2, label: "Heading 2", command: "formatBlock", value: "H2" },
  { icon: Heading3, label: "Heading 3", command: "formatBlock", value: "H3" },
  { icon: Quote, label: "Quote", command: "formatBlock", value: "BLOCKQUOTE" },
  { icon: List, label: "Bulleted list", command: "insertUnorderedList", value: "" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList", value: "" },
] as const;

export function RichTextEditor({
  value,
  onChange,
  label = "Content",
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
    // only sync when the incoming value changes externally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value === "" ? "" : undefined]);

  function run(command: string, commandValue?: string) {
    ref.current?.focus();
    document.execCommand(command, false, commandValue || undefined);
    if (ref.current) onChange(ref.current.innerHTML);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="rounded-md border">
        <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1">
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              title={action.label}
              aria-label={action.label}
              onClick={() => run(action.command, action.value)}
              className="rounded p-1.5 hover:bg-accent"
            >
              <action.icon className="h-4 w-4" />
            </button>
          ))}
          <button
            type="button"
            title="Link"
            aria-label="Link"
            onClick={() => {
              const url = window.prompt("Link URL");
              if (url) run("createLink", url);
            }}
            className="rounded p-1.5 hover:bg-accent"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          className="prose-admin min-h-64 max-w-none p-3 text-sm outline-none [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
        />
      </div>
      <p className="text-xs text-muted-foreground">Content is stored as HTML.</p>
    </div>
  );
}