import { NextResponse } from "next/server";
import { getAlternative } from "@/lib/queries";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const alternativa = getAlternative(slug);
  const destino = alternativa?.afiliado?.url ?? alternativa?.url;

  if (!destino) {
    return new NextResponse("Not found", { status: 404 });
  }

  const url = new URL(destino);
  url.searchParams.set("utm_source", "alternativas_libres");
  url.searchParams.set("utm_medium", "afiliado");
  url.searchParams.set("utm_campaign", slug);

  return NextResponse.redirect(url.toString(), {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
