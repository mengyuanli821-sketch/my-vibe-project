import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState, type CSSProperties } from "react";
import { FormField, MultiSelect, RatingSelector, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import { toggleSelection } from "@/lib/options";
import { EMPTY_TEACHER_PROFILE } from "@/lib/teacherConstants";
import type { TeacherAdvice, TeacherProfile } from "@/types/teacher";

const STYLES = ["Hatha", "Vinyasa", "Yin", "Restorative", "Power", "Barre", "Private sessions"];
const SPECIALTIES = ["Beginners", "Mobility", "Strength", "Stress care", "Older adults", "Prenatal", "Breathwork", "Yoga philosophy"];

export default function TeacherStudioPage() {
  const [profile, setProfile] = useState<TeacherProfile>(EMPTY_TEACHER_PROFILE);
  const [advice, setAdvice] = useState<TeacherAdvice | null>(null);
  const [source, setSource] = useState<"ai" | "adaptive">("adaptive");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadAdvice() {
    const response = await fetch("/api/teacher-recommendations");
    if (response.ok) {
      const data = await response.json();
      setAdvice(data.advice);
      setSource(data.source === "ai" ? "ai" : "adaptive");
    }
  }

  useEffect(() => {
    Promise.all([fetch("/api/teacher-profile"), fetch("/api/teacher-recommendations")])
      .then(async ([profileResponse, adviceResponse]) => {
        if (profileResponse.ok) setProfile((await profileResponse.json()).profile);
        if (adviceResponse.ok) {
          const data = await adviceResponse.json();
          setAdvice(data.advice);
          setSource(data.source === "ai" ? "ai" : "adaptive");
        }
      });
  }, []);

  function updateInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/teacher-profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) });
    if (response.ok) {
      setProfile((await response.json()).profile);
      setMessage("Studio profile saved. Your coaching focus has been refreshed.");
      await loadAdvice();
    } else {
      setMessage("Could not save the profile. Please try again.");
    }
    setSaving(false);
  }

  const capabilities = [
    ["Sequencing", profile.sequencing_score], ["Anatomy", profile.anatomy_score], ["Cueing", profile.cueing_score],
    ["Observation", profile.observation_score], ["Inclusive options", profile.accessibility_score]
  ];

  return (
    <Layout title="Teacher Studio" action={<div className="flex flex-wrap gap-2"><Link className="rounded-full border border-[#cec5b7] bg-white/75 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-white" href="/teacher/planner">Open AI Class Planner</Link><button className="premium-button" disabled={saving} form="teacher-profile" type="submit">{saving ? "Saving…" : "Save & refresh coach"}</button></div>}>
      <Head><title>Teacher Studio | Sattva</title></Head>

      <div className="teacher-tabs" aria-label="Teacher workspace sections"><Link className="teacher-tab-active" href="/teacher">Capability profile</Link><Link href="/teacher/planner">AI Class Planner</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link></div>

      <section className="teacher-hero">
        <div><p className="eyebrow">Your teaching practice</p><h2 className="mt-3 max-w-2xl font-serif text-3xl text-white sm:text-5xl">The teacher is part of the practice, too.</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">Name what feels natural, notice the edge you are growing into, and turn reflection into one observable experiment.</p></div>
        <div className="capability-orbit" aria-label="Capability overview">
          {capabilities.map(([label, value], index) => <span key={label} style={{ "--capability": Number(value), "--index": index } as CSSProperties}><strong>{value}</strong><small>{label}</small></span>)}
          <i>TEACH</i>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <form className="teacher-form" id="teacher-profile" onSubmit={saveProfile}>
          {message ? <p aria-live="polite" className="rounded-xl bg-[#edf3ee] px-4 py-3 text-sm text-[#416353]">{message}</p> : null}
          <section className="studio-section">
            <div className="section-number">01</div><div className="section-content"><h2>Teaching identity</h2><p>The experience and traditions that shape how you hold a room.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2"><FormField label="Teacher name"><TextInput name="name" onChange={updateInput} value={profile.name} /></FormField><FormField label="Years teaching"><TextInput name="years_experience" onChange={updateInput} type="number" value={profile.years_experience} /></FormField></div>
              <div className="mt-4"><FormField label="Certifications & lineages"><TextInput name="certifications" onChange={updateInput} placeholder="RYT 200, Yin training, Pilates…" value={profile.certifications} /></FormField></div>
            </div>
          </section>

          <section className="studio-section">
            <div className="section-number">02</div><div className="section-content"><h2>Ways you teach</h2><p>Select the modes and communities that are already part of your practice.</p>
              <div className="mt-5"><FormField label="Primary styles"><MultiSelect onToggle={(option) => setProfile((current) => ({ ...current, primary_styles: toggleSelection(current.primary_styles, option) }))} options={STYLES} value={profile.primary_styles} /></FormField></div>
              <div className="mt-5"><FormField label="Teaching specialties"><MultiSelect onToggle={(option) => setProfile((current) => ({ ...current, specialties: toggleSelection(current.specialties, option) }))} options={SPECIALTIES} value={profile.specialties} /></FormField></div>
            </div>
          </section>

          <section className="studio-section">
            <div className="section-number">03</div><div className="section-content"><h2>Capability compass</h2><p>Self-rate honestly. This is a direction finder, not a performance score.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RatingSelector highLabel="Confident" label="Sequencing" lowLabel="Learning" onChange={(value) => setProfile((current) => ({ ...current, sequencing_score: value }))} value={profile.sequencing_score} />
                <RatingSelector highLabel="Confident" label="Anatomy" lowLabel="Learning" onChange={(value) => setProfile((current) => ({ ...current, anatomy_score: value }))} value={profile.anatomy_score} />
                <RatingSelector highLabel="Confident" label="Cueing" lowLabel="Learning" onChange={(value) => setProfile((current) => ({ ...current, cueing_score: value }))} value={profile.cueing_score} />
                <RatingSelector highLabel="Confident" label="Observation" lowLabel="Learning" onChange={(value) => setProfile((current) => ({ ...current, observation_score: value }))} value={profile.observation_score} />
                <RatingSelector highLabel="Confident" label="Inclusive options" lowLabel="Learning" onChange={(value) => setProfile((current) => ({ ...current, accessibility_score: value }))} value={profile.accessibility_score} />
              </div>
            </div>
          </section>

          <section className="studio-section">
            <div className="section-number">04</div><div className="section-content"><h2>Reflection</h2><p>Give the coach the language and values behind your choices.</p>
              <div className="mt-5 grid gap-4"><FormField label="Teaching philosophy"><TextArea name="teaching_philosophy" onChange={updateInput} value={profile.teaching_philosophy} /></FormField><FormField label="What feels strong"><TextArea name="strengths" onChange={updateInput} value={profile.strengths} /></FormField><FormField label="Where you want to grow"><TextArea name="growth_edges" onChange={updateInput} value={profile.growth_edges} /></FormField></div>
            </div>
          </section>
        </form>

        <aside className="teacher-coach">
          <div className="coach-glow" /><div className="relative z-[1]"><div className="flex items-center justify-between"><p className="eyebrow !text-[#e9bd89]">Teaching coach</p><span className="rounded-full bg-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-white/65">{source === "ai" ? "AI generated" : "Adaptive"}</span></div>
          {advice ? <><h2 className="mt-5 font-serif text-3xl text-white">{advice.headline}</h2><p className="mt-3 text-sm leading-relaxed text-white/60">{advice.insight}</p>
            <div className="mt-5 flex flex-wrap gap-2">{advice.strengths.map((strength) => <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75" key={strength}>{strength}</span>)}</div>
            <div className="mt-6 grid gap-3">{advice.priorities.map((priority, index) => <article className="coach-priority" key={priority.title}><span>0{index + 1}</span><h3>{priority.title}</h3><p>{priority.why}</p><strong>{priority.practice}</strong></article>)}</div>
            <div className="mt-5 rounded-2xl bg-[#d99b6c] p-4 text-[#2d2119]"><p className="text-[9px] font-bold uppercase tracking-[0.16em]">Next-class experiment</p><p className="mt-2 text-sm font-medium leading-relaxed">{advice.nextClassExperiment}</p></div>
            <blockquote className="mt-5 border-l border-white/20 pl-4 font-serif text-lg italic leading-relaxed text-white/65">{advice.reflectionPrompt}</blockquote></> : <p className="mt-5 text-sm text-white/60">Preparing your coaching reflection…</p>}</div>
        </aside>
      </div>
    </Layout>
  );
}
