import type { NextApiRequest, NextApiResponse } from "next";
import { getTeacherProfile, saveTeacherProfile } from "@/lib/teacherProfile";
import type { TeacherProfile } from "@/types/teacher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") return res.status(200).json({ profile: await getTeacherProfile() });
    if (req.method === "PUT") {
      const current = await getTeacherProfile();
      const body = req.body as Partial<TeacherProfile>;
      const profile = await saveTeacherProfile({
        ...current,
        ...body,
        name: body.name?.trim() ?? current.name,
        updated_at: current.updated_at
      });
      return res.status(200).json({ profile });
    }
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Could not save teacher profile" });
  }
}
