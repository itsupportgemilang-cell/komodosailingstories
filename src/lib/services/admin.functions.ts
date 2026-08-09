import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TABLES = [
  "packages",
  "destinations",
  "articles",
  "testimonials",
  "booking_inquiries",
] as const;
type AdminTable = (typeof TABLES)[number];

const tableSchema = z.enum(TABLES);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminRow = Record<string, any>;
const ORDER: Record<AdminTable, { column: string; ascending: boolean }> = {
  packages: { column: "created_at", ascending: false },
  destinations: { column: "sort_order", ascending: true },
  articles: { column: "created_at", ascending: false },
  testimonials: { column: "created_at", ascending: false },
  booking_inquiries: { column: "created_at", ascending: false },
};

export const getAdminProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", context.userId)
      .maybeSingle();
    return { userId: context.userId, profile: data ?? null, isAdmin: data?.role === "admin" };
  });

export const adminList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ table: tableSchema }).parse(data))
  .handler(async ({ data, context }) => {
    const order = ORDER[data.table];
    const { data: rows, error } = await context.supabase
      .from(data.table)
      .select("*")
      .order(order.column, { ascending: order.ascending });
    if (error) throw new Error(error.message);
    return (rows ?? []) as AdminRow[];
  });

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, values: z.record(z.string(), z.unknown()) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const values = { ...data.values } as Record<string, unknown>;
    const id = typeof values["id"] === "string" ? (values["id"] as string) : null;
    delete values["created_at"];
    delete values["updated_at"];

    if (id) {
      delete values["id"];
      const { error } = await context.supabase
        .from(data.table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update(values as any)
        .eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }

    delete values["id"];
    const { data: inserted, error } = await context.supabase
      .from(data.table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(values as any)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: (inserted as { id: string }).id };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const counts = await Promise.all(
      TABLES.map(async (table) => {
        const { count } = await context.supabase
          .from(table)
          .select("id", { count: "exact", head: true });
        return [table, count ?? 0] as const;
      }),
    );
    const { data: recent } = await context.supabase
      .from("booking_inquiries")
      .select("id, name, email, package_slug, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    return {
      counts: Object.fromEntries(counts) as Record<AdminTable, number>,
      recentInquiries: (recent ?? []) as Array<{
        id: string;
        name: string;
        email: string;
        package_slug: string | null;
        status: string;
        created_at: string;
      }>,
    };
  });

export const adminUpdateInquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "closed"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("booking_inquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data as AdminRow | null;
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.record(z.string(), z.unknown()).parse(data))
  .handler(async ({ data, context }) => {
    const values = { ...data } as Record<string, unknown>;
    const id = typeof values["id"] === "string" ? (values["id"] as string) : null;
    delete values["id"];
    delete values["updated_at"];
    if (!id) throw new Error("Missing settings id");
    const { error } = await context.supabase
      .from("site_settings")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update(values as any)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });