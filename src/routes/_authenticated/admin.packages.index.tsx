import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminEmpty, AdminError, AdminLoading } from "@/components/admin/states";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { useAdminDelete, useAdminList } from "@/components/admin/useAdminData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatIDR } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/packages/")({
  component: PackagesAdmin,
});

function PackagesAdmin() {
  const { data, isPending, error, refetch } = useAdminList("packages");
  const remove = useAdminDelete("packages");
  const [search, setSearch] = useState("");

  const rows = (data ?? []).filter((row) =>
    String(row["title"] ?? "")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Curated sailing journeys shown across the site."
        action={
          <Button asChild>
            <Link to="/admin/packages/$id" params={{ id: "new" }}>
              <Plus className="mr-2 h-4 w-4" /> New package
            </Link>
          </Button>
        }
      />

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search packages…"
        className="mb-4 max-w-sm"
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}
      {data && !rows.length ? (
        <AdminEmpty title="No packages yet" hint="Create your first journey to get started." />
      ) : null}

      {rows.length ? (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Duration</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{String(row["title"] ?? "")}</p>
                    <p className="text-xs text-muted-foreground">/{String(row["slug"] ?? "")}</p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {String(row["duration"] ?? "—")}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {formatIDR(row["price"] as number | null) ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={row["is_published"] ? "default" : "secondary"}>
                        {row["is_published"] ? "Published" : "Draft"}
                      </Badge>
                      {row["featured"] ? <Badge variant="outline">Featured</Badge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild aria-label="Edit package">
                        <Link to="/admin/packages/$id" params={{ id: row.id }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDelete
                        description={`This permanently deletes "${String(row["title"] ?? "")}".`}
                        onConfirm={() => remove.mutate(row.id)}
                      >
                        <Button variant="ghost" size="icon" aria-label="Delete package">
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