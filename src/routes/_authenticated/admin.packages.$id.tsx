import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/states";
import { useAdminList, useAdminSave } from "@/components/admin/useAdminData";
import { GalleryUpload, ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  RepeaterEditor,
  StringListEditor,
  TextAreaField,
  TextField,
  ToggleField,
  slugify,
  toObjectArray,
  toStringArray,
} from "@/components/admin/fields";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin/packages/$id")({
  component: PackageEditor,
});

type Form = {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  price_label: string;
  duration: string;
  location: string;
  featured_image: string | null;
  gallery: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: Array<Record<string, string>>;
  faq: Array<Record<string, string>>;
  featured: boolean;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  price_label: "",
  duration: "",
  location: "",
  featured_image: null,
  gallery: [],
  highlights: [],
  included: [],
  excluded: [],
  itinerary: [],
  faq: [],
  featured: false,
  is_published: false,
  seo_title: "",
  seo_description: "",
  og_image: null,
};

function PackageEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/packages/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useAdminList("packages");
  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const save = useAdminSave("packages", {
    onSuccess: () => navigate({ to: "/admin/packages" }),
  });

  useEffect(() => {
    if (isNew) {
      setLoaded(true);
      return;
    }
    const row = data?.find((entry) => entry.id === id);
    if (!row || loaded) return;
    setForm({
      title: String(row["title"] ?? ""),
      slug: String(row["slug"] ?? ""),
      short_description: String(row["short_description"] ?? ""),
      description: String(row["description"] ?? ""),
      price: row["price"] == null ? "" : String(row["price"]),
      price_label: String(row["price_label"] ?? ""),
      duration: String(row["duration"] ?? ""),
      location: String(row["location"] ?? ""),
      featured_image: (row["featured_image"] as string | null) ?? null,
      gallery: toStringArray(row["gallery"]),
      highlights: toStringArray(row["highlights"]),
      included: toStringArray(row["included"]),
      excluded: toStringArray(row["excluded"]),
      itinerary: toObjectArray(row["itinerary"]),
      faq: toObjectArray(row["faq"]),
      featured: Boolean(row["featured"]),
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
    const slug = form.slug.trim() || slugify(form.title);
    if (!form.title.trim()) return;
    save.mutate({
      ...(isNew ? {} : { id }),
      title: form.title.trim(),
      slug,
      short_description: form.short_description || null,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      price_label: form.price_label || null,
      duration: form.duration || null,
      location: form.location || null,
      featured_image: form.featured_image,
      gallery: form.gallery,
      highlights: form.highlights.filter(Boolean),
      included: form.included.filter(Boolean),
      excluded: form.excluded.filter(Boolean),
      itinerary: form.itinerary,
      faq: form.faq,
      featured: form.featured,
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
        <Link to="/admin/packages">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to packages
        </Link>
      </Button>

      <PageHeader
        title={isNew ? "New package" : form.title || "Edit package"}
        description="Everything here is published straight to the live website."
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

      <Tabs defaultValue="basics">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="details">Inclusions & FAQ</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-5">
          <TextField
            label="Title"
            value={form.title}
            onChange={(value) => {
              set("title", value);
              if (isNew) set("slug", slugify(value));
            }}
          />
          <TextField
            label="Slug"
            value={form.slug}
            onChange={(value) => set("slug", slugify(value))}
            hint="Used in the public URL: /packages/your-slug"
          />
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
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Price (IDR)"
              type="number"
              value={form.price}
              onChange={(value) => set("price", value)}
            />
            <TextField
              label="Price label"
              value={form.price_label}
              onChange={(value) => set("price_label", value)}
              placeholder="per person, sharing"
            />
            <TextField
              label="Duration"
              value={form.duration}
              onChange={(value) => set("duration", value)}
              placeholder="3 days / 2 nights"
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(value) => set("location", value)}
            />
          </div>
          <StringListEditor
            label="Highlights"
            items={form.highlights}
            onChange={(items) => set("highlights", items)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField
              label="Featured"
              description="Show on the home page"
              checked={form.featured}
              onChange={(value) => set("featured", value)}
            />
            <ToggleField
              label="Published"
              description="Visible on the public site"
              checked={form.is_published}
              onChange={(value) => set("is_published", value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <ImageUpload
            bucket="package-images"
            label="Featured image"
            value={form.featured_image}
            onChange={(value) => set("featured_image", value)}
          />
          <GalleryUpload
            bucket="package-images"
            value={form.gallery}
            onChange={(value) => set("gallery", value)}
          />
        </TabsContent>

        <TabsContent value="itinerary">
          <RepeaterEditor
            label="Itinerary day"
            items={form.itinerary}
            fields={[
              { key: "day", label: "Day" },
              { key: "title", label: "Title" },
              { key: "description", label: "Description", multiline: true },
            ]}
            onChange={(items) => set("itinerary", items)}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <StringListEditor
            label="Included"
            items={form.included}
            onChange={(items) => set("included", items)}
          />
          <StringListEditor
            label="Not included"
            items={form.excluded}
            onChange={(items) => set("excluded", items)}
          />
          <RepeaterEditor
            label="FAQ"
            items={form.faq}
            fields={[
              { key: "question", label: "Question" },
              { key: "answer", label: "Answer", multiline: true },
            ]}
            onChange={(items) => set("faq", items)}
          />
        </TabsContent>

        <TabsContent value="seo" className="space-y-5">
          <TextField
            label="SEO title"
            value={form.seo_title}
            onChange={(value) => set("seo_title", value)}
            hint="Under 60 characters works best."
          />
          <TextAreaField
            label="SEO description"
            value={form.seo_description}
            onChange={(value) => set("seo_description", value)}
            hint="Under 160 characters works best."
          />
          <ImageUpload
            bucket="package-images"
            label="Social share image"
            value={form.og_image}
            onChange={(value) => set("og_image", value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}