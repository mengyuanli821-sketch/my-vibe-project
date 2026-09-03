import type { ClassNote, Student } from "@/types/student";

export type HealthConstraint = {
  student: string;
  concern: string;
  evidence: string[];
  avoid: string;
  alternatives: string[];
  forbiddenPoseTerms: string[];
};

type ConstraintRule = Omit<HealthConstraint, "student" | "evidence"> & { pattern: RegExp };

const RULES: ConstraintRule[] = [
  { pattern: /wrist|hand pain|carpal|手腕|腕痛|手部疼痛|腕管/i, concern: "Wrist / hand loading", avoid: "Avoid sustained palm loading, forceful wrist extension, Plank, Chaturanga and Downward Dog while symptoms are present.", alternatives: ["Wall or chair-supported standing work", "Forearm-supported shapes", "Neutral-wrist breath and mobility"], forbiddenPoseTerms: ["plank", "chaturanga", "downward dog", "crow", "handstand", "側板", "平板", "下犬", "烏鴉", "手倒立"] },
  { pattern: /knee|meniscus|acl|mcl|膝|半月板|前十字|韌帶/i, concern: "Knee sensitivity / condition", avoid: "Avoid painful deep knee flexion, forced rotation, long unsupported kneeling and unstable knee tracking.", alternatives: ["Shorter stance with chair support", "Blanket under the knee", "Smaller bend or supine version"], forbiddenPoseTerms: ["lotus", "hero", "pigeon", "deep squat", "蓮花", "英雄", "鴿子", "深蹲"] },
  { pattern: /shoulder|rotator cuff|frozen shoulder|肩|旋轉肌|五十肩/i, concern: "Shoulder condition", avoid: "Avoid painful overhead range, weight-bearing through an unstable shoulder and forceful binds.", alternatives: ["Hands at hips", "Cactus arms below shoulder height", "Wall-supported shoulder movement"], forbiddenPoseTerms: ["wheel", "handstand", "forearm stand", "bind", "輪式", "手倒立", "前臂倒立", "綁手"] },
  { pattern: /neck|cervical|頸|頚|頸椎/i, concern: "Neck / cervical condition", avoid: "Avoid loading the head or neck, forced end-range rotation and unsupported cervical extension.", alternatives: ["Keep the gaze neutral", "Support the head with a blanket", "Use gentle thoracic movement instead"], forbiddenPoseTerms: ["headstand", "shoulderstand", "plow", "fish pose", "頭倒立", "肩倒立", "犁式", "魚式"] },
  { pattern: /lower back|back pain|lumbar|disc|sciatica|spine|腰|下背|椎間盤|坐骨神經|脊椎/i, concern: "Back / spinal condition", avoid: "Avoid painful loaded flexion, forceful twisting, deep backbends and rapid transitions through the affected range.", alternatives: ["Neutral-spine hinge", "Supported constructive rest", "Smaller pain-free range"], forbiddenPoseTerms: ["wheel", "deep forward fold", "full twist", "輪式", "深前彎", "深扭轉"] },
  { pattern: /hip|groin|pelvis|髖|髋|鼠蹊|骨盆/i, concern: "Hip / pelvic condition", avoid: "Avoid forcing deep external rotation, wide range or compression that reproduces symptoms.", alternatives: ["Supported figure four", "Shorter stance", "Supine or chair-supported mobility"], forbiddenPoseTerms: ["lotus", "pigeon", "splits", "蓮花", "鴿子", "劈腿"] },
  { pattern: /ankle|foot|feet|achilles|plantar|腳踝|足|腳底|跟腱/i, concern: "Ankle / foot condition", avoid: "Avoid painful single-leg loading, forced plantar flexion and unstable balance without support.", alternatives: ["Chair-supported balance", "Seated ankle mobility", "Wider two-foot stance"], forbiddenPoseTerms: ["toe stand", "unsupported tree", "踮腳", "無支撐樹式"] },
  { pattern: /elbow|tennis elbow|肘|網球肘/i, concern: "Elbow condition", avoid: "Avoid painful loaded elbow flexion or extension and repetitive upper-body weight bearing.", alternatives: ["Wall-supported work", "Forearms on a chair", "Hands-free standing sequence"], forbiddenPoseTerms: ["chaturanga", "crow", "plank", "四柱", "烏鴉", "平板"] },
  { pattern: /osteoporosis|osteopenia|骨質疏鬆|骨质疏松/i, concern: "Bone-density condition", avoid: "Avoid loaded spinal flexion, forceful twisting and high-impact or fall-risk transitions; follow the student’s clinical guidance.", alternatives: ["Neutral-spine standing work", "Wall-supported balance", "Slow, low-impact transitions"], forbiddenPoseTerms: ["deep forward fold", "plow", "roll up", "深前彎", "犁式", "滾背"] },
  { pattern: /pregnan|postpartum|產後|产后|懷孕|怀孕|孕期/i, concern: "Pregnancy / postpartum context", avoid: "Avoid breath retention, overheating, strong abdominal compression and any position restricted by the student’s maternity-care professional.", alternatives: ["Side-lying rest", "Wide-knee supported positions", "Chair-supported standing work"], forbiddenPoseTerms: ["closed twist", "boat", "deep prone", "閉合扭轉", "船式", "深俯臥"] },
  { pattern: /vertigo|dizz|balance disorder|眩暈|眩晕|頭暈|头晕|平衡障礙/i, concern: "Dizziness / balance condition", avoid: "Avoid rapid level changes, unsupported balance and positions that trigger dizziness.", alternatives: ["Keep one hand on a wall or chair", "Move from low to high slowly", "Seated orientation and breath"], forbiddenPoseTerms: ["headstand", "handstand", "unsupported balance", "頭倒立", "手倒立", "無支撐平衡"] },
  { pattern: /blood pressure|hypertension|heart|cardiac|心臟|心脏|高血壓|高血压|血壓|血压/i, concern: "Cardiovascular condition", avoid: "Avoid breath retention, sudden intensity spikes and prolonged inversion; stay within documented medical guidance.", alternatives: ["Steady conversational pace", "Upright rest breaks", "Gentle breath without retention"], forbiddenPoseTerms: ["headstand", "shoulderstand", "breath retention", "頭倒立", "肩倒立", "閉氣"] },
  { pattern: /glaucoma|retinal|eye pressure|青光眼|視網膜|视网膜|眼壓|眼压/i, concern: "Eye-pressure / retinal condition", avoid: "Avoid head-below-heart inversions and breath retention unless specifically cleared by the student’s clinician.", alternatives: ["Upright standing alternatives", "Inclined rest", "Neutral breathing"], forbiddenPoseTerms: ["headstand", "shoulderstand", "plow", "downward dog", "頭倒立", "肩倒立", "犁式", "下犬"] },
  { pattern: /asthma|breathless|respiratory|哮喘|氣喘|气喘|呼吸困難|呼吸困难/i, concern: "Respiratory condition", avoid: "Avoid breath retention, forced breathwork and pacing that creates uncontrolled breathlessness.", alternatives: ["Natural nasal breathing", "Upright recovery", "Longer rest between waves"], forbiddenPoseTerms: ["breath retention", "kapalabhati", "閉氣", "火呼吸"] },
  { pattern: /arthritis|rheumatoid|關節炎|关节炎|類風濕|类风湿/i, concern: "Arthritis / joint condition", avoid: "Avoid forcing painful joint range, long static load on irritated joints and fast repetitive transitions.", alternatives: ["Use blocks, wall or chair", "Short comfortable holds", "Change position before symptoms increase"], forbiddenPoseTerms: [] }
];

const RISK_LANGUAGE = /pain|ache|sore|injur|disease|condition|surgery|swelling|unstable|numb|tingl|weak|sensitive|discomfort|limited|疼|痛|傷|伤|疾病|病史|手術|手术|腫|肿|麻|無力|无力|不穩|不稳|敏感|不適|不适|受限/i;
const NEGATED = /\b(no|without|resolved|recovered)\s+(pain|injury|symptoms?)\b|無疼痛|无疼痛|沒有疼痛|没有疼痛|已康復|已恢复|已恢復/i;

function meaningful(value?: string, alwaysRelevant = false) {
  const text = (value || "").trim();
  const explicitlyClear = /^(none|n\/a|no concern|no issues?|無|无|沒有|没有|無異常|无异常)$/i.test(text);
  return Boolean(text && !explicitlyClear && !NEGATED.test(text) && (alwaysRelevant || RISK_LANGUAGE.test(text) || RULES.some((rule) => rule.pattern.test(text))));
}

export function deriveHealthConstraints(students: Student[], notes: ClassNote[]): HealthConstraint[] {
  return students.flatMap((student) => {
    const evidence = [
      meaningful(student.body_conditions, true) ? `Profile support areas: ${student.body_conditions}` : "",
      meaningful(student.injury_notes, true) ? `Profile injury / health note: ${student.injury_notes}` : "",
      meaningful(student.teacher_notes) ? `Profile teacher note: ${student.teacher_notes}` : "",
      ...notes.filter((note) => note.student_id === student.id).flatMap((note) => [
        meaningful(note.today_condition) ? `${note.class_date} condition: ${note.today_condition}` : "",
        meaningful(note.issues, true) ? `${note.class_date} observed issue: ${note.issues}` : "",
        meaningful(note.follow_up) ? `${note.class_date} follow-up: ${note.follow_up}` : "",
        meaningful(note.teacher_note) ? `${note.class_date} teacher note: ${note.teacher_note}` : ""
      ])
    ].filter(Boolean);
    if (!evidence.length) return [];
    const joined = evidence.join(" ");
    const matched = RULES.filter((rule) => rule.pattern.test(joined));
    if (!matched.length) return [{ student: student.name, concern: "Recorded pain / health condition", evidence, avoid: "Do not load, compress or repeatedly move through the recorded symptomatic area. Confirm current status before class and stay within qualified clinical guidance.", alternatives: ["Offer rest and a non-painful range", "Use wall, chair or floor support", "Let the student opt out without pressure"], forbiddenPoseTerms: [] }];
    return matched.map(({ pattern, ...rule }) => ({ ...rule, student: student.name, evidence: evidence.filter((item) => pattern.test(item)) }));
  });
}

export function poseConflictsWithHealth(pose: string, constraints: HealthConstraint[]) {
  const normalized = pose.toLowerCase();
  return constraints.some((constraint) => constraint.forbiddenPoseTerms.some((term) => normalized.includes(term.toLowerCase())));
}
