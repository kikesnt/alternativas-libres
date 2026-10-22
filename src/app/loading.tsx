export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-8 w-2/3 animate-pulse rounded bg-panel" />
      <div className="mt-4 h-4 w-full animate-pulse rounded bg-panel" />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-panel" />
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-lg border border-border bg-panel"
          />
        ))}
      </div>
    </div>
  );
}
