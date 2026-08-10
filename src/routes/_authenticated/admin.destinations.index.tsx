import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/states";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminDelete, useAdminList } from "@/components/admin/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/destinations/")({
  component: DestinationsAdmin,
});

function DestinationsAdmin() {
  const { data, isPending, error, refetch } = useAdminList("destinations");
  const remove = useAdminDelete("destinations");

  return (
    <div>
      <PageHeader
        title="Destinations"
        description="Islands and anchorages shown in the archipelago section."
        action={
          <Button asChild>
            <Link to="/admin/destinations/$id" params={{ id: "new" }}>
              <Plus className="mr-2 h-4 w-4" /> New destination
            </Link>
          </Button>
        }
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}
      {data && !data.length ? <AdminEmpty title="No destinations yet" /> : null}

      {data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((row) => (
            <div key={row.id} className="overflow-hidden rounded-lg border bg-card">
              {row["featured_image"] ? (
                <img
                  src={String(row["featured_image"])}
                  alt={String(row["name"] ?? "")}
                  loading="lazy"
                  className="h-36 w-full object-cover"
                />
              ) : null}
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{String(row["name"] ?? "")}</p>
                    <p className="text-xs text-muted-foreground">
                      Order {String(row["sort_order"] ?? 0)}
                    </p>
                  </div>
                  <Badge variant={row["is_published"] ? "default" : "secondary"}>
                    {row["is_published"] ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label="Edit destination">
                    <Link to="/admin/destinations/$id" params={{ id: row.id }}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <ConfirmDelete
                    description={`This permanently deletes "${String(row["name"] ?? "")}".`}
                    onConfirm={() => remove.mutate(row.id)}
                  >
                    <Button variant="ghost" size="icon" aria-label="Delete destination">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </ConfirmDelete>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}