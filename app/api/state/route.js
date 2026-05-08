import { storageGet, storageSet, STATE_KEY } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = (await storageGet(STATE_KEY)) || { candidates: [], activeId: null };
  return Response.json(state, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(req) {
  const body = await req.json();
  if (!body || !Array.isArray(body.candidates)) {
    return Response.json({ error: "Invalid state" }, { status: 400 });
  }
  const next = {
    candidates: body.candidates,
    activeId: body.activeId || null,
  };
  await storageSet(STATE_KEY, next);
  return Response.json(next);
}
