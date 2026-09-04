import { execute, queryRows } from "@/lib/database";
import type { SavedSequence } from "@/lib/sequences";

type SequenceRow = Record<string, unknown>;

function parseArray<T>(value: unknown): T[] {
  try { const parsed = JSON.parse(String(value ?? "[]")); return Array.isArray(parsed) ? parsed : []; }
  catch { return []; }
}

function toSequence(row: SequenceRow): SavedSequence {
  return {
    id: String(row.id), name: String(row.name), theme: String(row.theme), duration: Number(row.duration),
    classStyle: String(row.class_style), props: String(row.props), intention: String(row.intention),
    studentIds: parseArray<string>(row.student_ids), items: parseArray(row.items), memo: String(row.memo),
    tags: parseArray<string>(row.tags), createdAt: String(row.created_at), updatedAt: String(row.updated_at)
  };
}

export function getSavedSequences() {
  return queryRows("SELECT * FROM saved_sequences ORDER BY updated_at DESC").map(toSequence);
}

export function getSavedSequence(id: string) {
  const row = queryRows("SELECT * FROM saved_sequences WHERE id = ?", [id])[0];
  return row ? toSequence(row) : null;
}

export function saveSequence(sequence: SavedSequence) {
  execute(`INSERT INTO saved_sequences
    (id, name, theme, duration, class_style, props, intention, student_ids, items, memo, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET name=excluded.name, theme=excluded.theme, duration=excluded.duration,
      class_style=excluded.class_style, props=excluded.props, intention=excluded.intention,
      student_ids=excluded.student_ids, items=excluded.items, memo=excluded.memo,
      tags=excluded.tags, updated_at=excluded.updated_at`,
    [sequence.id, sequence.name, sequence.theme, sequence.duration, sequence.classStyle, sequence.props,
      sequence.intention, JSON.stringify(sequence.studentIds), JSON.stringify(sequence.items), sequence.memo,
      JSON.stringify(sequence.tags), sequence.createdAt, sequence.updatedAt]);
  return sequence;
}

export function deleteSavedSequence(id: string) {
  execute("DELETE FROM saved_sequences WHERE id = ?", [id]);
}
