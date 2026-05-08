// Storage abstraction: Vercel KV in produzione, in-memory fallback in dev
// Per usare Vercel KV: crea un KV database dal dashboard Vercel e collegalo al progetto.
// Le env vars KV_REST_API_URL e KV_REST_API_TOKEN vengono iniettate automaticamente.

let kv = null;
let useMemory = false;

async function getKV() {
  if (kv || useMemory) return kv;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const mod = await import("@vercel/kv");
      kv = mod.kv;
      return kv;
    } catch (e) {
      console.warn("Vercel KV non disponibile, uso memoria locale:", e.message);
      useMemory = true;
    }
  } else {
    useMemory = true;
  }
  return null;
}

// In-memory fallback (utile per dev locale senza KV)
const memStore = new Map();

export async function storageGet(key) {
  const k = await getKV();
  if (k) {
    return await k.get(key);
  }
  return memStore.get(key) ?? null;
}

export async function storageSet(key, value) {
  const k = await getKV();
  if (k) {
    await k.set(key, value);
    return;
  }
  memStore.set(key, value);
}

export const STATE_KEY = "rumble:state";
export const VOTES_KEY = "rumble:votes";
