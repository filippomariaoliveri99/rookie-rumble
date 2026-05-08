"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useLiveData, submitVoteAPI } from "@/lib/useLiveData";

function VoteBtn({ n, myVote, onClick }) {
  const selected = myVote === n;
  return (
    <button
      onClick={onClick}
      className={`aspect-square border border-black text-2xl font-bold transition-all active:scale-95 ${
        selected ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
      }`}
    >
      {n}
    </button>
  );
}

export default function VotePage() {
  const { state, votes, loading, refresh } = useLiveData();
  const [voterId, setVoterId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let id = localStorage.getItem("rumble-voter");
    if (!id) {
      id = Math.random().toString(36).slice(2, 10);
      localStorage.setItem("rumble-voter", id);
    }
    setVoterId(id);
  }, []);

  const active = state.candidates.find((c) => c.id === state.activeId);
  const myVote = active && voterId ? votes[active.id]?.[voterId] : null;

  const vote = async (score) => {
    if (!active || !voterId) return;
    setSubmitting(true);
    try {
      await submitVoteAPI(active.id, voterId, score);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !voterId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm">Carico…</div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="text-xs font-mono text-neutral-500 mb-4 uppercase tracking-wider">In attesa</div>
            <div className="text-3xl font-bold tracking-tight mb-3">Nessuno in scena.</div>
            <div className="text-neutral-600 text-sm">La pagina si aggiorna da sola. Tieniti pronto.</div>
            <div className="mt-6 flex justify-center">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
        <div className="text-center mb-10 mt-4">
          <div className="text-xs font-mono text-neutral-500 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" /> Vota ora
          </div>
          <div className="text-4xl font-bold tracking-tight leading-tight">{active.name}</div>
          {myVote != null ? (
            <div className="mt-4 inline-block border border-black px-3 py-1 text-xs font-mono">
              Hai dato {myVote}/10 — puoi cambiare idea
            </div>
          ) : (
            <div className="mt-4 text-sm text-neutral-600">Da 1 (disastro) a 10 (capolavoro).</div>
          )}
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full">
            <div className="grid grid-cols-5 gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <VoteBtn key={n} n={n} myVote={myVote} onClick={() => !submitting && vote(n)} />
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {[6, 7, 8, 9, 10].map((n) => (
                <VoteBtn key={n} n={n} myVote={myVote} onClick={() => !submitting && vote(n)} />
              ))}
            </div>
            <div className="flex justify-between text-xs font-mono text-neutral-500 mt-3 px-1">
              <span>1 · scarso</span>
              <span>eccellente · 10</span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-neutral-400">
          Un voto a testa, per favore. Non barare, ti vediamo.
        </div>
      </div>
    </div>
  );
}
