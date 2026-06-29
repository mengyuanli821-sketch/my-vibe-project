import type { ClassNote, Student } from "@/types/student";

function hasAny(text: string, words: string[]) {
  const normalized = text.toLowerCase();

  return words.some((word) => normalized.includes(word));
}

export function buildNextClassSuggestions(student: Student, classNotes: ClassNote[]) {
  const suggestions: string[] = [];
  const bodyNotes = `${student.body_conditions} ${student.injury_notes}`.trim();
  const bodyNotesLower = bodyNotes.toLowerCase();
  const recentNotes = [...classNotes].sort((a, b) => b.class_date.localeCompare(a.class_date)).slice(0, 3);
  const recentIssues = recentNotes.map((note) => note.issues).filter(Boolean);
  const recentFollowUps = recentNotes.map((note) => note.follow_up).filter(Boolean);

  if (bodyNotes) {
    suggestions.push(`Start with a short check-in about: ${bodyNotes}.`);
  }

  if (hasAny(bodyNotesLower, ["back", "spine", "lower back", "腰"])) {
    suggestions.push("Use a slower warm-up and offer neutral-spine options.");
  }

  if (hasAny(bodyNotesLower, ["knee", "膝"])) {
    suggestions.push("Offer low-impact choices and avoid deep knee flexion unless the student feels ready.");
  }

  if (hasAny(bodyNotesLower, ["shoulder", "neck", "肩", "頸"])) {
    suggestions.push("Watch shoulder and neck tension during weight-bearing or overhead movements.");
  }

  if (recentIssues.length > 0) {
    suggestions.push(`Review recent issues: ${recentIssues.join("; ")}.`);
  }

  if (recentFollowUps.length > 0) {
    suggestions.push(`Follow up on: ${recentFollowUps.join("; ")}.`);
  }

  if (suggestions.length === 0) {
    suggestions.push("Begin with a brief condition check, then build from the student's current goals and energy level.");
  }

  return suggestions;
}
