“use client”;

import { useState, useEffect, useCallback, useRef } from “react”;

export function useLiveData(intervalMs = 1500) {
const [state, setState] = useState({ candidates: [], activeId: null });
const [votes, setVotes] = useState({});
const [loading, setLoading] = useState(true);
const pauseUntilRef = useRef(0);
const latestActionRef = useRef(0);

const refresh = useCallback(async (force = false) => {
if (!force && Date.now() < pauseUntilRef.current) return;
const requestedAt = Date.now();
try {
const [s, v] = await Promise.all([
fetch(”/api/state”, { cache: “no-store” }).then((r) => r.json()),
fetch(”/api/votes”, { cache: “no-store” }).then((r) => r.json()),
]);
if (requestedAt < latestActionRef.current) return;
setState(s);
setVotes(v);
} catch (e) {
console.error(“refresh failed:”, e);
} finally {
setLoading(false);
}
}, []);

useEffect(() => {
refresh(true);
const id = setInterval(() => refresh(false), intervalMs);
return () => clearInterval(id);
}, [refresh, intervalMs]);

return {
state,
votes,
loading,
refresh: () => refresh(true),
setState,
setVotes,
pauseUntilRef,
latestActionRef,
};
}

export async function saveStateAPI(newState) {
await fetch(”/api/state”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify(newState),
});
}

export async function submitVoteAPI(candidateId, voterId, score) {
await fetch(”/api/votes”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ candidateId, voterId, score }),
});
}

export async function resetVotesAPI() {
await fetch(”/api/votes”, { method: “DELETE” });
}
