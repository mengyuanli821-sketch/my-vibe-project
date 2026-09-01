import type { NextApiRequest, NextApiResponse } from "next";
import { getClassNotes, getStudentById } from "@/lib/googleSheets";
import { analyzeIssueProgress, buildPracticeGuide, type PracticeGuide } from "@/lib/suggestions";

const PRACTICE_GUIDE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "intention", "sequence", "anatomy", "safety", "cues"],
  properties: {
    title: { type: "string" },
    intention: { type: "string" },
    sequence: {
      type: "array",
      minItems: 4,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["pose", "time", "purpose"],
        properties: {
          pose: { type: "string" },
          time: { type: "string" },
          purpose: { type: "string" }
        }
      }
    },
    anatomy: { type: "string" },
    safety: { type: "array", minItems: 2, maxItems: 5, items: { type: "string" } },
    cues: { type: "array", minItems: 2, maxItems: 5, items: { type: "string" } }
  }
} as const;

function outputText(response: unknown) {
  const output = (response as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }).output ?? [];
  return output.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
}

async function generateWithAI(context: object): Promise<PracticeGuide | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || process.env.ENABLE_AI_RECOMMENDATIONS !== "true") return null;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        store: false,
        input: [
          {
            role: "developer",
            content: "Create a current, conservative yoga class plan for a qualified teacher. Use the complete chronological record and the supplied issue-status analysis. Resolved issues must not remain the main class theme, though standing profile conditions still require suitable modifications. Never diagnose, promise treatment, or recommend working through pain. Include accessible alternatives, observable safety boundaries, concise invitational cues, and a balanced sequence."
          },
          { role: "user", content: JSON.stringify(context) }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "adaptive_yoga_practice_guide",
            strict: true,
            schema: PRACTICE_GUIDE_SCHEMA
          }
        }
      })
    });

    if (!response.ok) return null;
    const text = outputText(await response.json());
    return text ? JSON.parse(text) as PracticeGuide : null;
  } catch {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const studentId = Array.isArray(req.query.student_id) ? req.query.student_id[0] : req.query.student_id;
  if (!studentId) return res.status(400).json({ error: "Student id is required" });

  try {
    const [student, classNotes] = await Promise.all([getStudentById(studentId), getClassNotes(studentId)]);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const issueProgress = analyzeIssueProgress(classNotes);
    const localGuide = buildPracticeGuide(student, classNotes);
    const aiGuide = await generateWithAI({
      studentProfile: {
        age_range: student.age_range,
        experience_level: student.experience_level,
        goals: student.goals,
        body_conditions: student.body_conditions,
        injury_notes: student.injury_notes,
        teacher_notes: student.teacher_notes
      },
      issueProgress,
      completeClassHistory: classNotes.map((note) => ({
        date: note.class_date,
        time: note.class_time,
        class_type: note.class_type,
        energy_score: note.energy_score,
        body_comfort_score: note.body_comfort_score,
        focus_score: note.focus_score,
        issues: note.issues,
        highlight: note.strengths,
        teacher_reflection: note.teacher_note || note.follow_up
      })),
      safeLocalBaseline: localGuide
    });

    return res.status(200).json({
      practiceGuide: aiGuide ?? localGuide,
      issueProgress,
      source: aiGuide ? "ai" : "adaptive",
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : "Could not generate recommendations" });
  }
}
