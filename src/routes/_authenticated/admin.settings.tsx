import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminGetSettings, adminSaveSettings } from "@/lib/services/admin.functions";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/states";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { TextAreaField, TextField } from "@/components/admin/fields";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

type Form = Record<string, string | null>;

const FIELDS = [
  ["company_name", "Company name"],
  ["whatsapp", "WhatsApp number"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["instagram", "Instagram URL"],
  ["facebook", "Facebook URL"],
  ["default_seo_title", "Default SEO title"],
] as const;

function SettingsAdmin() {
  const getSettings = useServerFn(adminGetSettings);
  const saveSettings = useServerFn(adminSaveSettings);
  const queryClient = useQueryClient();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => getSettings(),
  });
  const [form, setForm] = useState<Form>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!data || loaded) return;
    const next: Form = {};
    for (const [key, value] of Object.entries(data)) {
      next[key] = value == null ? "" : String(value);
    }
    setForm(next);
    setLoaded(true);
  }, [data, loaded]);

  const mutation = useMutation({
    mutationFn: (values: Form) => saveSettings({ data: values }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings saved");
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  if (isPending) return <AdminLoading />;
  if (error) return <AdminError error={error} onRetry={() => refetch()} />;
  if (!data) return <AdminError error={new Error("No settings row found.")} />;

  return (
    <div>
      <PageHeader
        title="Site settings"
        description="Contact details, social links and default SEO for the whole site."
        action={
          <Button disabled={mutation.isPending} onClick={() => mutation.mutate(form)}>
            {mutation.isPending ? "Saving…" : "Save settings"}
          </Button>
        }
      />

      <div className="space-y-6">
        {FIELDS.map(([key, label]) => (
          <TextField
            key={key}
            label={label}
            value={form[key] ?? ""}
            onChange={(value) => setForm((prev) => ({ ...prev, [key]: value }))}
          />
        ))}
        <TextAreaField
          label="Default SEO description"
          value={form["default_seo_description"] ?? ""}
          onChange={(value) => setForm((prev) => ({ ...prev, default_seo_description: value }))}
        />
        <ImageUpload
          bucket="site-assets"
          label="Logo"
          value={form["logo"] || null}
          onChange={(value) => setForm((prev) => ({ ...prev, logo: value }))}
        />
        <ImageUpload
          bucket="site-assets"
          label="Default social share image"
          value={form["default_og_image"] || null}
          onChange={(value) => setForm((prev) => ({ ...prev, default_og_image: value }))}
        />
      </div>
    </div>
  );
}