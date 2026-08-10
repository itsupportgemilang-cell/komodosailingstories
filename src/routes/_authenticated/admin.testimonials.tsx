import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/states";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminDelete, useAdminList, type AdminRow } from "@/components/admin/useAdminData";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TextAreaField, TextField, ToggleField } from "@/components/admin/fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAdminSave } from "@/components/admin/useAdminData";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  component: TestimonialsAdmin,
});

type Form = {
  id?: string;
  customer_name: string;
  customer_country: string;
  quote: string;
  rating: string;
  avatar: string | null;
  is_published: boolean;
};

const EMPTY: Form = {
  customer_name: "",
  customer_country: "",
  quote: "",
  rating: "5",
  avatar: null,
  is_published: true,
};

function TestimonialsAdmin() {
  const { data, isPending, error, refetch } = useAdminList("testimonials");
  const remove = useAdminDelete("testimonials");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const save = useAdminSave("testimonials", { onSuccess: () => setOpen(false) });

  function edit(row: AdminRow) {
    setForm({
      id: row.id,
      customer_name: String(row["customer_name"] ?? ""),
      customer_country: String(row["customer_country"] ?? ""),
      quote: String(row["quote"] ?? ""),
      rating: String(row["rating"] ?? 5),
      avatar: (row["avatar"] as string | null) ?? null,
      is_published: Boolean(row["is_published"]),
    });
    setOpen(true);
  }

  function submit() {
    if (!form.customer_name.trim() || !form.quote.trim()) return;
    save.mutate({
      ...(form.id ? { id: form.id } : {}),
      customer_name: form.customer_name.trim(),
      customer_country: form.customer_country || null,
      quote: form.quote.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      avatar: form.avatar,
      is_published: form.is_published,
    });
  }

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Guest words shown across the site."
        action={
          <Button
            onClick={() => {
              setForm(EMPTY);
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> New testimonial
          </Button>
        }
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}
      {data && !data.length ? <AdminEmpty title="No testimonials yet" /> : null}

      {data?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((row) => (
            <div key={row.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{String(row["customer_name"] ?? "")}</p>
                  <p className="text-xs text-muted-foreground">
                    {String(row["customer_country"] ?? "")}
                  </p>
                </div>
                <Badge variant={row["is_published"] ? "default" : "secondary"}>
                  {row["is_published"] ? "Published" : "Hidden"}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{String(row["quote"] ?? "")}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5" /> {String(row["rating"] ?? 5)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit testimonial"
                    onClick={() => edit(row)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <ConfirmDelete
                    description="This permanently deletes this testimonial."
                    onConfirm={() => remove.mutate(row.id)}
                  >
                    <Button variant="ghost" size="icon" aria-label="Delete testimonial">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmDelete>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit testimonial" : "New testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <TextField
              label="Guest name"
              value={form.customer_name}
              onChange={(value) => setForm({ ...form, customer_name: value })}
            />
            <TextField
              label="Country"
              value={form.customer_country}
              onChange={(value) => setForm({ ...form, customer_country: value })}
            />
            <TextAreaField
              label="Quote"
              value={form.quote}
              onChange={(value) => setForm({ ...form, quote: value })}
            />
            <TextField
              label="Rating (1-5)"
              type="number"
              value={form.rating}
              onChange={(value) => setForm({ ...form, rating: value })}
            />
            <ImageUpload
              bucket="testimonial-images"
              label="Avatar"
              value={form.avatar}
              onChange={(value) => setForm({ ...form, avatar: value })}
            />
            <ToggleField
              label="Published"
              checked={form.is_published}
              onChange={(value) => setForm({ ...form, is_published: value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}