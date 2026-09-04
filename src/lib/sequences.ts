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

export function readShortlist(): SequenceItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = JSON.parse(window.localStorage.getItem(SHORTLIST_KEY) || "[]");
    if (Array.isArray(current) && current.length) return current.filter((item) => item?.poseId && item?.instanceId);
    const legacy = JSON.parse(window.localStorage.getItem("sattva-pose-shortlist") || "[]");
    return Array.isArray(legacy) ? legacy.filter((id) => typeof id === "string").map((id) => makeSequenceItem(id)) : [];
  } catch { return []; }
}
