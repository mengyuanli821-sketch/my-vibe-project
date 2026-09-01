import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { TeacherAdvice, TeacherProfile } from "@/types/teacher";

const TEACHER_PATH = path.join(process.cwd(), ".data", "teacher-profile.json");

export const EMPTY_TEACHER_PROFILE: TeacherProfile = {
  name: "",
  years_experience: "",
  certifications: "",
  primary_styles: "",
  specialties: "",
  teaching_philosophy: "",
  strengths: "",
  growth_edges: "",
  sequencing_score: "3",
  anatomy_score: "3",
  cueing_score: "3",
  observation_score: "3",
  accessibility_score: "3",
  updated_at: ""
};

export async function getTeacherProfile(): Promise<TeacherProfile> {
  try {
    const stored = JSON.parse(await readFile(TEACHER_PATH, "utf8")) as Partial<TeacherProfile>;
    return { ...EMPTY_TEACHER_PROFILE, ...stored };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY_TEACHER_PROFILE };
    throw error;
  }
}

export async function saveTeacherProfile(profile: TeacherProfile) {
  const next = { ...profile, updated_at: new Date().toISOString() };
  await mkdir(path.dirname(TEACHER_PATH), { recursive: true });
  await writeFile(TEACHER_PATH, JSON.stringify(next, null, 2), "utf8");
  return next;
}

const CAPABILITIES = [
  { key: "sequencing_score", label: "Sequencing" },
  { key: "anatomy_score", label: "Anatomy" },
  { key: "cueing_score", label: "Cueing" },
  { key: "observation_score", label: "Observation" },
  { key: "accessibility_score", label: "Inclusive options" }
] as const;

export function buildTeacherAdvice(profile: TeacherProfile, classCount: number): TeacherAdvice {
  const ranked = CAPABILITIES.map((item) => ({ ...item, score: Number(profile[item.key]) || 3 })).sort((a, b) => a.score - b.score);
  const strongest = [...ranked].sort((a, b) => b.score - a.score).slice(0, 2);
  const priorities = ranked.slice(0, 2).map((item) => ({
    title: `Develop ${item.label.toLowerCase()}`,
    why: `${item.label} is currently self-rated ${item.score}/5, making it a useful edge for deliberate practice.`,
    practice: item.key === "cueing_score" ? "Teach one short sequence using one breath cue and one directional cue per shape; remove corrective overload."
      : item.key === "anatomy_score" ? "Choose one joint action before class and note how two different bodies express it without diagnosing either student."
      : item.key === "sequencing_score" ? "Plan backward from one class intention, then give every transition a clear purpose or remove it."
      : item.key === "observation_score" ? "Leave one full breath of silence after each setup and observe breath, face and load distribution before cueing."
      : "Prepare a wall, chair and reduced-range version for the main pattern before students arrive."
  }));

  return {
    headline: profile.name ? `${profile.name}, refine one layer at a time.` : "Refine one layer at a time.",
    insight: classCount ? `Your notebook contains ${classCount} recorded classes. Pair that real teaching evidence with one focused capability experiment each week.` : "Begin with one small teaching experiment, then record what changed for the student and for you.",
    strengths: strongest.map((item) => `${item.label} · ${item.score}/5`),
    priorities,
    nextClassExperiment: priorities[0]?.practice ?? "Observe one class with fewer words and write down what became clearer.",
    reflectionPrompt: `Where did the class feel most alive—and where did I teach from habit rather than observation?${profile.growth_edges ? ` Keep your stated growth edge in view: ${profile.growth_edges}` : ""}`
  };
}
