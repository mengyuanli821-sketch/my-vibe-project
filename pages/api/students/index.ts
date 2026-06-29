import type { NextApiRequest, NextApiResponse } from "next";
import { createStudent, getStudentsWithStats } from "@/lib/googleSheets";
import type { NewStudentInput } from "@/types/student";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const students = await getStudentsWithStats();

      return res.status(200).json({ students });
    }

    if (req.method === "POST") {
      const body = req.body as Partial<NewStudentInput>;

      if (!body.name?.trim()) {
        return res.status(400).json({ error: "Student name is required" });
      }

      const student = await createStudent({
        name: body.name.trim(),
        contact: body.contact?.trim() ?? "",
        age_range: body.age_range?.trim() ?? "",
        experience_level: body.experience_level?.trim() ?? "",
        goals: body.goals?.trim() ?? "",
        body_conditions: body.body_conditions?.trim() ?? "",
        injury_notes: body.injury_notes?.trim() ?? "",
        teacher_notes: body.teacher_notes?.trim() ?? ""
      });

      return res.status(201).json({ student });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}
