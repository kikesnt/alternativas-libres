import { JsonLd } from "@/components/json-ld";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold">Preguntas frecuentes</h2>
      <div className="mt-4 divide-y divide-border rounded-lg border border-border">
        {items.map((item) => (
          <details key={item.q} className="group p-5">
            <summary className="cursor-pointer font-medium marker:content-none">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
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
