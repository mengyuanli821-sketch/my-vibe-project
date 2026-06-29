export type Student = {
  id: string;
  name: string;
  contact: string;
  age_range: string;
  experience_level: string;
  goals: string;
  body_conditions: string;
  injury_notes: string;
  teacher_notes: string;
  created_at: string;
};

export type StudentWithStats = Student & {
  last_class_date: string;
  class_count: number;
};

export type NewStudentInput = Omit<Student, "id" | "created_at">;

export type ClassNote = {
  id: string;
  student_id: string;
  student_name: string;
  class_date: string;
  class_type: string;
  today_condition: string;
  strengths: string;
  issues: string;
  follow_up: string;
  teacher_note: string;
  created_at: string;
};

export type NewClassNoteInput = Omit<ClassNote, "id" | "student_name" | "created_at">;
