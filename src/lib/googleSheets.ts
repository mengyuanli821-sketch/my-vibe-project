import { google } from "googleapis";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ClassNote, NewClassNoteInput, NewStudentInput, Student, StudentWithStats } from "@/types/student";
import { getClassStatus } from "@/lib/classStatus";

const STUDENTS_RANGE = "Students!A:J";
const CLASS_NOTES_RANGE = "ClassNotes!A:O";
const LOCAL_DATA_PATH = path.join(process.cwd(), ".data", "student-notebook.json");

type LocalData = {
  students: string[][];
  classNotes: string[][];
};

const EMPTY_LOCAL_DATA: LocalData = {
  students: [],
  classNotes: []
};

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
  "created_at",
  "energy_score",
  "body_comfort_score",
  "focus_score",
  "class_time"
] as const;

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function hasGoogleSheetsConfig() {
  return Boolean(
    process.env.GOOGLE_SHEET_ID &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

async function readLocalData(): Promise<LocalData> {
  try {
    const contents = await readFile(LOCAL_DATA_PATH, "utf8");
    const data = JSON.parse(contents) as Partial<LocalData>;

    return {
      students: Array.isArray(data.students) ? data.students : [],
      classNotes: Array.isArray(data.classNotes) ? data.classNotes : []
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...EMPTY_LOCAL_DATA };
    }

    throw error;
  }
}

function localCollectionForRange(data: LocalData, range: string) {
  return range.startsWith("Students!") ? data.students : data.classNotes;
}

async function appendLocalRow(range: string, values: string[]) {
  const data = await readLocalData();
  localCollectionForRange(data, range).push(values);
  await mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
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
    created_at: cell(row, 10),
    energy_score: cell(row, 11),
    body_comfort_score: cell(row, 12),
    focus_score: cell(row, 13),
    class_time: cell(row, 14)
  };
}

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function classDateTime(note: ClassNote) {
  return `${note.class_date}T${note.class_time || "00:00"}`;
}

async function readRows(range: string) {
  if (!hasGoogleSheetsConfig()) {
    const data = await readLocalData();
    return localCollectionForRange(data, range);
  }

  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range
  });

  return (response.data.values ?? []) as string[][];
}

async function appendRow(range: string, values: string[]) {
  if (!hasGoogleSheetsConfig()) {
    await appendLocalRow(range, values);
    return;
  }

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
      .sort((a, b) => classDateTime(b).localeCompare(classDateTime(a)));

    return {
      ...student,
      last_class_date: notesForStudent[0]?.class_date ?? "",
      last_class_time: notesForStudent[0]?.class_time ?? "",
      last_class_status: getClassStatus(notesForStudent[0]),
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
    .sort((a, b) => classDateTime(b).localeCompare(classDateTime(a)));
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
    created_at: new Date().toISOString(),
    energy_score: input.energy_score,
    body_comfort_score: input.body_comfort_score,
    focus_score: input.focus_score,
    class_time: input.class_time
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
    classNote.created_at,
    classNote.energy_score,
    classNote.body_comfort_score,
    classNote.focus_score,
    classNote.class_time
  ]);

  return classNote;
}
