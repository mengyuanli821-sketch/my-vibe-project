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
