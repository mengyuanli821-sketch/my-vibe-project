import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

type SqlStatement = {
  all: (...values: unknown[]) => unknown[];
  get: (...values: unknown[]) => unknown;
  run: (...values: unknown[]) => unknown;
};

type SqlDatabase = {
  close: () => void;
  exec: (sql: string) => void;
  prepare: (sql: string) => SqlStatement;
};

// Kept behind require so Next 14 does not try to bundle the Node 22 built-in module.
const { DatabaseSync } = require("node:sqlite") as { DatabaseSync: new (filename: string) => SqlDatabase };

const DATA_DIRECTORY = path.join(process.cwd(), ".data");
const DATABASE_PATH = path.join(DATA_DIRECTORY, "sattva.db");
const LEGACY_DATA_PATH = path.join(DATA_DIRECTORY, "student-notebook.json");

let initialized = false;

function openDatabase() {
  mkdirSync(DATA_DIRECTORY, { recursive: true });
  const database = new DatabaseSync(DATABASE_PATH);
  database.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  initialize(database);
  return database;
}

function initialize(database: SqlDatabase) {
  if (initialized) return;
  database.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, contact TEXT NOT NULL DEFAULT '',
      age_range TEXT NOT NULL DEFAULT '', experience_level TEXT NOT NULL DEFAULT '',
      goals TEXT NOT NULL DEFAULT '', body_conditions TEXT NOT NULL DEFAULT '',
      injury_notes TEXT NOT NULL DEFAULT '', teacher_notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS class_notes (
      id TEXT PRIMARY KEY, student_id TEXT NOT NULL, student_name TEXT NOT NULL,
      class_date TEXT NOT NULL, class_type TEXT NOT NULL DEFAULT '',
      today_condition TEXT NOT NULL DEFAULT '', strengths TEXT NOT NULL DEFAULT '',
      issues TEXT NOT NULL DEFAULT '', follow_up TEXT NOT NULL DEFAULT '',
      teacher_note TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL,
      energy_score TEXT NOT NULL DEFAULT '', body_comfort_score TEXT NOT NULL DEFAULT '',
      focus_score TEXT NOT NULL DEFAULT '', class_time TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS class_notes_student_id ON class_notes(student_id);
    CREATE TABLE IF NOT EXISTS saved_sequences (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, theme TEXT NOT NULL DEFAULT '',
      duration INTEGER NOT NULL, class_style TEXT NOT NULL DEFAULT '',
      props TEXT NOT NULL DEFAULT '', intention TEXT NOT NULL DEFAULT '',
      student_ids TEXT NOT NULL DEFAULT '[]', items TEXT NOT NULL DEFAULT '[]',
      memo TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL
    );
  `);
  migrateLegacyJson(database);
  initialized = true;
}

function migrateLegacyJson(database: SqlDatabase) {
  try {
    const legacy = JSON.parse(readFileSync(LEGACY_DATA_PATH, "utf8")) as { students?: string[][]; classNotes?: string[][] };
    const insertStudent = database.prepare("INSERT OR IGNORE INTO students VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    const insertNote = database.prepare("INSERT OR IGNORE INTO class_notes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    database.exec("BEGIN IMMEDIATE");
    try {
      for (const row of legacy.students ?? []) insertStudent.run(...Array.from({ length: 10 }, (_, index) => row[index] ?? ""));
      for (const row of legacy.classNotes ?? []) insertNote.run(...Array.from({ length: 15 }, (_, index) => row[index] ?? ""));
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export function queryRows(sql: string, values: unknown[] = []) {
  const database = openDatabase();
  try { return database.prepare(sql).all(...values) as Record<string, unknown>[]; }
  finally { database.close(); }
}

export function execute(sql: string, values: unknown[] = []) {
  const database = openDatabase();
  try { return database.prepare(sql).run(...values); }
  finally { database.close(); }
}

export { DATABASE_PATH };
