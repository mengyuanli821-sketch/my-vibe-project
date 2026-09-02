import type { NextApiRequest, NextApiResponse } from "next";
import { getClassNotes, getStudentById, getStudents } from "@/lib/googleSheets";
import { analyzeIssueProgress, buildPracticeGuide } from "@/lib/suggestions";
import type { ClassPlan } from "@/types/teacher";
import type { Student } from "@/types/student";

const CLASS_PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "sequence", "keyPoses", "studentConsiderations", "rationale", "safety", "cues", "preparation"],
  properties: {
    title: { type: "string" }, summary: { type: "string" }, rationale: { type: "string" },
    sequence: { type: "array", minItems: 12, maxItems: 18, items: { type: "object", additionalProperties: false, required: ["phase", "pose", "time", "durationMinutes", "rounds", "transition", "purpose"], properties: { phase: { type: "string" }, pose: { type: "string" }, time: { type: "string" }, durationMinutes: { type: "integer", minimum: 1 }, rounds: { type: "string" }, transition: { type: "string" }, purpose: { type: "string" } } } },
    keyPoses: { type: "array", minItems: 1, maxItems: 2, items: { type: "object", additionalProperties: false, required: ["pose", "why", "setup", "cues", "options"], properties: { pose: { type: "string" }, why: { type: "string" }, setup: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } }, cues: { type: "array", minItems: 2, maxItems: 4, items: { type: "string" } }, options: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } } } } },
    studentConsiderations: { type: "array", maxItems: 8, items: { type: "object", additionalProperties: false, required: ["student", "concern", "avoid", "alternatives"], properties: { student: { type: "string" }, concern: { type: "string" }, avoid: { type: "string" }, alternatives: { type: "array", minItems: 1, maxItems: 3, items: { type: "string" } } } } },
    safety: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } },
    cues: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } },
    preparation: { type: "array", minItems: 2, maxItems: 6, items: { type: "string" } }
  }
} as const;

type PlanningInput = { student_id?: string; student_ids?: string[]; theme?: string; difficulty?: number; duration?: number; new_students?: number; props?: string; intention?: string };

function extractText(response: unknown) {
  const output = (response as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }).output ?? [];
  return output.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
}

function localPlan(students: NonNullable<Awaited<ReturnType<typeof getStudentById>>>[], notes: Awaited<ReturnType<typeof getClassNotes>>, input: PlanningInput): ClassPlan {
  const student = students[0];
  const baseline = buildPracticeGuide(student, notes);
  const difficulty = Math.min(5, Math.max(1, Number(input.difficulty) || 3));
  const beginnerFriendly = (input.new_students ?? 0) > 0 || difficulty <= 2;
  const duration = [30, 45, 60, 75, 90].includes(Number(input.duration)) ? Number(input.duration) : 60;
  const themeText = `${input.theme || ""} ${input.intention || ""}`.toLowerCase();
  const hipFocus = /hip|hips|pelvis|髖|開髖/.test(themeText);
  const shoulderFocus = /shoulder|neck|upper back|肩|頸/.test(themeText);
  const allHistoryText = `${students.map((item) => `${item.body_conditions} ${item.injury_notes} ${item.teacher_notes}`).join(" ")} ${notes.map((note) => `${note.issues} ${note.strengths} ${note.teacher_note} ${note.follow_up}`).join(" ")}`.toLowerCase();
  const wristSensitive = /wrist|hand pain|hand strength|手腕|腕痛|手部力量/.test(allHistoryText);
  const themedMiddle = hipFocus
    ? [
        { pose: "Low Lunge", purpose: "Mobilize the front hip with a steady pelvis" },
        { pose: "Warrior II", purpose: "Build leg strength through an open-hip stance" },
        { pose: "Side Angle", purpose: "Connect hip opening with lateral breath" },
        { pose: "Wide-Legged Fold", purpose: "Explore active inner-leg length" },
        { pose: "Figure Four", purpose: "Offer a supported outer-hip focus" }
      ]
    : shoulderFocus
      ? [
          { pose: "Wall Puppy", purpose: "Explore overhead range without loading the wrists" },
          { pose: "Low Lunge with Cactus Arms", purpose: "Link chest space to lower-body support" },
          { pose: "Warrior II", purpose: "Build shoulder endurance with soft hands" },
          { pose: "Sphinx", purpose: "Strengthen the upper back with forearm support" },
          { pose: "Thread the Needle", purpose: "Rotate through the upper spine gently" }
        ]
      : [
          { pose: "Low Lunge", purpose: "Open the front body before standing work" },
          { pose: "Warrior II", purpose: "Build grounded leg strength" },
          { pose: "Side Angle", purpose: "Integrate legs, hips and lateral breath" },
          { pose: "Supported Tree", purpose: "Practice focused, accessible balance" },
          { pose: "Bridge", purpose: "Strengthen the posterior body" }
        ];
  const poseArc = [
    { phase: "Arrival", pose: "Constructive Rest + Breath", rounds: "8–10 breaths", transition: "Draw knees in, then place feet down.", purpose: "Arrive, check symptoms and establish smooth breathing" },
    { phase: "Arrival", pose: "Pelvic Clock + Knee Sways", rounds: "6 each direction", transition: "Hug knees and roll to one side.", purpose: "Introduce low-load movement through hips and lumbar spine" },
    { phase: "Warm-up", pose: wristSensitive ? "Seated Cat–Cow" : "Cat–Cow", rounds: "6–8 breath cycles", transition: wristSensitive ? "Come to standing with chair support." : "Return to neutral tabletop.", purpose: "Coordinate breath with comfortable spinal movement" },
    { phase: "Warm-up", pose: wristSensitive ? "Standing Cross-Crawl" : "Bird Dog", rounds: "5 per side", transition: wristSensitive ? "Face the wall for the next wave." : "Step hands forward and tuck toes.", purpose: "Build cross-body support before larger standing patterns" },
    { phase: "Heat", pose: wristSensitive ? "Wall Half Sun Salutation" : "Half Sun Salutation", rounds: "3 progressive rounds", transition: "Finish in Mountain Pose.", purpose: "Rehearse hinge, reach and breath rhythm before the main flow" },
    { phase: "Heat", pose: "Chair → Mountain Wave", rounds: "4 breath-led rounds", transition: "Step the right foot back on an exhale.", purpose: "Warm legs while preserving a clear breath cadence" },
    { phase: "Standing flow", pose: `${wristSensitive ? "Chair-Supported " : ""}Low Lunge → Half Split · right`, rounds: "2 slow rounds", transition: "Rebend the front knee and rise to Warrior II.", purpose: themedMiddle[0].purpose },
    { phase: "Standing flow", pose: "Warrior II → Side Angle · right", rounds: "2 rounds, then 3 breaths", transition: "Windmill up, step forward and reset in Mountain.", purpose: themedMiddle[1].purpose },
    { phase: "Standing flow", pose: `${wristSensitive ? "Chair-Supported " : ""}Low Lunge → Half Split · left`, rounds: "2 slow rounds", transition: "Rebend the front knee and rise to Warrior II.", purpose: themedMiddle[0].purpose },
    { phase: "Standing flow", pose: "Warrior II → Side Angle · left", rounds: "2 rounds, then 3 breaths", transition: "Windmill up, step forward and reset in Mountain.", purpose: themedMiddle[1].purpose },
    { phase: "Peak preparation", pose: hipFocus ? "Wide-Legged Fold → Half Lift" : shoulderFocus ? "Wall Puppy → Cactus Arms" : "Wide-Legged Fold → Half Lift", rounds: "3 moving rounds + short hold", transition: "Heel-toe feet inward and turn to the front.", purpose: themedMiddle[2].purpose },
    { phase: "Peak preparation", pose: hipFocus ? "Supported Figure Four" : shoulderFocus ? "Supported Sphinx" : "Supported Tree", rounds: "5 breaths per side", transition: "Return to a neutral standing or prone position.", purpose: themedMiddle[3].purpose },
    { phase: "Integration", pose: "Bridge Wave", rounds: "5 moving + 1 held", transition: "Lower one vertebra at a time and draw knees in.", purpose: "Integrate leg, hip and posterior-body strength without wrist loading" },
    { phase: "Cool-down", pose: "Reclined Figure Four", rounds: "5–8 breaths per side", transition: "Uncross legs and bring knees together.", purpose: "Revisit the hip focus with full floor support" },
    { phase: "Cool-down", pose: "Supine Twist", rounds: "5 breaths per side", transition: "Return through center and extend both legs.", purpose: "Release effort and restore easy rotation" },
    { phase: "Rest", pose: "Savasana", rounds: "Stillness", transition: "Roll to one side before returning to a seat.", purpose: "Rest and integrate the full practice" }
  ];
  const weights = poseArc.map((step, index) => step.phase === "Standing flow" ? 1.5 : index === poseArc.length - 1 ? 2.5 : index === 0 ? 1.3 : 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const minutes = weights.map((weight) => Math.max(1, Math.floor(duration * weight / totalWeight)));
  let remainder = duration - minutes.reduce((sum, value) => sum + value, 0);
  for (let index = minutes.length - 1; remainder > 0; index = (index - 1 + minutes.length) % minutes.length) { minutes[index] += 1; remainder -= 1; }
  const sequence = poseArc.map((step, index) => ({
    ...step,
    durationMinutes: minutes[index],
    time: `${minutes[index]} min`,
    purpose: beginnerFriendly ? `${step.purpose}; demonstrate first and keep a simpler option visible` : step.purpose
  }));
  const progress = analyzeIssueProgress(notes);
  const resolved = progress.filter((item) => item.status === "resolved").map((item) => item.issue);
  const theme = input.theme?.trim();
  return {
    title: theme || baseline.title,
    summary: `${duration}-minute ${theme || "whole-person"} class at difficulty ${difficulty}/5 for ${students.map((item) => item.name).join(", ")}. Its ${sequence.length} connected teaching blocks include repeated bilateral flows and are timed to exactly ${duration} minutes.`,
    sequence,
    keyPoses: themedMiddle.slice(1, 3).map((step) => ({
      pose: step.pose,
      why: `${step.purpose}. This is a central expression of today’s ${theme || "balanced-practice"} focus.`,
      setup: ["Build the foundation first and enter in stages.", "Pause at a range where the breath remains even.", "Hold for the planned time, then exit with control."],
      cues: baseline.cues.slice(0, 3),
      options: beginnerFriendly ? ["Reduce the range and use a wall, chair or blocks.", "Skip the hold and repeat a smaller movement."] : ["Use a support to prioritize steadiness over depth."]
    })),
    studentConsiderations: students.flatMap((item) => {
      const studentNotes = notes.filter((note) => note.student_id === item.id).map((note) => `${note.issues} ${note.strengths} ${note.teacher_note} ${note.follow_up}`).join(" ");
      const context = `${item.body_conditions} ${item.injury_notes} ${item.teacher_notes} ${studentNotes}`.toLowerCase();
      const considerations: ClassPlan["studentConsiderations"] = [];
      if (/wrist|hand pain|hand strength|手腕|腕痛|手部力量/.test(context)) considerations.push({ student: item.name, concern: "Wrist / hand loading", avoid: "Long palm-loaded holds, repeated plank or Chaturanga, and forcing Downward Dog.", alternatives: ["Wall Half Sun Salutation", "Chair-supported standing work with neutral wrists", "Standing Cross-Crawl instead of Bird Dog"] });
      if (/knee|膝/.test(context)) considerations.push({ student: item.name, concern: "Knee sensitivity", avoid: "Deep knee flexion, long kneeling without padding, and a stance that loses knee tracking.", alternatives: ["Shorter stance with chair support", "Blanket under the back knee", "Smaller bend or standing version"] });
      if (/shoulder|neck|肩|頸/.test(context)) considerations.push({ student: item.name, concern: "Shoulder / neck tension", avoid: "Forcing overhead range or holding arms up after the neck begins to brace.", alternatives: ["Hands at hips", "Cactus arms below shoulder height", "Wall-supported shoulder mobility"] });
      return considerations;
    }),
    rationale: `${baseline.intention}${resolved.length ? ` Previously noted ${resolved.join(", ")} is marked resolved, so it is not the main load today.` : ""}${input.intention ? ` Teacher intention: ${input.intention.trim()}.` : ""}`,
    safety: [...baseline.safety, ...students.slice(1).flatMap((item) => item.body_conditions ? [`Offer a visible modification for ${item.name}’s profile: ${item.body_conditions}.`] : []), beginnerFriendly ? "Demonstrate each transition and keep an easy option visible for new students." : "Offer a lower-load option before progressing range or speed."],
    cues: baseline.cues,
    preparation: [input.props?.trim() ? `Set out: ${input.props.trim()}.` : "Set out a mat, a chair and one support option.", `${input.new_students || 0} new student(s): use names, explain consent and invite questions before class.`, "Preview the intention and check for any current symptoms before movement."]
  };
}

async function aiPlan(context: object): Promise<ClassPlan | null> {
  if (!process.env.OPENAI_API_KEY || process.env.ENABLE_AI_RECOMMENDATIONS !== "true") return null;
  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini", store: false,
      input: [
        { role: "developer", content: "You are a careful yoga class planning assistant for a qualified teacher. Design one connected class from arrival, progressive warm-up, repeated bilateral flow, peak preparation, integration, cool-down and rest. Use the students' complete histories and teacher logistics; resolved issues should not drive today's sequence. Return 12–18 TEACHING BLOCKS, not isolated poses: each block names its phase, repeated rounds or breaths, and an explicit transition into the next block. Across rounds the blocks should contain enough repetitions and bilateral work to fill the class. Every block needs an integer durationMinutes and their sum MUST equal the requested duration exactly; time must repeat that value as '<n> min'. Strongly reflect theme, intention, difficulty and props. Create studentConsiderations from each named student's profile/history. For wrist or hand concerns, do not prescribe prolonged palm loading, plank, Chaturanga or Downward Dog; offer wall, forearm or standing alternatives. For beginners, provide a visible level-one option before progressing. Explain one or two key poses with setup, cues, cautions and accessible options. Never diagnose or prescribe treatment; advise referral for symptoms beyond teaching scope." },
        { role: "user", content: JSON.stringify(context) }
      ],
      text: { format: { type: "json_schema", name: "class_plan", strict: true, schema: CLASS_PLAN_SCHEMA } }
    }) });
    if (!response.ok) return null;
    const text = extractText(await response.json());
    return text ? JSON.parse(text) as ClassPlan : null;
  } catch { return null; }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", ["POST"]); return res.status(405).json({ error: "Method not allowed" }); }
  const input = req.body as PlanningInput;
  const studentIds = input?.student_ids?.filter(Boolean) ?? (input?.student_id ? [input.student_id] : []);
  if (!studentIds.length) return res.status(400).json({ error: "Select at least one student" });
  try {
    const students = await getStudents();
    const selectedStudents = studentIds.map((id) => students.find((student) => student.id === id)).filter((student): student is Student => Boolean(student));
    if (selectedStudents.length !== studentIds.length) return res.status(404).json({ error: "One or more students were not found" });
    const notes = (await Promise.all(studentIds.map((id) => getClassNotes(id)))).flat().sort((a, b) => `${b.class_date}T${b.class_time || "00:00"}`.localeCompare(`${a.class_date}T${a.class_time || "00:00"}`));
    const baseline = localPlan(selectedStudents, notes, input);
    const generated = await aiPlan({ planningRequest: { ...input, student_ids: studentIds }, studentProfiles: selectedStudents.map((student) => ({ name: student.name, age_range: student.age_range, experience_level: student.experience_level, goals: student.goals, body_conditions: student.body_conditions, injury_notes: student.injury_notes })), issueProgress: analyzeIssueProgress(notes), completeClassHistory: notes, safeLocalBaseline: baseline });
    const requestedDuration = [30, 45, 60, 75, 90].includes(Number(input.duration)) ? Number(input.duration) : 60;
    const generatedDuration = generated?.sequence.reduce((sum, step) => sum + Number(step.durationMinutes), 0);
    const generatedIsComplete = Boolean(generated && generated.sequence.length >= 12 && generated.keyPoses.length >= 1 && generatedDuration === requestedDuration);
    return res.status(200).json({ plan: generatedIsComplete ? generated : baseline, source: generatedIsComplete ? "ai" : "adaptive", studentIds });
  } catch (error) { return res.status(500).json({ error: error instanceof Error ? error.message : "Could not create class plan" }); }
}
