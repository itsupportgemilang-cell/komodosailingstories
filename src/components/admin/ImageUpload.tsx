import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

async function uploadFile(bucket: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, TEN_YEARS);
  if (signError || !data?.signedUrl) throw new Error(signError?.message ?? "Could not sign URL");
  return data.signedUrl;
}

function bucketPathFromUrl(bucket: string, url: string): string | null {
  const marker = `/object/sign/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0] ?? "");
}

export function ImageUpload({
  bucket,
  label,
  value,
  onChange,
}: {
  bucket: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadFile(bucket, file);
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove() {
    const path = value ? bucketPathFromUrl(bucket, value) : null;
    onChange(null);
    if (path) await supabase.storage.from(bucket).remove([path]);
    toast.success("Image removed");
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt={label}
            className="h-32 w-52 rounded-md border object-cover"
            loading="lazy"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute -right-2 -top-2 rounded-full border bg-background p-1 shadow"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={busy} asChild>
          <label className="cursor-pointer">
            {busy ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {value ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={busy}
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        </Button>
        <Input
          value={value ?? ""}
          placeholder="or paste an image URL / path"
          onChange={(e) => onChange(e.target.value || null)}
          className="max-w-md"
        />
      </div>
    </div>
  );
}

export function GalleryUpload({
  bucket,
  value,
  onChange,
}: {
  bucket: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(bucket, file));
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>Gallery</Label>
      {value.length ? (
        <div className="flex flex-wrap gap-2">
          {value.map((src, i) => (
            <div key={`${src}-${i}`} className="relative">
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="h-24 w-32 rounded-md border object-cover"
                loading="lazy"
              />
              <button
                type="button"
                aria-label="Remove gallery image"
                onClick={async () => {
                  const path = bucketPathFromUrl(bucket, src);
                  onChange(value.filter((_, index) => index !== i));
                  if (path) await supabase.storage.from(bucket).remove([path]);
                }}
                className="absolute -right-2 -top-2 rounded-full border bg-background p-1 shadow"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No gallery images yet.</p>
      )}
      <Button type="button" variant="outline" size="sm" disabled={busy} asChild>
        <label className="cursor-pointer">
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Add images
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </Button>
    </div>
  );
}