import sitemap from "../sitemap";

export const revalidate = 3600;

export async function GET() {
  try {
    const items = await sitemap();
    const text = items.map((item) => item.url).join("\n");
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    return new Response("https://zw.appristine.co.in/", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
