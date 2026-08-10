import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/services/admin.functions";
import { PageHeader } from "@/components/admin/AdminShell";
import { AdminError, AdminLoading } from "@/components/admin/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/seo";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: DashboardPage,
});

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-4xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function DashboardPage() {
  const statsFn = useServerFn(adminStats);
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => statsFn(),
  });

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of everything published across the site."
        action={
          <Button asChild>
            <Link to="/admin/packages/$id" params={{ id: "new" }}>
              New package
            </Link>
          </Button>
        }
      />

      {isPending ? <AdminLoading /> : null}
      {error ? <AdminError error={error} onRetry={() => refetch()} /> : null}

      {data ? (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Packages"
              value={data.counts.packages}
              hint={`${data.published.packages} published`}
            />
            <StatCard
              label="Destinations"
              value={data.counts.destinations}
              hint={`${data.published.destinations} published`}
            />
            <StatCard
              label="Journal"
              value={data.counts.articles}
              hint={`${data.published.articles} published`}
            />
            <StatCard
              label="Inquiries"
              value={data.counts.booking_inquiries}
              hint={`${data.newInquiries} new`}
            />
          </div>

          <section className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-serif text-xl">Recent inquiries</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/inquiries">View all</Link>
              </Button>
            </div>
            {data.recentInquiries.length ? (
              <ul className="divide-y">
                {data.recentInquiries.map((inquiry) => (
                  <li key={inquiry.id} className="flex flex-wrap gap-2 px-5 py-4 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{inquiry.name}</p>
                      <p className="truncate text-muted-foreground">
                        {inquiry.email}
                        {inquiry.package_slug ? ` · ${inquiry.package_slug}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
                        {inquiry.status}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatDate(inquiry.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                No inquiries yet.
              </p>
            )}
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" asChild>
              <Link to="/admin/articles/$id" params={{ id: "new" }}>
                Write a journal story
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/destinations/$id" params={{ id: "new" }}>
                Add a destination
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/settings">Edit site settings</Link>
            </Button>
          </section>
        </div>
      ) : null}
    </div>
  );
}