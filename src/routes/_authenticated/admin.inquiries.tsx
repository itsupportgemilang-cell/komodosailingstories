import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminUpdateInquiryStatus } from "@/lib/services/admin.functions";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/states";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminDelete, useAdminList } from "@/components/admin/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/inquiries")({
  component: InquiriesAdmin,
});

const STATUSES = ["new", "contacted", "confirmed", "cancelled"] as const;

function InquiriesAdmin() {
  const { data, isPending, error, refetch } = useAdminList("booking_inquiries");
  const remove = useAdminDelete("booking_inquiries");
  const queryClient = useQueryClient();
  const updateStatus = useServerFn(adminUpdateInquiryStatus);
  const [filter, setFilter] = useState<string>("all");

  const mutation = useMutation({
    mutationFn: (input: { id: string; status: (typeof STATUSES)[number] }) =>
      updateStatus({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Status updated");
    },
    onError: (mutationError: Error) => toast.error(mutationError.message),
  });

  const rows = (data ?? []).filter(
    (row) => filter === "all" || String(row["status"]) === filter,
  );

  return (
    <div>
      <PageHeader
        title="Booking inquiries"
        description="Every enquiry submitted through the website."
        action={
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}
      {data && !rows.length ? <AdminEmpty title="No inquiries here" /> : null}

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium">{String(row["name"] ?? "")}</p>
                <p className="text-sm text-muted-foreground">
                  <a href={`mailto:${String(row["email"] ?? "")}`} className="hover:underline">
                    {String(row["email"] ?? "")}
                  </a>
                  {row["whatsapp"] ? ` · ${String(row["whatsapp"])}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={row["status"] === "new" ? "default" : "secondary"}>
                  {String(row["status"] ?? "new")}
                </Badge>
                <Select
                  value={String(row["status"] ?? "new")}
                  onValueChange={(value) =>
                    mutation.mutate({
                      id: row.id,
                      status: value as (typeof STATUSES)[number],
                    })
                  }
                >
                  <SelectTrigger className="w-36" aria-label="Change status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ConfirmDelete
                  description="This permanently deletes this inquiry."
                  onConfirm={() => remove.mutate(row.id)}
                >
                  <Button variant="ghost" size="icon" aria-label="Delete inquiry">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ConfirmDelete>
              </div>
            </div>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground">Guests</dt>
                <dd>{String(row["guests"] ?? "—")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Preferred date</dt>
                <dd>{formatDate(row["preferred_date"] as string | null) || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Package</dt>
                <dd>{String(row["package_slug"] ?? "—")}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Received</dt>
                <dd>{formatDate(row["created_at"] as string | null)}</dd>
              </div>
            </dl>
            {row["message"] ? (
              <p className="mt-4 border-t pt-4 text-sm text-muted-foreground">
                {String(row["message"])}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}