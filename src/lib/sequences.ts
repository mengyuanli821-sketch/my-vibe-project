export type SequenceItem = {
  instanceId: string;
  poseId: string;
  minutes: number;
  phase: string;
  note: string;
};

export type SavedSequence = {
  id: string;
  name: string;
  theme: string;
  duration: number;
  classStyle: string;
  props: string;
  intention: string;
  studentIds: string[];
  items: SequenceItem[];
  memo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export const SHORTLIST_KEY = "sattva-pose-shortlist-v2";
export const DRAFT_KEY = "sattva-class-draft-v2";
export const SAVED_SEQUENCES_KEY = "sattva-saved-sequences";

export function makeSequenceItem(poseId: string, patch: Partial<SequenceItem> = {}): SequenceItem {
  return {
    instanceId: `pose_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    poseId,
    minutes: 3,
    phase: "主要探索",
    note: "",
    ...patch
  };
}

export function readSavedSequences(): SavedSequence[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SAVED_SEQUENCES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function writeSavedSequences(sequences: SavedSequence[]) {
  window.localStorage.setItem(SAVED_SEQUENCES_KEY, JSON.stringify(sequences));
}

async function sequenceRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || "無法存取序列資料庫");
  return response.status === 204 ? null : response.json();
}

export async function fetchSavedSequences(): Promise<SavedSequence[]> {
  const data = await sequenceRequest("/api/sequences");
  return data.sequences ?? [];
}

export async function fetchSavedSequence(id: string): Promise<SavedSequence | null> {
  const response = await fetch(`/api/sequences/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("無法讀取序列");
  return (await response.json()).sequence ?? null;
}

export async function persistSavedSequence(sequence: SavedSequence) {
  const data = await sequenceRequest(`/api/sequences/${encodeURIComponent(sequence.id)}`, {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sequence)
  });
  return data.sequence as SavedSequence;
}

export async function removeSavedSequence(id: string) {
  await sequenceRequest(`/api/sequences/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Imports sequences saved by older versions of the app into SQLite once. */
export async function migrateBrowserSequences(databaseSequences: SavedSequence[]) {
  const local = readSavedSequences();
  const databaseIds = new Set(databaseSequences.map((sequence) => sequence.id));
  const missing = local.filter((sequence) => !databaseIds.has(sequence.id));
  if (!missing.length) return databaseSequences;
  const imported = await Promise.all(missing.map(persistSavedSequence));
  return [...databaseSequences, ...imported].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function readShortlist(): SequenceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = JSON.parse(window.localStorage.getItem(SHORTLIST_KEY) || "[]");
    if (Array.isArray(current) && current.length) return current.filter((item) => item?.poseId && item?.instanceId);
    const legacy = JSON.parse(window.localStorage.getItem("sattva-pose-shortlist") || "[]");
    return Array.isArray(legacy) ? legacy.filter((id) => typeof id === "string").map((id) => makeSequenceItem(id)) : [];
  } catch { return []; }
}
