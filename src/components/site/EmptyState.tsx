export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-border px-8 py-20 text-center">
      <p className="font-serif text-2xl text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="border border-border px-8 py-20 text-center">
      <p className="font-serif text-2xl">We couldn&apos;t load this right now.</p>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}