export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
  if (!client) {
    return new Response("Not found", { status: 404 });
  }
  // `f08c47fec0942fa0` es el ID de certificación de Google: sin él, algunos
  // validadores dan la línea por incompleta.
  return new Response(`google.com, ${client}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
