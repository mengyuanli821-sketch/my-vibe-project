import type { ClassNote, ClassStatus } from "@/types/student";
import { splitSelections } from "@/lib/options";

export function getClassStatus(note?: ClassNote): ClassStatus {
  if (!note) return "unknown";
  const scores = [note.energy_score, note.body_comfort_score, note.focus_score].map(Number).filter((score) => score >= 1 && score <= 5);
  const issues = splitSelections(note.issues).filter((issue) => issue !== "No concern");

  if (!scores.length) return issues.length ? "amber" : "unknown";
  if (Number(note.body_comfort_score) <= 2 || scores.some((score) => score <= 1)) return "red";
  if (issues.length || scores.some((score) => score <= 3)) return "amber";
  return scores.every((score) => score >= 4) ? "green" : "amber";
}

export const CLASS_STATUS_COPY: Record<ClassStatus, { label: string; detail: string }> = {
  red: { label: "Needs care", detail: "Reduce load and check symptoms before continuing." },
  amber: { label: "Observe", detail: "Adapt the plan and monitor the student’s response." },
  green: { label: "Steady", detail: "Current scores support normal progression with awareness." },
  unknown: { label: "Not rated", detail: "Add class scores to see a readiness signal." }
};
