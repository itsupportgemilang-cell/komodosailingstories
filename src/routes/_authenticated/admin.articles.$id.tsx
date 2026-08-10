import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/states";
import { useAdminList, useAdminSave } from "@/components/admin/useAdminData";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { TextAreaField, TextField, ToggleField, slugify } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/articles/$id")({
  component: ArticleEditor,
});

type Form = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  published_at: string;
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
};

const EMPTY: Form = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  author: "",
  featured_image: null,
  published_at: "",
  is_published: false,
  seo_title: "",
  seo_description: "",
  og_image: null,
};

function ArticleEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/articles/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const { data, isPending, error, refetch } = useAdminList("articles");
  const [form, setForm] = useState<Form>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const save = useAdminSave("articles", {
    onSuccess: () => navigate({ to: "/admin/articles" }),
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
      excerpt: String(row["excerpt"] ?? ""),
      content: String(row["content"] ?? ""),
      category: String(row["category"] ?? ""),
      author: String(row["author"] ?? ""),
      featured_image: (row["featured_image"] as string | null) ?? null,
      published_at: row["published_at"] ? String(row["published_at"]).slice(0, 10) : "",
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
    if (!form.title.trim()) return;
    save.mutate({
      ...(isNew ? {} : { id }),
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      category: form.category || null,
      author: form.author || null,
      featured_image: form.featured_image,
      published_at: form.published_at
        ? new Date(form.published_at).toISOString()
        : new Date().toISOString(),
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
        <Link to="/admin/articles">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to journal
        </Link>
      </Button>
      <PageHeader
        title={isNew ? "New story" : form.title || "Edit story"}
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
          label="Title"
          value={form.title}
          onChange={(value) => {
            set("title", value);
            if (isNew) set("slug", slugify(value));
          }}
        />
        <TextField label="Slug" value={form.slug} onChange={(value) => set("slug", slugify(value))} />
        <TextAreaField
          label="Excerpt"
          value={form.excerpt}
          onChange={(value) => set("excerpt", value)}
        />
        <RichTextEditor value={form.content} onChange={(value) => set("content", value)} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Category"
            value={form.category}
            onChange={(value) => set("category", value)}
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={(value) => set("author", value)}
          />
          <TextField
            label="Publish date"
            type="date"
            value={form.published_at}
            onChange={(value) => set("published_at", value)}
          />
        </div>
        <ImageUpload
          bucket="article-images"
          label="Featured image"
          value={form.featured_image}
          onChange={(value) => set("featured_image", value)}
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
          bucket="article-images"
          label="Social share image"
          value={form.og_image}
          onChange={(value) => set("og_image", value)}
        />
      </div>
    </div>
  );
}