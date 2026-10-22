import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/site";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Inicio", href: "/" }, ...items];

  return (
    <>
      <nav aria-label="Miga de pan" className="mb-4 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 ? <span aria-hidden="true">/</span> : null}
              {i === all.length - 1 ? (
                <span className="text-fg">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-fg">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${site.url}${item.href}`,
          })),
        }}
      />
    </>
  );
}
