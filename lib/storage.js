// Storage layer using Upstash Redis REST API directly (no SDK)
// Uses KV_REST_API_URL and KV_REST_API_TOKEN env vars from Vercel

const REST_URL = process.env.KV_REST_API_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN;

const memStore = new Map();

async function upstashCommand(args) {
  if (!REST_URL || !REST_TOKEN) {
    throw new Error("Upstash env vars not configured");
  }
  const res = await fetch(REST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Upstash error: ${res.status}`);
  }
  const data = await res.json();
  return data.result;
}

export async function storageGet(key) {
  if (REST_URL && REST_TOKEN) {
    try {
      const result = await upstashCommand(["GET", key]);
      if (result === null || result === undefined) return null;
      try {
        return JSON.parse(result);
      } catch {
        return result;
      }
    } catch (e) {
      console.error("storageGet error:", e);
      return memStore.get(key) ?? null;
    }
  }
  return memStore.get(key) ?? null;
}

export async function storageSet(key, value) {
  const serialized = typeof value === "string" ? value : JSON.stringify(value);
  if (REST_URL && REST_TOKEN) {
    try {
      await upstashCommand(["SET", key, serialized]);
      return;
    } catch (e) {
      console.error("storageSet error:", e);
    }
  }
  memStore.set(key, value);
}

export const STATE_KEY = "rumble:state";
export const VOTES_KEY = "rumble:votes";
