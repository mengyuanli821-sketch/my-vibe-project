import type { NextApiRequest, NextApiResponse } from "next";
import { getClassNotes, getStudentById, getStudents } from "@/lib/googleSheets";
import { analyzeIssueProgress, buildPracticeGuide } from "@/lib/suggestions";
import { deriveHealthConstraints, poseConflictsWithHealth } from "@/lib/healthConstraints";
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

type PlanningInput = { student_id?: string; student_ids?: string[]; theme?: string; difficulty?: number; duration?: number; new_students?: number; props?: string; intention?: string; class_style?: string; pace?: string; must_include?: string; avoid_poses?: string; variation_key?: number; locale?: "zh-TW" | "zh-CN" | "en" };
type AIPlanResult = { plan: ClassPlan | null; reason: string };

function extractText(response: unknown) {
  const output = (response as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }).output ?? [];
  return output.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text ?? "";
}

function splitPoseRequests(value?: string) {
  return (value || "").split(/[,;，、\n]+/).map((item) => item.trim()).filter(Boolean).slice(0, 4);
}

function poseMatchesRequest(pose: string, request: string) {
  const poseWords: string[] = pose.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const requestWords: string[] = request.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  return requestWords.length > 0 && requestWords.every((word) => poseWords.includes(word));
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
  const healthConstraints = deriveHealthConstraints(students, notes);
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
  const requestedInclusions = splitPoseRequests(input.must_include);
  requestedInclusions.slice(0, 2).forEach((pose, index) => {
    const targetIndex = 10 + index;
    poseArc[targetIndex] = { ...poseArc[targetIndex], pose, purpose: `Teach the teacher-requested ${pose} with preparation and an accessible option` };
  });
  const requestedExclusions = splitPoseRequests(input.avoid_poses);
  poseArc.forEach((step, index) => {
    if (requestedExclusions.some((excluded) => poseMatchesRequest(step.pose, excluded)) || poseConflictsWithHealth(step.pose, healthConstraints)) {
      poseArc[index] = { ...step, pose: step.phase === "Standing flow" || step.phase === "Peak preparation" ? "Chair-Supported Balance" : "Standing Breath Reset", purpose: "Preserve the class arc without the teacher-excluded movement" };
    }
  });
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
    summary: `${duration}-minute ${input.class_style || "mixed"} class with a ${input.pace || "balanced"} pace, focused on ${theme || "whole-person movement"}, at difficulty ${difficulty}/5 for ${students.map((item) => item.name).join(", ")}. Its ${sequence.length} connected teaching blocks include repeated bilateral flows and are timed to exactly ${duration} minutes.${input.must_include?.trim() ? ` Requested inclusions: ${input.must_include.trim()}.` : ""}${input.avoid_poses?.trim() ? ` Teacher exclusions: ${input.avoid_poses.trim()}.` : ""}`,
    sequence,
    keyPoses: themedMiddle.slice(1, 3).map((step) => ({
      pose: step.pose,
      why: `${step.purpose}. This is a central expression of today’s ${theme || "balanced-practice"} focus.`,
      setup: ["Build the foundation first and enter in stages.", "Pause at a range where the breath remains even.", "Hold for the planned time, then exit with control."],
      cues: baseline.cues.slice(0, 3),
      options: beginnerFriendly ? ["Reduce the range and use a wall, chair or blocks.", "Skip the hold and repeat a smaller movement."] : ["Use a support to prioritize steadiness over depth."]
    })),
    studentConsiderations: healthConstraints.map((constraint) => ({ student: constraint.student, concern: constraint.concern, avoid: constraint.avoid, alternatives: constraint.alternatives })),
    rationale: `${baseline.intention}${resolved.length ? ` Previously noted ${resolved.join(", ")} is marked resolved, so it is not the main load today.` : ""}${input.intention ? ` Teacher intention: ${input.intention.trim()}.` : ""} The fallback honors the requested ${input.class_style || "mixed"} format and ${input.pace || "balanced"} pace, but AI configuration is required for fully bespoke sequencing.`,
    safety: [...baseline.safety, ...students.slice(1).flatMap((item) => item.body_conditions ? [`Offer a visible modification for ${item.name}’s profile: ${item.body_conditions}.`] : []), beginnerFriendly ? "Demonstrate each transition and keep an easy option visible for new students." : "Offer a lower-load option before progressing range or speed."],
    cues: baseline.cues,
    preparation: [input.props?.trim() ? `Set out: ${input.props.trim()}.` : "Set out a mat, a chair and one support option.", `${input.new_students || 0} new student(s): use names, explain consent and invite questions before class.`, "Preview the intention and check for any current symptoms before movement."]
  };
}

function normalizePlanDuration(plan: ClassPlan, requestedDuration: number): ClassPlan {
  const durations = plan.sequence.map((step) => Math.max(1, Math.round(Number(step.durationMinutes) || 1)));
  let difference = requestedDuration - durations.reduce((sum, value) => sum + value, 0);
  const adjustable = plan.sequence.map((_, index) => index).reverse();
  while (difference !== 0) {
    let changed = false;
    for (const index of adjustable) {
      if (difference > 0) { durations[index] += 1; difference -= 1; changed = true; }
      else if (durations[index] > 1) { durations[index] -= 1; difference += 1; changed = true; }
      if (difference === 0) break;
    }
    if (!changed) break;
  }
  return { ...plan, sequence: plan.sequence.map((step, index) => ({ ...step, durationMinutes: durations[index], time: `${durations[index]} min` })) };
}

async function aiPlan(context: object): Promise<AIPlanResult> {
  if (!process.env.OPENAI_API_KEY) return { plan: null, reason: "OpenAI is not configured. Add OPENAI_API_KEY to .env.local and restart the server." };
  if (process.env.ENABLE_AI_RECOMMENDATIONS === "false") return { plan: null, reason: "AI planning is disabled by ENABLE_AI_RECOMMENDATIONS=false." };
  try {
    const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini", store: false,
      input: [
        { role: "developer", content: "You are an RYT-informed yoga sequencing partner for a qualified teacher. Write every human-readable response field in outputLanguage, retaining standard Sanskrit pose names where useful. Apply the Yoga Alliance RYS 200 competency lenses: techniques/practice, anatomy and biomechanics, teaching methodology, sequencing, pace, cueing, accessible environment, class management and practicum-ready specificity. First interpret the teacherBrief; every explicit theme, style, pace, intention, required pose, excluded pose, duration, difficulty, prop and new-student constraint is binding unless it conflicts with safety. Then reconcile it with every student profile and the complete class history. Treat every supplied healthConstraint as binding: avoid every listed contraindicated load or pose for that named student, add a named studentConsideration, and provide low-risk alternatives. Never generalize a single student example into a global rule, and never assume that an old pain or diagnosed condition has disappeared merely because it was not mentioned in the latest class. Design a genuinely bespoke class, not a generic template. Use a different valid architecture when variationRequest changes (for example progressive ladder, wave-and-repeat, mandala, or peak-pose preparation), while keeping transitions coherent. Build arrival, progressive warm-up, repeated bilateral flow or style-appropriate main work, peak preparation, integration, cool-down and rest. Return 12–18 TEACHING BLOCKS rather than isolated poses; each block states phase, rounds/breaths and the physical transition into the next block. Yin and Restorative requests should use fewer transitions and longer holds; Vinyasa may use repeated linked waves; Hatha should use deliberate holds and resets. Every block needs an integer durationMinutes, and their sum must equal teacherBrief.durationMinutes exactly. Create studentConsiderations for named students and do not reintroduce excluded movements. Give beginners a visible level-one option before progressions. Explain one or two request-relevant key poses with setup, cues, cautions and options. Stay within yoga-teaching scope: do not diagnose or prescribe treatment, and flag symptoms that require healthcare referral." },
        { role: "user", content: JSON.stringify(context) }
      ],
      text: { format: { type: "json_schema", name: "class_plan", strict: true, schema: CLASS_PLAN_SCHEMA } }
    }) });
    if (!response.ok) {
      const details = await response.json().catch(() => ({})) as { error?: { message?: string } };
      return { plan: null, reason: details.error?.message ? `OpenAI request failed: ${details.error.message}` : `OpenAI request failed with status ${response.status}.` };
    }
    const text = extractText(await response.json());
    return text ? { plan: JSON.parse(text) as ClassPlan, reason: "" } : { plan: null, reason: "OpenAI returned no class-plan content." };
  } catch (error) { return { plan: null, reason: error instanceof Error ? `OpenAI request failed: ${error.message}` : "OpenAI request failed unexpectedly." }; }
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
    const healthConstraints = deriveHealthConstraints(selectedStudents, notes);
    const requestedDuration = [30, 45, 60, 75, 90].includes(Number(input.duration)) ? Number(input.duration) : 60;
    const variationArchitectures = ["progressive ladder", "wave and repeat", "mandala", "peak-pose pathway"];
    const variationRequest = variationArchitectures[Math.abs(Number(input.variation_key) || Date.now()) % variationArchitectures.length];
    const aiResult = await aiPlan({
      rytFramework: { techniquesPractice: true, anatomyBiomechanics: true, teachingMethodology: ["sequencing", "pace", "environment", "cueing", "class management"], practicumReady: true },
      teacherBrief: { style: input.class_style || "Vinyasa", pace: input.pace || "Balanced", theme: input.theme || "", intention: input.intention || "", durationMinutes: requestedDuration, difficulty: input.difficulty || 3, props: input.props || "", newStudents: input.new_students || 0, mustInclude: input.must_include || "", mustAvoid: input.avoid_poses || "" },
      outputLanguage: input.locale === "zh-CN" ? "Simplified Chinese" : input.locale === "en" ? "English" : "Traditional Chinese",
      variationRequest,
      studentProfiles: selectedStudents.map((student) => ({ id: student.id, name: student.name, age_range: student.age_range, experience_level: student.experience_level, goals: student.goals, body_conditions: student.body_conditions, injury_notes: student.injury_notes, teacher_notes: student.teacher_notes })),
      healthConstraints,
      issueProgress: analyzeIssueProgress(notes), completeClassHistory: notes, safeReferenceOnly: baseline
    });
    const requestedInclusions = splitPoseRequests(input.must_include);
    const requestedExclusions = splitPoseRequests(input.avoid_poses);
    const generatedPoseNames = aiResult.plan?.sequence.map((step) => step.pose) ?? [];
    const includesRequiredPoses = requestedInclusions.every((required) => generatedPoseNames.some((pose) => poseMatchesRequest(pose, required)));
    const excludesForbiddenPoses = requestedExclusions.every((excluded) => generatedPoseNames.every((pose) => !poseMatchesRequest(pose, excluded)));
    const excludesHealthConflicts = generatedPoseNames.every((pose) => !poseConflictsWithHealth(pose, healthConstraints));
    const coversStudentsWithHealthNotes = healthConstraints.every((constraint) => aiResult.plan?.studentConsiderations.some((item) => item.student === constraint.student));
    const generatedIsComplete = Boolean(aiResult.plan && aiResult.plan.sequence.length >= 12 && aiResult.plan.keyPoses.length >= 1 && includesRequiredPoses && excludesForbiddenPoses && excludesHealthConflicts && coversStudentsWithHealthNotes);
    const generated = generatedIsComplete && aiResult.plan ? normalizePlanDuration(aiResult.plan, requestedDuration) : null;
    const sourceReason = generated ? `Designed by ${process.env.OPENAI_MODEL || "gpt-5-mini"} from this teacher brief using a ${variationRequest} architecture.` : aiResult.reason || "The AI result did not satisfy every required or excluded pose constraint, so a requirement-aware safety template was used.";
    return res.status(200).json({ plan: generated ?? baseline, source: generated ? "ai" : "adaptive", sourceReason, studentIds });
  } catch (error) { return res.status(500).json({ error: error instanceof Error ? error.message : "Could not create class plan" }); }
}
