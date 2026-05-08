import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";

function NavRow({ num, title, desc, href }) {
  return (
    <Link
      href={href}
      className="w-full bg-white hover:bg-black hover:text-white transition-colors p-6 flex items-center gap-6 text-left group"
    >
      <div className="text-xs font-mono text-neutral-400 group-hover:text-neutral-500">{num}</div>
      <div className="flex-1">
        <div className="text-2xl font-bold tracking-tight">{title}</div>
        <div className="text-sm text-neutral-600 group-hover:text-neutral-400">{desc}</div>
      </div>
      <ArrowRight className="w-5 h-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-16">
        <div className="mb-12">
          <div className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">
            Sistema di voto · Live
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-4">
            Pubblico esigente.
            <br />
            <span className="text-neutral-400">Voti onesti.</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-xl">
            Da 1 a 10. Senza giri di parole. Una pagina per votare, una dashboard che aggiorna la classifica in tempo reale.
          </p>
        </div>

        <div className="grid gap-px bg-black border border-black">
          <NavRow num="01" title="Setup" desc="Aggiungi i candidati. Scegli chi va in scena." href="/setup" />
          <NavRow num="02" title="Vota" desc="La pagina che vede il pubblico. Condividi via QR." href="/vote" />
          <NavRow num="03" title="Dashboard" desc="Classifica live. Da proiettare in sala." href="/dash" />
        </div>

        <div className="mt-16 border-t border-neutral-200 pt-8 text-sm text-neutral-600 leading-relaxed">
          <span className="font-semibold text-black">Come si usa.</span> Apri Setup, aggiungi i candidati. Apri Dashboard su un secondo schermo. Condividi il link Vota con il pubblico. Quando uno si esibisce, lo attivi dal Setup. Il resto si fa da solo.
        </div>
      </div>
    </div>
  );
}
