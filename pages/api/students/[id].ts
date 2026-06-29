import type { NextApiRequest, NextApiResponse } from "next";
import { getStudentById } from "@/lib/googleSheets";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

    if (!id) {
      return res.status(400).json({ error: "Student id is required" });
    }

    const student = await getStudentById(id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    return res.status(200).json({ student });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}
