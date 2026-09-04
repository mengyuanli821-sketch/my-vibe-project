import type { NextApiRequest, NextApiResponse } from "next";
import { getSavedSequences, saveSequence } from "@/lib/sequenceStore";
import type { SavedSequence } from "@/lib/sequences";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") return res.status(200).json({ sequences: getSavedSequences() });
    if (req.method === "POST") {
      const sequence = req.body as SavedSequence;
      if (!sequence?.id || !sequence.name?.trim() || !Array.isArray(sequence.items)) return res.status(400).json({ error: "Invalid sequence" });
      return res.status(201).json({ sequence: saveSequence(sequence) });
    }
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) { return res.status(500).json({ error: error instanceof Error ? error.message : "Database error" }); }
}
