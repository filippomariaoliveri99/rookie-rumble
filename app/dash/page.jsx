"use client";

import Logo from "@/components/Logo";
import Header from "@/components/Header";
import { useLiveData } from "@/lib/useLiveData";

function LeaderRow({ candidate, rank, isActive, isLast }) {
  const barWidth = candidate.count > 0 ? (candidate.avg / 10) * 100 : 0;
  return (
    <div className={`flex items-stretch ${!isLast ? "border-b border-neutral-200" : ""} ${isActive ? "bg-neutral-100" : "bg-white"}`}>
      <div className={`w-20 flex items-center justify-center text-3xl font-bold tabular-nums border-r border-neutral-200 ${rank === 1 ? "bg-black text-white" : ""}`}>
        {String(rank).padStart(2, "0")}
      </div>
      <div className="flex-1 px-6 py-4 min-w-0">
        <div className="flex items-baseline gap-3 mb-2">
          <div className="text-2xl md:text-3xl font-bold tracking-tight truncate">{candidate.name}</div>
          {isActive && <span className="text-[10px] font-mono uppercase tracking-wider bg-black text-white px-2 py-0.5">In scena</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-neutral-200 overflow-hidden">
            <div className="h-full bg-black barfill" style={{ width: `${barWidth}%` }} />
          </div>
          <div className="text-xs font-mono text-neutral-500 whitespace-nowrap tabular-nums">
            {candidate.count} {candidate.count === 1 ? "voto" : "voti"}
          </div>
        </div>
      </div>
      <div className="w-32 md:w-40 flex flex-col items-center justify-center border-l border-neutral-200 px-3">
        <div className="text-4xl md:text-5xl font-bold tabular-nums leading-none">
          {candidate.count > 0 ? candidate.avg.toFixed(1) : "—"}
        </div>
        <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mt-1">/ 10</div>
      </div>
    </div>
  );
}

export default function DashPage() {
  const { state, votes, loading } = useLiveData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm">Carico…</div>
      </div>
    );
  }

  const ranked = state.candidates
    .map((c) => {
      const candVotes = votes[c.id] || {};
      const scores = Object.values(candVotes);
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return { ...c, avg, count: scores.length };
    })
    .sort((a, b) => b.avg - a.avg);

  const active = state.candidates.find((c) => c.id === state.activeId);
  const activeStats = active ? ranked.find((r) => r.id === active.id) : null;
  const totalVoters = new Set(Object.values(votes).flatMap((v) => Object.keys(v))).size;
  const totalVotes = Object.values(votes).reduce((sum, v) => sum + Object.keys(v).length, 0);

  if (state.candidates.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header logoSize="h-10" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold tracking-tight mb-2">Dashboard</div>
            <div className="text-neutral-500">Nessun candidato ancora. Vai al setup.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-black px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="h-10" />
          <div className="h-6 w-px bg-black" />
          <div className="text-xs font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" /> Live
          </div>
        </div>
        <div className="flex gap-8 text-right">
          <div>
            <div className="text-2xl font-bold tabular-nums">{totalVoters}</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Votanti</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{totalVotes}</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Voti totali</div>
          </div>
          <div>
            <div className="text-2xl font-bold tabular-nums">{state.candidates.length}</div>
            <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Candidati</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-8 max-w-7xl mx-auto w-full">
        {activeStats && (
          <div className="mb-10 bg-black text-white p-8 fadein">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> In scena adesso
            </div>
            <div className="flex items-end justify-between flex-wrap gap-6">
              <div className="text-6xl md:text-7xl font-bold tracking-tight leading-none">{activeStats.name}</div>
              <div className="text-right">
                <div className="text-7xl md:text-8xl font-bold tabular-nums leading-none">
                  {activeStats.count > 0 ? activeStats.avg.toFixed(1) : "—"}
                </div>
                <div className="text-xs font-mono text-neutral-400 mt-2 uppercase tracking-wider">
                  Media · {activeStats.count} {activeStats.count === 1 ? "voto" : "voti"}
                </div>
              </div>
            </div>
            <div className="mt-6 h-2 bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-700"
                style={{ width: `${activeStats.count > 0 ? (activeStats.avg / 10) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        <div className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-3">Classifica</div>
        <div className="border border-black">
          {ranked.map((c, idx) => (
            <LeaderRow key={c.id} candidate={c} rank={idx + 1} isActive={c.id === state.activeId} isLast={idx === ranked.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
