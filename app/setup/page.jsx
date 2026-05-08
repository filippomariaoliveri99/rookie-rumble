“use client”;

import { useState, useEffect } from “react”;
import Link from “next/link”;
import { Plus, Trash2, Copy, Check, RefreshCw, ArrowLeft } from “lucide-react”;
import Header from “@/components/Header”;
import QRCode from “@/components/QRCode”;
import { useLiveData, saveStateAPI, resetVotesAPI } from “@/lib/useLiveData”;

export default function SetupPage() {
const { state, votes, loading, setState, pauseUntilRef, latestActionRef } = useLiveData();
const [newName, setNewName] = useState(””);
const [copied, setCopied] = useState(null);
const [confirming, setConfirming] = useState(null);
const [flash, setFlash] = useState(null);
const [origin, setOrigin] = useState(””);

useEffect(() => {
setOrigin(window.location.origin);
}, []);

const showFlash = (msg) => {
setFlash(msg);
setTimeout(() => setFlash(null), 2000);
};

// Optimistic update: applica subito localmente, poi salva sul server,
// intanto blocca il polling per 3 secondi per evitare overwrite con dati vecchi
const applyMutation = (newState) => {
latestActionRef.current = Date.now();
pauseUntilRef.current = Date.now() + 3000;
setState(newState);
saveStateAPI(newState).catch((e) => console.error(“save failed:”, e));
};

const addCandidate = () => {
const name = newName.trim();
if (!name) return;
applyMutation({
…state,
candidates: […state.candidates, { id: Date.now().toString(36), name }],
});
setNewName(””);
};

const removeCandidate = (id) => {
applyMutation({
…state,
candidates: state.candidates.filter((c) => c.id !== id),
activeId: state.activeId === id ? null : state.activeId,
});
};

const setActive = (id) => {
applyMutation({
…state,
activeId: state.activeId === id ? null : id,
});
};

const copyLink = (path) => {
const url = `${origin}${path}`;
navigator.clipboard.writeText(url);
setCopied(path);
setTimeout(() => setCopied(null), 2000);
};

const handleResetVotes = async () => {
await resetVotesAPI();
setConfirming(null);
showFlash(“Voti azzerati”);
};

const handleResetAll = async () => {
applyMutation({ candidates: [], activeId: null });
await resetVotesAPI();
setConfirming(null);
showFlash(“Reset totale completato”);
};

if (loading) {
return (
<div className="min-h-screen flex items-center justify-center">
<div className="text-sm">Carico…</div>
</div>
);
}

const voteUrl = `${origin}/vote`;
const dashUrl = `${origin}/dash`;

return (
<div className="min-h-screen">
<Header />
<div className="max-w-4xl mx-auto px-6 py-10">
<Link href="/" className="text-sm text-neutral-500 hover:text-black mb-6 inline-flex items-center gap-1">
<ArrowLeft className="w-4 h-4" /> Home
</Link>

```
    <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
      <div>
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">01 · Setup</div>
        <h1 className="text-4xl font-bold tracking-tight">Chi vota chi.</h1>
      </div>
      {confirming === "all" ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-neutral-700">Sicuro? Cancello tutto.</span>
          <button onClick={handleResetAll} className="bg-black text-white px-3 py-1 font-semibold hover:bg-neutral-800">Sì, reset</button>
          <button onClick={() => setConfirming(null)} className="text-neutral-500 hover:text-black px-2">Annulla</button>
        </div>
      ) : (
        <button onClick={() => setConfirming("all")} className="text-sm text-neutral-500 hover:text-black underline underline-offset-4">
          Reset totale
        </button>
      )}
    </div>

    {flash && (
      <div className="mb-6 border border-black bg-black text-white px-4 py-2 text-sm fadein">
        ✓ {flash}
      </div>
    )}

    <div className="border border-black mb-10">
      <div className="px-5 py-3 border-b border-black bg-black text-white text-xs font-medium uppercase tracking-wider">
        Condividi
      </div>
      <div className="grid md:grid-cols-[1fr_auto] gap-0">
        <div className="p-5 space-y-4 md:border-r md:border-black">
          <div>
            <div className="text-xs font-mono text-neutral-500 mb-2">LINK PER IL PUBBLICO</div>
            <div className="flex gap-2">
              <input readOnly value={voteUrl} className="flex-1 border border-neutral-300 px-3 py-2 text-sm font-mono bg-neutral-50" />
              <button onClick={() => copyLink("/vote")} className="px-3 border border-black hover:bg-black hover:text-white transition-colors">
                {copied === "/vote" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs font-mono text-neutral-500 mb-2">LINK DASHBOARD (PROIETTORE)</div>
            <div className="flex gap-2">
              <input readOnly value={dashUrl} className="flex-1 border border-neutral-300 px-3 py-2 text-sm font-mono bg-neutral-50" />
              <button onClick={() => copyLink("/dash")} className="px-3 border border-black hover:bg-black hover:text-white transition-colors">
                {copied === "/dash" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="text-xs text-neutral-600 pt-2">
            Il pubblico inquadra il QR. Tu apri la dashboard sul secondo monitor. Tutti vedono gli stessi numeri.
          </div>
        </div>
        <div className="p-5 flex flex-col items-center justify-center bg-neutral-50">
          <div className="border border-black p-3 bg-white">
            {origin && <QRCode text={voteUrl} size={280} />}
          </div>
          <div className="text-xs font-mono text-neutral-500 mt-3">SCANSIONA →</div>
        </div>
      </div>
    </div>

    <div className="mb-6">
      <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Candidati</div>
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCandidate()}
          placeholder="Nome e cognome"
          className="flex-1 border border-black px-4 py-3 text-base focus:outline-none focus:bg-neutral-50"
        />
        <button onClick={addCandidate} className="px-5 bg-black text-white font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Aggiungi
        </button>
      </div>
    </div>

    <div className="border border-black">
      {state.candidates.length === 0 && (
        <div className="text-center py-16 text-neutral-500 text-sm">
          Ancora vuoto. Aggiungi qualcuno da giudicare.
        </div>
      )}
      {state.candidates.map((c, idx) => {
        const candVotes = votes[c.id] || {};
        const scores = Object.values(candVotes);
        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        const isActive = state.activeId === c.id;
        const isLast = idx === state.candidates.length - 1;

        return (
          <div
            key={c.id}
            className={`flex items-center gap-4 px-5 py-4 ${!isLast ? "border-b border-neutral-200" : ""} ${isActive ? "bg-black text-white" : "bg-white"}`}
          >
            <div className="text-xs font-mono text-neutral-400 w-8">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg truncate">{c.name}</div>
              <div className={`text-xs font-mono ${isActive ? "text-neutral-400" : "text-neutral-500"}`}>
                {scores.length === 0 ? "nessun voto" : `${scores.length} ${scores.length === 1 ? "voto" : "voti"} · media ${avg.toFixed(2)}`}
              </div>
            </div>
            <button
              onClick={() => setActive(c.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isActive ? "bg-white text-black" : "border border-black hover:bg-black hover:text-white"
              }`}
            >
              {isActive ? "● In scena" : "Manda in scena"}
            </button>
            <button onClick={() => removeCandidate(c.id)} className={`p-2 ${isActive ? "text-neutral-400 hover:text-white" : "text-neutral-400 hover:text-black"}`}>
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>

    {state.candidates.length > 0 && (
      <div className="mt-6">
        {confirming === "votes" ? (
          <div className="inline-flex items-center gap-2 text-sm">
            <span className="text-neutral-700">Cancello tutti i voti?</span>
            <button onClick={handleResetVotes} className="bg-black text-white px-3 py-1 font-semibold hover:bg-neutral-800">Sì, azzera</button>
            <button onClick={() => setConfirming(null)} className="text-neutral-500 hover:text-black px-2">Annulla</button>
          </div>
        ) : (
          <button onClick={() => setConfirming("votes")} className="text-sm text-neutral-500 hover:text-black underline underline-offset-4 inline-flex items-center gap-2">
            <RefreshCw className="w-3 h-3" /> Azzera solo i voti
          </button>
        )}
      </div>
    )}
  </div>
</div>
```

);
}
