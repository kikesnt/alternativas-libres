import { JsonLd } from "@/components/json-ld";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
        {items.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium marker:content-none hover:bg-panel/60">
              <span>{item.q}</span>
              <span
                aria-hidden="true"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition-transform duration-200 group-open:rotate-45"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </span>
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
              {item.a}
            </p>
          </details>
        ))}
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </section>
  );
}
