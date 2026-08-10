import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

export function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(items.map((entry, i) => (i === index ? e.target.value : entry)))
            }
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove ${label} item`}
            onClick={() => onChange(items.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        <Plus className="mr-2 h-4 w-4" /> Add item
      </Button>
    </div>
  );
}

type Repeatable = Record<string, string>;

export function RepeaterEditor({
  label,
  items,
  fields,
  onChange,
}: {
  label: string;
  items: Repeatable[];
  fields: Array<{ key: string; label: string; multiline?: boolean }>;
  onChange: (items: Repeatable[]) => void;
}) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, ""])) as Repeatable;
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {items.map((item, index) => (
        <div key={index} className="space-y-3 rounded-md border p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {label} #{index + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Remove ${label} entry`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {fields.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label className="text-xs">{field.label}</Label>
              {field.multiline ? (
                <Textarea
                  rows={3}
                  value={item[field.key] ?? ""}
                  onChange={(e) =>
                    onChange(
                      items.map((entry, i) =>
                        i === index ? { ...entry, [field.key]: e.target.value } : entry,
                      ),
                    )
                  }
                />
              ) : (
                <Input
                  value={item[field.key] ?? ""}
                  onChange={(e) =>
                    onChange(
                      items.map((entry, i) =>
                        i === index ? { ...entry, [field.key]: e.target.value } : entry,
                      ),
                    )
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, blank])}>
        <Plus className="mr-2 h-4 w-4" /> Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

export function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  return [];
}

export function toObjectArray(value: unknown): Repeatable[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => {
    const record = (entry ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(record).map(([key, val]) => [key, val == null ? "" : String(val)]),
    ) as Repeatable;
  });
}