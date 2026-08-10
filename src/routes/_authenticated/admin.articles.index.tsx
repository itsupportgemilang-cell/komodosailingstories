import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/states";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminDelete, useAdminList } from "@/components/admin/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/articles/")({
  component: ArticlesAdmin,
});

function ArticlesAdmin() {
  const { data, isPending, error, refetch } = useAdminList("articles");
  const remove = useAdminDelete("articles");

  return (
    <div>
      <PageHeader
        title="Journal"
        description="Stories and guides published to the journal."
        action={
          <Button asChild>
            <Link to="/admin/articles/$id" params={{ id: "new" }}>
              <Plus className="mr-2 h-4 w-4" /> New story
            </Link>
          </Button>
        }
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}
      {data && !data.length ? <AdminEmpty title="No stories yet" /> : null}

      {data?.length ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Category</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Published</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{String(row["title"] ?? "")}</p>
                    <p className="text-xs text-muted-foreground">/{String(row["slug"] ?? "")}</p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {String(row["category"] ?? "—")}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {formatDate(row["published_at"] as string | null) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={row["is_published"] ? "default" : "secondary"}>
                      {row["is_published"] ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild aria-label="Edit story">
                        <Link to="/admin/articles/$id" params={{ id: row.id }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDelete
                        description={`This permanently deletes "${String(row["title"] ?? "")}".`}
                        onConfirm={() => remove.mutate(row.id)}
                      >
                        <Button variant="ghost" size="icon" aria-label="Delete story">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ConfirmDelete>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}