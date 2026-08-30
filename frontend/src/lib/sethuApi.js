import { VOLUNTEER_FIXTURES } from "@/data/volunteers";

const API_BASE = process.env.REACT_APP_SETHU_API_URL || "http://localhost:8000";

async function tryFetch(path, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function isValidPayload(data) {
  const list = Array.isArray(data) ? data : data?.volunteers;
  return (
    Array.isArray(list) &&
    list.length > 0 &&
    list.every((v) => v.id && Array.isArray(v.criteria))
  );
}

export async function fetchVolunteers() {
  for (const path of ["/api/volunteers", "/volunteers"]) {
    try {
      const data = await tryFetch(path);
      if (isValidPayload(data)) {
        const list = Array.isArray(data) ? data : data.volunteers;
        return { volunteers: list, source: `${API_BASE}${path}` };
      }
    } catch {
      // fall through to next endpoint / fixtures
    }
  }
  return { volunteers: VOLUNTEER_FIXTURES, source: "fixtures (backend unreachable)" };
}

export async function postRescreen() {
  for (const path of ["/api/re-screen", "/re-screen"]) {
    try {
      await tryFetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      return true;
    } catch {
      // simulated mode
    }
  }
  return false;
}

const INJECTION_PATTERNS = [
  /ignore (all |any )?(previous|prior|above) instructions/i,
  /disregard (all |any )?(previous|prior|above)/i,
  /system prompt/i,
  /new instructions?:/i,
  /you are (now )?an? /i,
  /do not follow/i,
  /mark this (volunteer|patient|record) as (eligible|approved|accepted)/i,
];

export function scanForInjection(volunteers) {
  const hits = [];
  for (const v of volunteers) {
    const text = `${v.recordText || ""} ${(v.criteria || [])
      .map((c) => `${c.reasoning || ""} ${c.source || ""}`)
      .join(" ")}`;
    const matched = INJECTION_PATTERNS.find((p) => p.test(text));
    if (matched) hits.push({ volunteerId: v.id, name: v.name, pattern: matched.source });
  }
  return hits;
}
