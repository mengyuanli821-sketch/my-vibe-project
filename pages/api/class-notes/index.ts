import type { NextApiRequest, NextApiResponse } from "next";
import { createClassNote, getClassNotes } from "@/lib/googleSheets";
import type { NewClassNoteInput } from "@/types/student";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const studentId = Array.isArray(req.query.student_id) ? req.query.student_id[0] : req.query.student_id;
      const classNotes = await getClassNotes(studentId);

      return res.status(200).json({ classNotes });
    }

    if (req.method === "POST") {
      const body = req.body as Partial<NewClassNoteInput>;

      if (!body.student_id?.trim()) {
        return res.status(400).json({ error: "Student is required" });
      }

      if (!body.class_date?.trim()) {
        return res.status(400).json({ error: "Class date is required" });
      }

      const classNote = await createClassNote({
        student_id: body.student_id.trim(),
        class_date: body.class_date.trim(),
        class_type: body.class_type?.trim() ?? "",
        today_condition: body.today_condition?.trim() ?? "",
        strengths: body.strengths?.trim() ?? "",
        issues: body.issues?.trim() ?? "",
        follow_up: body.follow_up?.trim() ?? "",
        teacher_note: body.teacher_note?.trim() ?? "",
        energy_score: body.energy_score?.trim() ?? "3",
        body_comfort_score: body.body_comfort_score?.trim() ?? "3",
        focus_score: body.focus_score?.trim() ?? "3",
        class_time: body.class_time?.trim() ?? ""
      });

      return res.status(201).json({ classNote });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === "Student not found") {
      return res.status(404).json({ error: message });
    }

    return res.status(500).json({ error: message });
  }
}
