export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";
  return new Response(`google.com, ${client}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
