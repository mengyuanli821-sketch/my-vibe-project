export const BODY_CONDITION_OPTIONS = [
  "Pregnancy",
  "High blood pressure",
  "Low energy",
  "Stress & anxiety"
] as const;

export const CLASS_ISSUE_OPTIONS = [
  "Lower back tension",
  "Knee sensitivity",
  "Shoulder tension",
  "Wrist pressure",
  "Hip tightness",
  "Balance",
  "Breath control",
  "Low energy",
  "Focus",
  "No concern"
] as const;

export function splitSelections(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toggleSelection(currentValue: string, option: string) {
  const selections = splitSelections(currentValue);
  const next = selections.includes(option)
    ? selections.filter((item) => item !== option)
    : [...selections.filter((item) => item !== "No concern"), option];

  return option === "No concern" && !selections.includes(option) ? "No concern" : next.join(", ");
}
