export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-border bg-card/60 px-8 py-20 text-center">
      <p className="text-xl font-light text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div role="alert" className="float-card px-8 py-20 text-center">
      <p className="text-2xl font-medium">We couldn&apos;t load this right now.</p>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
