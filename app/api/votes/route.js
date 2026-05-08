import { storageGet, storageSet, VOTES_KEY } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  const votes = (await storageGet(VOTES_KEY)) || {};
  return Response.json(votes, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

// POST: registra/aggiorna un singolo voto
// Body: { candidateId, voterId, score }
export async function POST(req) {
  const { candidateId, voterId, score } = await req.json();
  if (!candidateId || !voterId || typeof score !== "number" || score < 1 || score > 10) {
    return Response.json({ error: "Invalid vote" }, { status: 400 });
  }
  const votes = (await storageGet(VOTES_KEY)) || {};
  if (!votes[candidateId]) votes[candidateId] = {};
  votes[candidateId][voterId] = score;
  await storageSet(VOTES_KEY, votes);
  return Response.json({ ok: true });
}

// DELETE: azzera tutti i voti
export async function DELETE() {
  await storageSet(VOTES_KEY, {});
  return Response.json({ ok: true });
}
