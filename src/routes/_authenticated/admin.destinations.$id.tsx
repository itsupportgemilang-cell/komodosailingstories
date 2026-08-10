import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/states";
import { useAdminList, useAdminSave } from "@/components/admin/useAdminData";
import { GalleryUpload, ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  TextAreaField,
  TextField,
  ToggleField,
  slugify,
  toStringArray,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/destinations/$id")({
  component: DestinationEditor,
});

type Form = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  featured_image: string | null;
  gallery: string[];
  sort_order: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
};

const EMPTY: Form = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  featured_image: null,
  gallery: [],
  sort_order: "0",
  is_published: false,
  seo_title: "",
  seo_description: "",
  og_image: null,
};

function DestinationEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/destinations/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useAdminList("destinations");
  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const save = useAdminSave("destinations", {
    onSuccess: () => navigate({ to: "/admin/destinations" }),
  });

  useEffect(() => {
    if (isNew) {
      setLoaded(true);
      return;
    }
    const row = data?.find((entry) => entry.id === id);
    if (!row || loaded) return;
    setForm({
      name: String(row["name"] ?? ""),
      slug: String(row["slug"] ?? ""),
      short_description: String(row["short_description"] ?? ""),
      description: String(row["description"] ?? ""),
      featured_image: (row["featured_image"] as string | null) ?? null,
      gallery: toStringArray(row["gallery"]),
      sort_order: String(row["sort_order"] ?? 0),
      is_published: Boolean(row["is_published"]),
      seo_title: String(row["seo_title"] ?? ""),
      seo_description: String(row["seo_description"] ?? ""),
      og_image: (row["og_image"] as string | null) ?? null,
    });
    setLoaded(true);
  }, [data, id, isNew, loaded]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submit(publish?: boolean) {
    if (!form.name.trim()) return;
    save.mutate({
      ...(isNew ? {} : { id }),
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      short_description: form.short_description || null,
      description: form.description || null,
      featured_image: form.featured_image,
      gallery: form.gallery,
      sort_order: Number(form.sort_order) || 0,
      is_published: publish ?? form.is_published,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      og_image: form.og_image,
    });
  }

  if (!isNew && isPending) return <AdminLoading />;
  if (error) return <AdminError error={error} onRetry={() => refetch()} />;

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/admin/destinations">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to destinations
        </Link>
      </Button>
      <PageHeader
        title={isNew ? "New destination" : form.name || "Edit destination"}
        action={
          <div className="flex gap-2">
            <Button variant="outline" disabled={save.isPending} onClick={() => submit(false)}>
              Save draft
            </Button>
            <Button disabled={save.isPending} onClick={() => submit(true)}>
              {save.isPending ? "Saving…" : "Save & publish"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <TextField
          label="Name"
          value={form.name}
          onChange={(value) => {
            set("name", value);
            if (isNew) set("slug", slugify(value));
          }}
        />
        <TextField label="Slug" value={form.slug} onChange={(value) => set("slug", slugify(value))} />
        <TextAreaField
          label="Short description"
          value={form.short_description}
          onChange={(value) => set("short_description", value)}
        />
        <RichTextEditor
          label="Description"
          value={form.description}
          onChange={(value) => set("description", value)}
        />
        <TextField
          label="Sort order"
          type="number"
          value={form.sort_order}
          onChange={(value) => set("sort_order", value)}
        />
        <ImageUpload
          bucket="destination-images"
          label="Featured image"
          value={form.featured_image}
          onChange={(value) => set("featured_image", value)}
        />
        <GalleryUpload
          bucket="destination-images"
          value={form.gallery}
          onChange={(value) => set("gallery", value)}
        />
        <ToggleField
          label="Published"
          checked={form.is_published}
          onChange={(value) => set("is_published", value)}
        />
        <TextField
          label="SEO title"
          value={form.seo_title}
          onChange={(value) => set("seo_title", value)}
        />
        <TextAreaField
          label="SEO description"
          value={form.seo_description}
          onChange={(value) => set("seo_description", value)}
        />
        <ImageUpload
          bucket="destination-images"
          label="Social share image"
          value={form.og_image}
          onChange={(value) => set("og_image", value)}
        />
      </div>
    </div>
  );
}