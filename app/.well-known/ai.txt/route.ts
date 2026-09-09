import { buildAiTxt } from "@/lib/llmsContent";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = buildAiTxt();
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}