import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";

const READINESS = [
  { id: "health", title: "Review student context", detail: "Check current symptoms, previous pain, health conditions and the alternatives each student may need." },
  { id: "room", title: "Prepare the room", detail: "Place props where they are easy to reach and leave clear routes for rest or changing position." },
  { id: "levels", title: "Plan visible options", detail: "Prepare a base version first, then one progression. No student should need to earn the easier option." },
  { id: "consent", title: "Set consent language", detail: "Explain that hands-on support is optional and that students may change or skip any movement." },
  { id: "timing", title: "Protect integration time", detail: "Reserve enough time for transition, cool-down and rest instead of filling every minute with poses." }
];

const CUE_GROUPS = [
  { id: "agency", label: "Student agency", cues: ["Choose the version where your breath remains steady.", "You are welcome to stay here, make it smaller, or rest.", "Notice what is useful today rather than chasing the deepest shape."] },
  { id: "foundation", label: "Foundation", cues: ["Let the whole foot receive the floor.", "Build the base first, then decide whether more range is useful.", "Keep enough space in the joint to move back out smoothly."] },
  { id: "breath", label: "Breath and pace", cues: ["Let the next inhale begin the movement.", "Pause before the breath becomes strained.", "Move at the pace that lets you notice the transition."] },
  { id: "consent", label: "Consent and choice", cues: ["Would you like a verbal cue, a demonstration, or space to explore?", "Hands-on support is optional and you can change your answer at any time.", "Skipping a pose is a complete practice choice."] }
];

const ARC = [
  ["Arrival", "Observe breath, energy and current symptoms before adding load."],
  ["Preparation", "Rehearse the joint actions and transitions needed later in the class."],
  ["Main exploration", "Repeat a coherent pattern with bilateral balance and visible options."],
  ["Integration", "Reduce complexity, revisit the intention and leave enough time for rest."]
];

export default function TeachingToolkitPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const [cueGroup, setCueGroup] = useState("agency");

  useEffect(() => { try { setChecked(JSON.parse(window.localStorage.getItem("sattva-readiness") || "[]")); } catch { setChecked([]); } }, []);
  useEffect(() => { window.localStorage.setItem("sattva-readiness", JSON.stringify(checked)); }, [checked]);

  function toggle(id: string) { setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  const activeCues = CUE_GROUPS.find((group) => group.id === cueGroup) ?? CUE_GROUPS[0];

  return (
    <Layout title="Teaching Toolkit" action={<Link className="premium-button inline-flex" href="/teacher/planner">Open AI Class Planner →</Link>}>
      <Head><title>Teaching Toolkit | Sattva</title></Head>
      <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link href="/teacher/planner">AI Class Planner</Link><Link className="teacher-tab-active" href="/teacher/toolkit">Teaching Toolkit</Link></div>
      <section className="toolkit-hero"><div><p className="eyebrow">Practical teaching support</p><h2>Small checks that make a class feel held.</h2><p>Use this space before or after class to prepare safer options, refine language and review the shape of your sequence.</p></div><div className="toolkit-progress"><strong>{checked.length}/{READINESS.length}</strong><span>readiness checks</span><i style={{ width: `${checked.length / READINESS.length * 100}%` }} /></div></section>
      <div className="toolkit-grid">
        <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">01 · Before class</p><h2>Readiness checklist</h2></div><button onClick={() => setChecked([])} type="button">Reset</button></div><div className="toolkit-checklist">{READINESS.map((item) => { const complete = checked.includes(item.id); return <button aria-pressed={complete} className={complete ? "toolkit-check-complete" : ""} key={item.id} onClick={() => toggle(item.id)} type="button"><span>{complete ? "✓" : ""}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></button>; })}</div></section>
        <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">02 · In the room</p><h2>Inclusive cue library</h2></div></div><div className="toolkit-cue-tabs">{CUE_GROUPS.map((group) => <button aria-pressed={cueGroup === group.id} key={group.id} onClick={() => setCueGroup(group.id)} type="button">{group.label}</button>)}</div><div className="toolkit-cues">{activeCues.cues.map((cue) => <blockquote key={cue}>“{cue}”</blockquote>)}</div></section>
        <section className="toolkit-panel toolkit-panel-wide"><div className="toolkit-panel-heading"><div><p className="eyebrow">03 · Sequence review</p><h2>Four-part arc audit</h2></div><span>Teacher review</span></div><div className="toolkit-arc">{ARC.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{detail}</p></div></article>)}</div><p className="toolkit-scope-note">Teaching support only: do not diagnose or treat health conditions. Pause or adapt movements that reproduce symptoms, and refer concerns beyond your qualifications to an appropriate healthcare professional.</p></section>
      </div>
    </Layout>
  );
}
