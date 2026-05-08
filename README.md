# Rookie Rumble — Live Voting

Sistema di voto live in stile Jet HR per il Rookie Rumble. Pubblico vota da telefono via QR, dashboard live proiettata in sala.

## Stack

- Next.js 15 (App Router)
- Vercel KV (Redis) per lo stato condiviso tra dispositivi
- Tailwind CSS

## Deploy su Vercel (10 minuti)

### 1. Carica il progetto su GitHub

```bash
cd rookie-rumble
git init
git add .
git commit -m "init"
```

Crea un repo nuovo su https://github.com/new (può essere privato), poi:

```bash
git remote add origin https://github.com/TUO-USER/rookie-rumble.git
git branch -M main
git push -u origin main
```

### 2. Importa su Vercel

1. Vai su https://vercel.com/new
2. Importa il repo `rookie-rumble`
3. Lascia tutte le impostazioni di default → **Deploy**

In ~2 minuti hai un URL tipo `rookie-rumble-xxx.vercel.app`.

### 3. Aggiungi Vercel KV (storage condiviso)

Senza questo step, ogni dispositivo vede dati diversi. È il pezzo critico.

1. Dal dashboard del progetto su Vercel → tab **Storage**
2. Click **Create Database** → scegli **KV** (Upstash Redis)
3. Nome a piacere, regione `Frankfurt` (più vicina all'Italia)
4. Click **Create** → poi **Connect to Project** → seleziona `rookie-rumble`
5. Vercel iniettera automaticamente le env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)

### 4. Redeploy

Dal dashboard del progetto → tab **Deployments** → sui tre puntini dell'ultimo deploy → **Redeploy**. Serve perché le env vars vengano caricate.

Fatto. L'app è online e funziona su qualsiasi telefono.

## Uso durante l'evento

1. Apri `tuo-url.vercel.app/setup` sul Mac
2. Aggiungi i candidati
3. Apri `tuo-url.vercel.app/dash` sul secondo monitor (proiettore)
4. Mostra il QR code della pagina setup al pubblico — inquadrandolo si apre la pagina di voto
5. Quando un candidato si esibisce, click su **Manda in scena** dal setup
6. Il pubblico vota, la dashboard aggiorna in tempo reale
7. Tra un candidato e l'altro, click su un altro candidato per attivarlo

## Custom domain (opzionale)

Se hai un dominio (es. `rookierumble.it`):
1. Dashboard Vercel → **Settings** → **Domains**
2. Aggiungi il dominio, segui le istruzioni DNS

## Costi

Tutto gratis fino a:
- Vercel: 100GB bandwidth/mese (più che sufficiente)
- Vercel KV: 30k comandi/giorno, 256MB storage (ampiamente sufficiente per un evento)

## Sviluppo locale

```bash
npm install
npm run dev
```

Senza KV configurato, lo storage è in-memoria (i dati si perdono al riavvio del server, ma è ok per testare).

## Struttura progetto

```
app/
├── api/
│   ├── state/route.js    # GET/POST candidati e activeId
│   └── votes/route.js    # GET/POST/DELETE voti
├── setup/page.jsx        # Vista organizzatore
├── vote/page.jsx         # Vista pubblico (mobile)
├── dash/page.jsx         # Dashboard proiettore
└── page.jsx              # Home

components/
├── Header.jsx
├── Logo.jsx
└── QRCode.jsx

lib/
├── storage.js            # Astrazione KV/in-memory
└── useLiveData.js        # Hook polling client-side
```
