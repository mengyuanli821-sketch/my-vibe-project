import { google } from "googleapis";
import type { ClassNote, NewClassNoteInput, NewStudentInput, Student, StudentWithStats } from "@/types/student";

const STUDENTS_RANGE = "Students!A:J";
const CLASS_NOTES_RANGE = "ClassNotes!A:K";

const STUDENT_COLUMNS = [
  "id",
  "name",
  "contact",
  "age_range",
  "experience_level",
  "goals",
  "body_conditions",
  "injury_notes",
  "teacher_notes",
  "created_at"
] as const;

const CLASS_NOTE_COLUMNS = [
  "id",
  "student_id",
  "student_name",
  "class_date",
  "class_type",
  "today_condition",
  "strengths",
  "issues",
  "follow_up",
  "teacher_note",
  "created_at"
] as const;

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getSheetsClient() {
  const clientEmail = requiredEnv("GOOGLE_CLIENT_EMAIL");
  const privateKey = requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

function getSheetId() {
  return requiredEnv("GOOGLE_SHEET_ID");
}

function stripHeaderRow(rows: string[][], firstColumnName: string) {
  if (rows[0]?.[0]?.toLowerCase() === firstColumnName.toLowerCase()) {
    return rows.slice(1);
  }

  return rows;
}

function cell(row: string[], index: number) {
  return row[index] ?? "";
}

function rowToStudent(row: string[]): Student {
  return {
    id: cell(row, 0),
    name: cell(row, 1),
    contact: cell(row, 2),
    age_range: cell(row, 3),
    experience_level: cell(row, 4),
    goals: cell(row, 5),
    body_conditions: cell(row, 6),
    injury_notes: cell(row, 7),
    teacher_notes: cell(row, 8),
    created_at: cell(row, 9)
  };
}

function rowToClassNote(row: string[]): ClassNote {
  return {
    id: cell(row, 0),
    student_id: cell(row, 1),
    student_name: cell(row, 2),
    class_date: cell(row, 3),
    class_type: cell(row, 4),
    today_condition: cell(row, 5),
    strengths: cell(row, 6),
    issues: cell(row, 7),
    follow_up: cell(row, 8),
    teacher_note: cell(row, 9),
    created_at: cell(row, 10)
  };
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function readRows(range: string) {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range
  });

  return (response.data.values ?? []) as string[][];
}

async function appendRow(range: string, values: string[]) {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: getSheetId(),
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values]
    }
  });
}

export async function getStudents(): Promise<Student[]> {
  const rows = stripHeaderRow(await readRows(STUDENTS_RANGE), STUDENT_COLUMNS[0]);

  return rows.map(rowToStudent).filter((student) => student.id && student.name);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const students = await getStudents();

  return students.find((student) => student.id === id) ?? null;
}

export async function getStudentsWithStats(): Promise<StudentWithStats[]> {
  const [students, classNotes] = await Promise.all([getStudents(), getClassNotes()]);

  return students.map((student) => {
    const notesForStudent = classNotes
      .filter((note) => note.student_id === student.id)
      .sort((a, b) => b.class_date.localeCompare(a.class_date));

    return {
      ...student,
      last_class_date: notesForStudent[0]?.class_date ?? "",
      class_count: notesForStudent.length
    };
  });
}

export async function createStudent(input: NewStudentInput): Promise<Student> {
  const student: Student = {
    id: generateId("student"),
    name: input.name,
    contact: input.contact,
    age_range: input.age_range,
    experience_level: input.experience_level,
    goals: input.goals,
    body_conditions: input.body_conditions,
    injury_notes: input.injury_notes,
    teacher_notes: input.teacher_notes,
    created_at: new Date().toISOString()
  };

  await appendRow(STUDENTS_RANGE, [
    student.id,
    student.name,
    student.contact,
    student.age_range,
    student.experience_level,
    student.goals,
    student.body_conditions,
    student.injury_notes,
    student.teacher_notes,
    student.created_at
  ]);

  return student;
}

export async function getClassNotes(studentId?: string): Promise<ClassNote[]> {
  const rows = stripHeaderRow(await readRows(CLASS_NOTES_RANGE), CLASS_NOTE_COLUMNS[0]);
  const classNotes = rows.map(rowToClassNote).filter((note) => note.id && note.student_id);

  if (!studentId) {
    return classNotes;
  }

  return classNotes
    .filter((note) => note.student_id === studentId)
    .sort((a, b) => b.class_date.localeCompare(a.class_date));
}

export async function createClassNote(input: NewClassNoteInput): Promise<ClassNote> {
  const student = await getStudentById(input.student_id);

  if (!student) {
    throw new Error("Student not found");
  }

  const classNote: ClassNote = {
    id: generateId("note"),
    student_id: input.student_id,
    student_name: student.name,
    class_date: input.class_date,
    class_type: input.class_type,
    today_condition: input.today_condition,
    strengths: input.strengths,
    issues: input.issues,
    follow_up: input.follow_up,
    teacher_note: input.teacher_note,
    created_at: new Date().toISOString()
  };

  await appendRow(CLASS_NOTES_RANGE, [
    classNote.id,
    classNote.student_id,
    classNote.student_name,
    classNote.class_date,
    classNote.class_type,
    classNote.today_condition,
    classNote.strengths,
    classNote.issues,
    classNote.follow_up,
    classNote.teacher_note,
    classNote.created_at
  ]);

  return classNote;
}
