export type TeacherProfile = {
  name: string;
  years_experience: string;
  certifications: string;
  primary_styles: string;
  specialties: string;
  teaching_philosophy: string;
  strengths: string;
  growth_edges: string;
  sequencing_score: string;
  anatomy_score: string;
  cueing_score: string;
  observation_score: string;
  accessibility_score: string;
  updated_at: string;
};

export type TeacherAdvice = {
  headline: string;
  insight: string;
  strengths: string[];
  priorities: Array<{ title: string; why: string; practice: string }>;
  nextClassExperiment: string;
  reflectionPrompt: string;
};

export type ClassPlan = {
  title: string;
  summary: string;
  sequence: Array<{ phase: string; pose: string; time: string; durationMinutes: number; rounds: string; transition: string; purpose: string }>;
  keyPoses: Array<{ pose: string; why: string; setup: string[]; cues: string[]; options: string[] }>;
  studentConsiderations: Array<{ student: string; concern: string; avoid: string; alternatives: string[] }>;
  rationale: string;
  safety: string[];
  cues: string[];
  preparation: string[];
};
