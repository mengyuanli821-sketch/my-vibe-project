import type { ClassNote, Student } from "@/types/student";
import { splitSelections } from "@/lib/options";

export type ClassSuggestion = {
  category: "Arrival" | "Movement" | "Breath" | "Intention" | "Follow-up";
  title: string;
  detail: string;
  tone: "sage" | "clay" | "gold";
};

export type PracticeGuide = {
  title: string;
  intention: string;
  sequence: Array<{ pose: string; time: string; purpose: string }>;
  anatomy: string;
  safety: string[];
  cues: string[];
};

export type IssueProgress = {
  issue: string;
  status: "active" | "improving" | "resolved";
  evidence: string;
};

function hasAny(text: string, words: string[]) {
  const normalized = text.toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function averageScore(notes: ClassNote[], key: "energy_score" | "body_comfort_score" | "focus_score") {
  const scores = notes.map((note) => Number(note[key])).filter((score) => score >= 1 && score <= 5);
  return scores.length ? scores.reduce((total, score) => total + score, 0) / scores.length : null;
}

function mostFrequentIssue(notes: ClassNote[]) {
  const counts = new Map<string, number>();
  notes
    .flatMap((note) => splitSelections(note.issues))
    .filter((issue) => issue !== "No concern")
    .forEach((issue) => counts.set(issue, (counts.get(issue) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0] ?? null;
}

export function analyzeIssueProgress(classNotes: ClassNote[]): IssueProgress[] {
  const notes = [...classNotes].sort((a, b) => `${b.class_date}T${b.class_time || "00:00"}`.localeCompare(`${a.class_date}T${a.class_time || "00:00"}`));
  const issues = [...new Set(notes.flatMap((note) => splitSelections(note.issues)).filter((issue) => issue !== "No concern"))];
  const recent = notes.slice(0, 2);
  const latestComfort = Number(notes[0]?.body_comfort_score);

  return issues.map((issue) => {
    const appearances = notes.filter((note) => splitSelections(note.issues).includes(issue));
    const appearsNow = recent.some((note) => splitSelections(note.issues).includes(issue));
    const absentFromTwo = recent.length >= 2 && !appearsNow;

    if (absentFromTwo && latestComfort >= 4) {
      return { issue, status: "resolved", evidence: `Absent from the latest ${recent.length} classes; current comfort is ${latestComfort}/5.` };
    }

    if (!splitSelections(notes[0]?.issues ?? "").includes(issue) && appearances.length > 0) {
      return { issue, status: "improving", evidence: "Not observed in the latest class; continue a light check-in." };
    }

    return { issue, status: "active", evidence: appearances.length > 1 ? `Observed in ${appearances.length} classes.` : "Observed in the latest class." };
  });
}

export function buildNextClassSuggestions(student: Student, classNotes: ClassNote[]): ClassSuggestion[] {
  const suggestions: ClassSuggestion[] = [];
  const bodyNotes = `${student.body_conditions} ${student.injury_notes}`.trim();
  const recent = [...classNotes]
    .sort((a, b) => `${b.class_date}T${b.class_time || "00:00"}`.localeCompare(`${a.class_date}T${a.class_time || "00:00"}`))
    .slice(0, 3);
  const energy = averageScore(recent, "energy_score");
  const comfort = averageScore(recent, "body_comfort_score");
  const focus = averageScore(recent, "focus_score");
  const recurringIssue = mostFrequentIssue(recent);
  const latest = recent[0];

  suggestions.push({
    category: "Arrival",
    title: energy !== null && energy <= 2.5 ? "Begin low and listen" : "Open with a mindful check-in",
    detail: energy !== null && energy <= 2.5
      ? "Recent energy has been low. Begin close to the earth with 3–5 minutes of quiet breath and gentle joint movement."
      : "Ask for today's energy, comfort and intention before choosing the pace of practice.",
    tone: "gold"
  });

  if (comfort !== null && comfort <= 2.5) {
    suggestions.push({
      category: "Movement",
      title: "Choose ease over range",
      detail: "Body-comfort scores are trending low. Use supported shapes, a slower transition rhythm and a clear pain-free range.",
      tone: "clay"
    });
  }

  if (hasAny(bodyNotes, ["back", "spine", "腰"])) {
    suggestions.push({ category: "Movement", title: "Support the spine", detail: "Prioritize neutral-spine awareness, gentle core stability and small-range twists before deeper flexion.", tone: "sage" });
  } else if (hasAny(bodyNotes, ["knee", "膝"])) {
    suggestions.push({ category: "Movement", title: "Create space for the knees", detail: "Offer padding, shorter stances and low-impact options; invite sensation feedback before deeper knee flexion.", tone: "sage" });
  } else if (hasAny(bodyNotes, ["shoulder", "neck", "肩", "頸", "wrist"])) {
    suggestions.push({ category: "Movement", title: "Soften the upper body", detail: "Reduce prolonged weight-bearing and overhead effort. Pair scapular mobility with an unforced neck and jaw.", tone: "sage" });
  }

  if (recurringIssue) {
    suggestions.push({
      category: "Follow-up",
      title: recurringIssue[1] > 1 ? `Recurring: ${recurringIssue[0]}` : `Revisit ${recurringIssue[0]}`,
      detail: recurringIssue[1] > 1
        ? `This appeared in ${recurringIssue[1]} recent classes. Check it before practice and compare the response after the main sequence.`
        : "Check whether this area has changed since the last class, then adapt the sequence before adding intensity.",
      tone: "clay"
    });
  }

  if (focus !== null && focus <= 2.5) {
    suggestions.push({ category: "Breath", title: "Gather a scattered mind", detail: "Use counted exhalations or simple box breathing, then repeat a short sequence instead of adding complexity.", tone: "gold" });
  } else if (energy !== null && energy >= 4 && comfort !== null && comfort >= 3.5) {
    suggestions.push({ category: "Movement", title: "Build toward a playful peak", detail: "Energy and comfort are supportive. Progress one familiar pattern with balance or strength, while keeping breath smooth.", tone: "sage" });
  }

  if (hasAny(student.goals, ["stress", "relax", "anxiety", "sleep", "壓力", "放鬆"])) {
    suggestions.push({ category: "Breath", title: "Lengthen the exhale", detail: "Close with a 1:2 breathing rhythm and a longer supported rest to serve the student's stress-regulation goal.", tone: "gold" });
  } else if (hasAny(student.goals, ["strength", "強度", "力量"])) {
    suggestions.push({ category: "Movement", title: "Progress strength with steadiness", detail: "Repeat one known strength pattern for 2–3 mindful rounds, prioritizing alignment and breath over repetitions.", tone: "sage" });
  } else if (hasAny(student.goals, ["flex", "mobility", "柔軟", "活動度"])) {
    suggestions.push({ category: "Movement", title: "Pair mobility with stability", detail: "Use active range before longer holds so new mobility feels supported and integrated.", tone: "sage" });
  }

  const reflection = latest?.teacher_note || latest?.follow_up;
  if (reflection) {
    suggestions.push({ category: "Follow-up", title: "Carry the teacher's thread", detail: reflection, tone: "clay" });
  }

  suggestions.push({ category: "Intention", title: "Close with svādhyāya", detail: "Offer one quiet question: “What did your practice reveal today?” Leave a full minute for rest and integration.", tone: "gold" });

  return suggestions
    .filter((suggestion, index, all) => all.findIndex((item) => item.title === suggestion.title) === index)
    .slice(0, 6);
}

export function buildPracticeGuide(student: Student, classNotes: ClassNote[]): PracticeGuide {
  const progress = analyzeIssueProgress(classNotes);
  const activeContext = progress.filter((item) => item.status !== "resolved").map((item) => item.issue).join(" ");
  const resolvedContext = progress.filter((item) => item.status === "resolved").map((item) => item.issue).join(" ");
  const profileContext = `${student.body_conditions} ${student.injury_notes}`;
  const contextHas = (words: string[]) => hasAny(activeContext, words) || (hasAny(profileContext, words) && !hasAny(resolvedContext, words));
  const orderedNotes = [...classNotes].sort((a, b) => `${b.class_date}T${b.class_time || "00:00"}`.localeCompare(`${a.class_date}T${a.class_time || "00:00"}`));
  const scores = orderedNotes.slice(0, 3).map((note) => Number(note.energy_score)).filter((score) => score >= 1 && score <= 5);
  const energy = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 3;

  if (contextHas(["back", "spine", "腰"])) {
    return {
      title: "Spinal ease & steady support",
      intention: "Move from sensation rather than maximum range; create support around the lumbar spine.",
      sequence: [
        { pose: "Constructive rest", time: "3 min", purpose: "Observe breath and neutral pelvis" },
        { pose: "Small Cat–Cow", time: "6 rounds", purpose: "Explore pain-free spinal movement" },
        { pose: "Bird Dog", time: "4 / side", purpose: "Build trunk and hip stability" },
        { pose: "Supported Low Lunge", time: "5 breaths / side", purpose: "Open the hip flexors without lumbar compression" },
        { pose: "Low Bridge", time: "5 rounds", purpose: "Integrate glutes, legs and posterior support" },
        { pose: "Savasana with knees supported", time: "5 min", purpose: "Down-regulate and integrate" }
      ],
      anatomy: "Keep the lumbar spine supported by coordinated abdominal pressure, hip strength and easy breathing. Seek motion through the hips and thoracic spine instead of asking the low back to provide all the range.",
      safety: ["Stay in a comfortable range; stop for sharp, radiating, numb or worsening symptoms.", "Avoid forcing deep forward folds or twists when symptoms are active.", "Refer persistent or unexplained symptoms to a qualified healthcare professional."],
      cues: ["Lengthen through the crown before you move.", "Let the pelvis and ribs travel together.", "Choose the version where your breath stays quiet and smooth."]
    };
  }

  if (contextHas(["knee", "膝"])) {
    return {
      title: "Grounded legs & knee confidence",
      intention: "Build hip and foot support around a comfortable knee range.",
      sequence: [
        { pose: "Tadasana + tripod feet", time: "8 breaths", purpose: "Organize foot, knee and hip alignment" },
        { pose: "Supported Chair", time: "4 × 3 breaths", purpose: "Load the legs in a small controlled range" },
        { pose: "Short-stance Warrior II", time: "5 breaths / side", purpose: "Strengthen hips with visible knee tracking" },
        { pose: "Supported Tree", time: "5 breaths / side", purpose: "Train balance without twisting the standing knee" },
        { pose: "Bridge", time: "6 rounds", purpose: "Strengthen posterior hips with low knee demand" },
        { pose: "Legs on chair rest", time: "4 min", purpose: "Release effort and observe response" }
      ],
      anatomy: "The knee is influenced by the foot and hip. Encourage the kneecap to follow the direction of the second or third toe while the gluteal muscles share the load.",
      safety: ["Use a shorter stance and less knee bend before adding intensity.", "Avoid forcing Lotus or deep kneeling, especially for newer students or active symptoms.", "Pain, swelling, locking or instability needs healthcare assessment rather than a yoga correction."],
      cues: ["Track the center of the knee toward the middle toes.", "Press the whole foot down and let the hip help.", "Make the shape smaller before the breath becomes tense."]
    };
  }

  if (contextHas(["shoulder", "neck", "wrist", "chest", "upper back", "肩", "頸"])) {
    return {
      title: "Shoulder space & upper-back support",
      intention: "Let the shoulder blades move with the ribs while the neck and wrists remain unforced.",
      sequence: [
        { pose: "Seated lateral breathing", time: "2 min", purpose: "Invite rib movement without shoulder lifting" },
        { pose: "Scapular glides at wall", time: "8 rounds", purpose: "Coordinate shoulder blade movement" },
        { pose: "Wall Puppy", time: "5 breaths", purpose: "Explore overhead range without body weight" },
        { pose: "Sphinx", time: "5 breaths", purpose: "Strengthen upper back with forearm support" },
        { pose: "Locust arms low", time: "3 rounds", purpose: "Build posterior shoulder endurance" },
        { pose: "Supported fish rest", time: "3 min", purpose: "Release the front body gently" }
      ],
      anatomy: "Healthy overhead movement shares motion between the upper arm, shoulder blade and thoracic spine. Avoid pinning the shoulder blades down while asking the arms to lift.",
      safety: ["Reduce or remove hand weight-bearing for wrist symptoms.", "Do not pull the head or push into end-range neck motion.", "Tingling, weakness, trauma or persistent pain warrants professional assessment."],
      cues: ["Let the shoulder blade follow the arm.", "Keep space between the ears and the effort.", "Press through the whole hand—or choose the wall or forearms."]
    };
  }

  return {
    title: energy <= 2.5 ? "Restore & reconnect" : "Balanced whole-body practice",
    intention: energy <= 2.5 ? "Conserve energy and finish more settled than you began." : "Balance grounding, mobility, strength and reflection.",
    sequence: energy <= 2.5 ? [
      { pose: "Supported Child’s Pose", time: "3 min", purpose: "Arrive and sense the back breath" },
      { pose: "Supine windshield wipers", time: "8 rounds", purpose: "Mobilize hips and spine gently" },
      { pose: "Low Bridge", time: "5 rounds", purpose: "Create circulation without depletion" },
      { pose: "Reclined bound angle", time: "4 min", purpose: "Settle effort with support" },
      { pose: "Savasana", time: "6 min", purpose: "Rest and integrate" }
    ] : [
      { pose: "Tadasana breath", time: "8 breaths", purpose: "Arrive and establish intention" },
      { pose: "Half Sun Salutation", time: "4 rounds", purpose: "Warm the whole body gradually" },
      { pose: "Warrior II → Side Angle", time: "5 breaths / side", purpose: "Integrate legs, hips and lateral breath" },
      { pose: "Supported Tree", time: "5 breaths / side", purpose: "Practice focused balance" },
      { pose: "Bridge", time: "6 rounds", purpose: "Strengthen the posterior body" },
      { pose: "Supine twist → Savasana", time: "6 min", purpose: "Downshift and integrate" }
    ],
    anatomy: `Distribute movement across the ankles, hips, thoracic spine and shoulders. Stable does not mean rigid: keep enough muscular support to make breathing and joint motion feel spacious.${student.body_conditions ? ` Continue to accommodate the full profile: ${student.body_conditions}.` : ""}`,
    safety: ["Ask about current symptoms before class and offer a smaller, supported option first.", "Avoid advanced inversions, Lotus and forceful breathing for newer students.", "Stop for sharp, radiating, dizzy or worsening symptoms and refer concerns appropriately."],
    cues: ["Build the shape from the ground up.", "Keep the breath smooth enough to guide the pace.", "Steady is useful; strain is information to change course."]
  };
}
