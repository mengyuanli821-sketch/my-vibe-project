import type { NextApiRequest, NextApiResponse } from "next";
import { getClassNotes } from "@/lib/googleSheets";
import { buildTeacherAdvice, getTeacherProfile } from "@/lib/teacherProfile";
import { getClassStatus } from "@/lib/classStatus";
import type { TeacherAdvice } from "@/types/teacher";

const TEACHER_ADVICE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "insight", "strengths", "priorities", "nextClassExperiment", "reflectionPrompt"],
  properties: {
    headline: { type: "string" },
    insight: { type: "string" },
    strengths: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } },
    priorities: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "why", "practice"],
        properties: { title: { type: "string" }, why: { type: "string" }, practice: { type: "string" } }
      }
    },
    nextClassExperiment: { type: "string" },
    reflectionPrompt: { type: "string" }
  }
} as const;

function extractText(response: unknown) {
  const output = (response as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }).output ?? [];
  return output.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
}

async function generateTeacherAdvice(context: object): Promise<TeacherAdvice | null> {
  if (!process.env.OPENAI_API_KEY || process.env.ENABLE_AI_RECOMMENDATIONS !== "true") return null;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        store: false,
        input: [
          { role: "developer", content: "Act as a reflective yoga teacher educator, not a medical or mental-health professional. Use the teacher's self-assessment and anonymous class aggregates to identify strengths and one or two high-leverage teaching practices. Be specific, kind, non-judgmental, and observable. Do not infer protected traits or diagnose students. Suggest experiments the teacher can evaluate after one class." },
          { role: "user", content: JSON.stringify(context) }
        ],
        text: { format: { type: "json_schema", name: "teacher_coaching", strict: true, schema: TEACHER_ADVICE_SCHEMA } }
      })
    });
    if (!response.ok) return null;
    const text = extractText(await response.json());
    return text ? JSON.parse(text) as TeacherAdvice : null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const [profile, notes] = await Promise.all([getTeacherProfile(), getClassNotes()]);
    const statusCounts = notes.reduce<Record<string, number>>((counts, note) => {
      const status = getClassStatus(note);
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    }, {});
    const localAdvice = buildTeacherAdvice(profile, notes.length);
    const aiAdvice = await generateTeacherAdvice({ teacherProfile: profile, anonymousTeachingEvidence: { classCount: notes.length, statusCounts } });
    return res.status(200).json({ advice: aiAdvice ?? localAdvice, source: aiAdvice ? "ai" : "adaptive" });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Could not generate teacher advice" });
  }
}
