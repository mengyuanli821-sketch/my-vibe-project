import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ClassStatusLight } from "@/components/ClassStatusLight";
import { FormField, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import { PoseIllustration } from "@/components/PoseIllustration";
import { getClassStatus } from "@/lib/classStatus";
import { splitSelections, toggleSelection } from "@/lib/options";
import { useI18n } from "@/lib/i18n";
import type { ClassNote, StudentWithStats } from "@/types/student";
import type { ClassPlan } from "@/types/teacher";

const EMPTY_PLAN: ClassPlan = { title: "", summary: "", sequence: [], keyPoses: [], studentConsiderations: [], rationale: "", safety: [], cues: [], preparation: [] };

export default function AIClassPlannerPage() {
  const { locale } = useI18n();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [theme, setTheme] = useState("");
  const [difficulty, setDifficulty] = useState("3");
  const [duration, setDuration] = useState("60");
  const [newStudents, setNewStudents] = useState("0");
  const [props, setProps] = useState("");
  const [intention, setIntention] = useState("");
  const [classStyle, setClassStyle] = useState("Vinyasa");
  const [pace, setPace] = useState("Balanced");
  const [mustInclude, setMustInclude] = useState("");
  const [avoidPoses, setAvoidPoses] = useState("");
  const [plan, setPlan] = useState<ClassPlan>(EMPTY_PLAN);
  const [source, setSource] = useState<"idle" | "ai" | "adaptive">("idle");
  const [sourceReason, setSourceReason] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [expandedPose, setExpandedPose] = useState<number | null>(null);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const studentPickerRef = useRef<HTMLDivElement>(null);
  const variationRef = useRef(0);

  useEffect(() => { fetch("/api/students").then((response) => response.json()).then((data) => { setStudents(data.students ?? []); if (data.students?.[0]) setStudentIds([data.students[0].id]); }).catch(() => setError("Could not load students")); }, []);
  useEffect(() => { if (!studentIds.length) { setNotes([]); return; } Promise.all(studentIds.map((id) => fetch(`/api/class-notes?student_id=${id}`).then((response) => response.json()))).then((results) => setNotes(results.flatMap((data) => data.classNotes ?? []).sort((a, b) => `${b.class_date}T${b.class_time || "00:00"}`.localeCompare(`${a.class_date}T${a.class_time || "00:00"}`)))).catch(() => setNotes([])); }, [studentIds]);
  useEffect(() => {
    function closePicker(event: PointerEvent) { if (!studentPickerRef.current?.contains(event.target as Node)) setStudentPickerOpen(false); }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setStudentPickerOpen(false); }
    document.addEventListener("pointerdown", closePicker);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("pointerdown", closePicker); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  const selectedStudents = students.filter((student) => studentIds.includes(student.id));
  const latest = notes[0];

  async function generatePlan() {
    if (!studentIds.length) { setError("Select at least one student first"); return; }
    setIsGenerating(true); setError("");
    try {
      variationRef.current = (variationRef.current + 1) % 4;
      const response = await fetch("/api/class-planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ student_ids: studentIds, theme, difficulty: Number(difficulty), duration: Number(duration), new_students: Number(newStudents), props, intention, class_style: classStyle, pace, must_include: mustInclude, avoid_poses: avoidPoses, variation_key: variationRef.current, locale }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Could not generate plan");
      setPlan(data.plan); setSource(data.source === "ai" ? "ai" : "adaptive"); setSourceReason(data.sourceReason || ""); setExpandedPose(0);
    } catch (generationError) { setError(generationError instanceof Error ? generationError.message : "Could not generate plan"); }
    finally { setIsGenerating(false); }
  }

  return (
    <Layout title="AI Class Planner" action={<Link className="premium-button inline-flex" href="/teacher">← Teacher Studio</Link>}>
      <Head><title>AI Class Planner | Sattva</title></Head>
      <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link className="teacher-tab-active" href="/teacher/planner">AI Class Planner</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link></div>

      <section className="planner-intro"><div><p className="eyebrow">Teacher Studio · pre-class ritual</p><h2 className="mt-2 font-serif text-3xl text-[#294a3c] sm:text-4xl">Shape the room before it opens.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">Select students, add the practical context and let the planner turn history into a connected, teachable arc. Review every suggestion before class.</p></div><span className="planner-sanskrit">krama<br /><small>one step at a time</small></span></section>

      <div className="planner-workspace mt-6">
        <section className="planner-form-card">
          <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">01 · Context</p><h2 className="mt-1 font-serif text-2xl text-[#294a3c]">Today’s container</h2></div><span className={`planner-source-badge ${source === "ai" ? "planner-source-ai" : source === "adaptive" ? "planner-source-template" : ""}`}>{source === "ai" ? "AI generated" : source === "adaptive" ? "Template fallback" : "Awaiting brief"}</span></div>
          <div className="grid gap-4"><FormField label="Students" hint="Open the selection box to choose one or more students."><div className={`student-select ${studentPickerOpen ? "student-select-open" : ""}`} ref={studentPickerRef}><button aria-expanded={studentPickerOpen} aria-haspopup="listbox" className="student-select-trigger" onClick={() => setStudentPickerOpen((open) => !open)} type="button"><span>{selectedStudents.length ? <>{selectedStudents.slice(0, 2).map((student) => <i key={student.id}>{student.name}</i>)}{selectedStudents.length > 2 ? <i>+{selectedStudents.length - 2}</i> : null}</> : <em>Select students…</em>}</span><b>{selectedStudents.length ? `${selectedStudents.length} selected` : "Required"}<i aria-hidden="true">⌄</i></b></button>{studentPickerOpen ? <div aria-label="Students" className="student-select-menu" role="listbox">{students.map((student) => { const isSelected = studentIds.includes(student.id); return <button aria-selected={isSelected} className={`planner-student-option ${isSelected ? "planner-student-option-selected" : ""}`} key={student.id} onClick={() => setStudentIds((current) => splitSelections(toggleSelection(current.join(", "), student.id)))} role="option" type="button"><span className="planner-check">{isSelected ? "✓" : "+"}</span><span><strong>{student.name}</strong><small>{student.class_count} classes · {student.experience_level || "Level not set"}</small></span></button>; })}</div> : null}</div></FormField><div className="grid gap-4 sm:grid-cols-2"><FormField hint="Required" label="Class style"><select className="form-control" onChange={(event) => setClassStyle(event.target.value)} value={classStyle}><option>Vinyasa</option><option>Hatha</option><option>Yin</option><option>Restorative</option><option>Mixed practice</option></select></FormField><FormField hint="Required" label="Pace"><select className="form-control" onChange={(event) => setPace(event.target.value)} value={pace}><option>Slow</option><option>Balanced</option><option>Dynamic</option></select></FormField></div><div className="grid gap-4 sm:grid-cols-2"><FormField hint="Be specific" label="Class theme"><TextInput name="theme" onChange={(event) => setTheme(event.target.value)} placeholder="Hip mobility with steady strength…" value={theme} /></FormField><FormField label="Duration"><select className="form-control" onChange={(event) => setDuration(event.target.value)} value={duration}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="75">75 minutes</option><option value="90">90 minutes</option></select></FormField></div><div className="grid gap-4 sm:grid-cols-2"><FormField label="New students"><TextInput name="new_students" onChange={(event) => setNewStudents(event.target.value)} type="number" value={newStudents} /></FormField><FormField hint="Optional" label="Props / room setup"><TextInput name="props" onChange={(event) => setProps(event.target.value)} placeholder="Chairs, blocks, blankets…" value={props} /></FormField></div><div className="grid gap-4 sm:grid-cols-2"><FormField hint="Optional" label="Must include"><TextInput name="must_include" onChange={(event) => setMustInclude(event.target.value)} placeholder="Tree, breathwork…" value={mustInclude} /></FormField><FormField hint="Optional" label="Avoid poses"><TextInput name="avoid_poses" onChange={(event) => setAvoidPoses(event.target.value)} placeholder="Plank, deep kneeling…" value={avoidPoses} /></FormField></div><FormField hint="How should the room feel or learn?" label="Teacher intention"><TextArea name="intention" onChange={(event) => setIntention(event.target.value)} placeholder="Build confidence through repeated, predictable transitions…" value={intention} /></FormField></div>
          <div className="mt-6"><FormField label={`Difficulty · ${difficulty}/5`} hint="1 = restorative · 5 = vigorous"><input aria-label="Class difficulty" className="difficulty-range" max="5" min="1" onChange={(event) => setDifficulty(event.target.value)} type="range" value={difficulty} /><div className="mt-2 flex justify-between text-[10px] text-stone-400"><span>Restorative</span><span>Vigorous</span></div></FormField></div>

          {selectedStudents.length ? <div className="planner-student-card"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9b6845]">Selection context</p><h3 className="mt-1 font-serif text-xl text-[#294a3c]">{selectedStudents.length} {selectedStudents.length === 1 ? "student" : "students"} selected</h3></div><ClassStatusLight compact status={latest ? getClassStatus(latest) : selectedStudents[0].last_class_status} /></div><div className="mt-4 grid grid-cols-3 gap-2 text-center"><div><strong>{notes.length}</strong><small>classes read</small></div><div><strong>{latest?.energy_score || "—"}</strong><small>latest energy</small></div><div><strong>{latest?.body_comfort_score || "—"}</strong><small>latest comfort</small></div></div><p className="mt-3 text-xs leading-relaxed text-stone-500">Goals and movement considerations from every selected profile will be included.</p></div> : null}

          {error ? <p aria-live="polite" className="mt-4 rounded-xl bg-[#f8e5df] px-4 py-3 text-sm text-[#925b46]">{error}</p> : null}
          {sourceReason ? <p className="planner-source-note" role="status"><strong>{source === "ai" ? "AI status" : "Why this is a template"}</strong>{sourceReason}</p> : null}
          <button className="mt-6 w-full rounded-full bg-[#294a3c] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1d3329] disabled:opacity-50" disabled={isGenerating || !studentIds.length} onClick={generatePlan} type="button">{isGenerating ? "AI is designing the class…" : "Generate a new AI class plan →"}</button>
        </section>

        <section className="planner-output-card"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow !text-[#e9bd89]">02 · Generated arc</p><h2 className="mt-2 font-serif text-3xl text-white">{plan.title || "Your sequence will appear here"}</h2></div><span className="text-2xl text-[#d99b6c]">✦</span></div>{plan.summary ? <p className="mt-3 text-sm leading-relaxed text-white/60">{plan.summary}</p> : <p className="mt-4 text-sm leading-relaxed text-white/45">Choose students and context on the left. The planner will combine their history with your teaching intention.</p>}{plan.sequence.length ? <>
          <div className="plan-proof" aria-label="Plan requirement check"><span><strong>{plan.sequence.reduce((sum, step) => sum + step.durationMinutes, 0)}</strong><small>minutes · matched</small></span><span><strong>{plan.sequence.length}</strong><small>poses / transitions</small></span><span><strong>{difficulty}/5</strong><small>requested level</small></span></div>
          <ol className="planner-sequence">{plan.sequence.map((step, index) => <li className={expandedPose === index ? "planner-pose-open" : ""} key={`${step.pose}-${index}`}><button aria-expanded={expandedPose === index} onClick={() => setExpandedPose((current) => current === index ? null : index)} type="button"><span>{String(index + 1).padStart(2, "0")}</span><PoseIllustration className="pose-thumbnail" pose={step.pose} /><div><em>{step.phase}</em><strong>{step.pose}</strong><small>{step.time} · {step.rounds}</small></div><i>⌄</i></button>{expandedPose === index ? <div className="pose-inline-detail"><p><b>{step.durationMinutes} minute teaching window · {step.rounds}</b></p><p>{step.purpose}</p><small><b>Transition:</b> {step.transition}</small></div> : null}</li>)}</ol>
          {plan.studentConsiderations.length ? <section className="student-considerations"><div className="key-pose-heading"><p className="eyebrow !text-[#e9bd89]">Individual considerations</p><span>Profile + class history</span></div>{plan.studentConsiderations.map((item) => <article key={`${item.student}-${item.concern}`}><div><strong>{item.student}</strong><small>{item.concern}</small></div><p><b>Avoid:</b> {item.avoid}</p><p><b>Offer:</b> {item.alternatives.join(" · ")}</p></article>)}</section> : null}
          {plan.keyPoses.length ? <div className="key-pose-section"><div className="key-pose-heading"><p className="eyebrow !text-[#e9bd89]">Key pose teaching notes</p><span>{plan.keyPoses.length} focus {plan.keyPoses.length === 1 ? "pose" : "poses"}</span></div><div className="grid gap-3 sm:grid-cols-2">{plan.keyPoses.map((focus) => <article className="key-pose-card" key={focus.pose}><PoseIllustration className="key-pose-visual" pose={focus.pose} /><h3>{focus.pose}</h3><p>{focus.why}</p><details open><summary>How to teach it</summary><ol>{focus.setup.map((item) => <li key={item}>{item}</li>)}</ol></details><details><summary>Cues & options</summary><ul>{focus.cues.map((item) => <li key={item}>“{item}”</li>)}{focus.options.map((item) => <li key={item}>{item}</li>)}</ul></details></article>)}</div></div> : null}
          <details className="planner-details" open><summary>Why this order</summary><p>{plan.rationale}</p></details><details className="planner-details"><summary>Prepare the room</summary><ul>{plan.preparation.map((item) => <li key={item}>{item}</li>)}</ul></details><details className="planner-details"><summary>Safety + language</summary><div className="grid gap-3 sm:grid-cols-2"><ul>{plan.safety.map((item) => <li key={item}>{item}</li>)}</ul><ul>{plan.cues.map((item) => <li key={item}>“{item}”</li>)}</ul></div></details></> : null}</section>
      </div>
    </Layout>
  );
}
