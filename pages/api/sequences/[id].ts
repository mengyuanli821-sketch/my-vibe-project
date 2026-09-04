import type { NextApiRequest, NextApiResponse } from "next";
import { deleteSavedSequence, getSavedSequence, saveSequence } from "@/lib/sequenceStore";
import type { SavedSequence } from "@/lib/sequences";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) return res.status(400).json({ error: "Sequence id is required" });
    if (req.method === "GET") {
      const sequence = getSavedSequence(id);
      return sequence ? res.status(200).json({ sequence }) : res.status(404).json({ error: "Sequence not found" });
    }
    if (req.method === "PUT") {
      const sequence = { ...(req.body as SavedSequence), id };
      if (!sequence.name?.trim() || !Array.isArray(sequence.items)) return res.status(400).json({ error: "Invalid sequence" });
      return res.status(200).json({ sequence: saveSequence(sequence) });
    }
    if (req.method === "DELETE") { deleteSavedSequence(id); return res.status(204).end(); }
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return res.status(500).json({ error: error instanceof Error ? error.message : "Database error" }); }
}
