import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { adminDelete, adminList, adminSave } from "@/lib/services/admin.functions";

export type AdminTable =
  | "packages"
  | "destinations"
  | "articles"
  | "testimonials"
  | "booking_inquiries";

export type AdminRow = Record<string, unknown> & { id: string };

export function useAdminList(table: AdminTable) {
  const list = useServerFn(adminList);
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => (await list({ data: { table } })) as AdminRow[],
  });
}

export function useAdminSave(table: AdminTable, options?: { onSuccess?: (id: string) => void }) {
  const save = useServerFn(adminSave);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: Record<string, unknown>) => save({ data: { table, values } }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Saved");
      options?.onSuccess?.(result.id);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useAdminDelete(table: AdminTable) {
  const remove = useServerFn(adminDelete);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => remove({ data: { table, id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}