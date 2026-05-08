export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  
  const result = {
    hasUrl: !!url,
    hasToken: !!token,
    urlPreview: url ? url.substring(0, 30) + "..." : null,
    tokenPreview: token ? token.substring(0, 10) + "..." : null,
    upstashTest: null,
    error: null,
  };
  
  if (url && token) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["PING"]),
        cache: "no-store",
      });
      result.upstashStatus = res.status;
      result.upstashTest = await res.text();
    } catch (e) {
      result.error = String(e);
    }
  }
  
  return Response.json(result, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
