import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ClassStatusLight } from "@/components/ClassStatusLight";
import { getClassStatus } from "@/lib/classStatus";
import { buildNextClassSuggestions, buildPracticeGuide, type IssueProgress, type PracticeGuide } from "@/lib/suggestions";
import { splitSelections } from "@/lib/options";
import type { ClassNote, Student } from "@/types/student";

function ScorePill({ label, value }: { label: string; value: string }) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#d9d3c9] bg-[#fffdf9] py-1 pl-2 pr-3 text-xs text-stone-600">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#557a68] font-bold text-white">{value}</span>
      {label}
    </div>
  );
}

export default function StudentProfilePage() {
  const router = useRouter();
  const studentId = typeof router.query.id === "string" ? router.query.id : "";
  const [student, setStudent] = useState<Student | null>(null);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatedGuide, setGeneratedGuide] = useState<PracticeGuide | null>(null);
  const [issueProgress, setIssueProgress] = useState<IssueProgress[]>([]);
  const [generationSource, setGenerationSource] = useState<"loading" | "ai" | "adaptive">("loading");

  useEffect(() => {
    if (!studentId) {
      return;
    }

    async function loadProfile() {
      setIsLoading(true);
      setError("");

      try {
        const [studentResponse, notesResponse] = await Promise.all([
          fetch(`/api/students/${studentId}`),
          fetch(`/api/class-notes?student_id=${studentId}`)
        ]);
        const studentData = await studentResponse.json();
        const notesData = await notesResponse.json();

        if (!studentResponse.ok) {
          throw new Error(studentData.error ?? "Could not load student");
        }

        if (!notesResponse.ok) {
          throw new Error(notesData.error ?? "Could not load class notes");
        }

        setStudent(studentData.student);
        setClassNotes(notesData.classNotes);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [studentId]);

  useEffect(() => {
    if (!studentId) return;
    setGeneratedGuide(null);
    setIssueProgress([]);
    setGenerationSource("loading");

    fetch(`/api/recommendations?student_id=${studentId}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not generate guide")))
      .then((data) => {
        setGeneratedGuide(data.practiceGuide);
        setIssueProgress(data.issueProgress ?? []);
        setGenerationSource(data.source === "ai" ? "ai" : "adaptive");
      })
      .catch(() => setGenerationSource("adaptive"));
  }, [studentId]);

  const suggestions = useMemo(() => {
    if (!student) {
      return [];
    }

    return buildNextClassSuggestions(student, classNotes);
  }, [classNotes, student]);

  const localPracticeGuide = useMemo(() => student ? buildPracticeGuide(student, classNotes) : null, [classNotes, student]);
  const practiceGuide = generatedGuide ?? localPracticeGuide;

  return (
    <Layout
      title={student?.name ?? "Student profile"}
      action={
        <div className="flex flex-wrap gap-2">
          <Link className="rounded-full border border-[#cec5b7] bg-white/75 px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-white" href="/students">← Back to students</Link>
          <Link className="rounded-full bg-[#557a68] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#416353]" href={`/class-notes/new?student_id=${studentId}`}>Add class note</Link>
        </div>
      }
    >
      <Head>
        <title>{student ? `${student.name} | AI Student Notebook` : "Student Profile | AI Student Notebook"}</title>
      </Head>

      {isLoading ? <p className="text-stone-600">Loading profile...</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      {!isLoading && student ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <section className="grid gap-6">
            <div className="rounded-2xl border border-[#ddd5c8] bg-white/90 p-5 shadow-[0_12px_40px_rgba(57,71,61,0.05)]">
              <h2 className="mb-4 font-serif text-xl text-[#294a3c]">Practice profile</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Contact</dt>
                  <dd className="mt-1 text-sm text-stone-900">{student.contact || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Age range</dt>
                  <dd className="mt-1 text-sm text-stone-900">{student.age_range || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Experience</dt>
                  <dd className="mt-1 text-sm text-stone-900">{student.experience_level || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Created</dt>
                  <dd className="mt-1 text-sm text-stone-900">{student.created_at ? new Date(student.created_at).toLocaleDateString() : "Not set"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Goals</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-stone-900">{student.goals || "None recorded"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Body conditions</dt>
                  <dd className="mt-2 flex flex-wrap gap-2 text-sm text-stone-900">
                    {splitSelections(student.body_conditions).length ? splitSelections(student.body_conditions).map((condition) => (
                      <span className="rounded-full bg-[#f2e8dc] px-3 py-1 text-xs text-[#875c40]" key={condition}>{condition}</span>
                    )) : "None recorded"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Injury notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-stone-900">{student.injury_notes || "None recorded"}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wide text-stone-500">Teacher notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-stone-900">{student.teacher_notes || "None recorded"}</dd>
                </div>
              </dl>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#ddd5c8] bg-white/90">
              <div className="border-b border-stone-200 px-5 py-4">
                <h2 className="font-serif text-xl text-[#294a3c]">Practice journey</h2>
              </div>
              {classNotes.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {classNotes.map((note) => (
                    <article key={note.id} className="p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-stone-950">{note.class_date || "No date"}{note.class_time ? ` · ${note.class_time}` : ""}</h3>
                        <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-700">{note.class_type || "Class"}</span>
                        <ClassStatusLight compact status={getClassStatus(note)} />
                      </div>
                      <div className="mb-4 flex flex-wrap gap-2">
                        <ScorePill label="Energy" value={note.energy_score} />
                        <ScorePill label="Comfort" value={note.body_comfort_score} />
                        <ScorePill label="Focus" value={note.focus_score} />
                      </div>
                      {note.issues ? (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {splitSelections(note.issues).map((issue) => <span className="rounded-full bg-[#f3eee6] px-2.5 py-1 text-xs text-stone-600" key={issue}>{issue}</span>)}
                        </div>
                      ) : null}
                      {note.strengths ? <p className="text-sm text-stone-800"><span className="font-medium">Highlight · </span>{note.strengths}</p> : null}
                      {note.teacher_note || note.follow_up ? <p className="mt-2 whitespace-pre-wrap text-sm italic text-stone-600">“{note.teacher_note || note.follow_up}”</p> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-6 text-sm text-stone-600">No class notes yet.</div>
              )}
            </div>
          </section>

          <aside className="overflow-hidden rounded-2xl border border-[#cfdad2] bg-[#edf3ee]/90 lg:sticky lg:top-5 lg:self-start">
            <div className="border-b border-[#cfdad2] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8b6647]">Intelligent planning</p>
              <h2 className="mt-1 font-serif text-2xl text-[#294a3c]">Next practice</h2>
              <p className="mt-2 text-xs leading-relaxed text-stone-600">Built from the full body profile, complete history and the most recent trend.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#557a68]">
                  {generationSource === "loading" ? "Refining plan…" : generationSource === "ai" ? "AI generated" : "Adaptive intelligence"}
                </span>
                <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-stone-500">Complete history</span>
              </div>
            </div>
            <ul className="grid gap-3 p-4 text-sm text-stone-800">
              {suggestions.map((suggestion) => (
                <li className={`suggestion-card suggestion-${suggestion.tone}`} key={suggestion.title}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-60">{suggestion.category}</span>
                  <h3 className="mt-1 font-semibold text-[#294a3c]">{suggestion.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-600">{suggestion.detail}</p>
                </li>
              ))}
            </ul>
          </aside>

          {practiceGuide ? (
            <section className="overflow-hidden rounded-2xl border border-[#ddd5c8] bg-white/90 lg:col-span-2">
              <div className="grid gap-5 border-b border-[#e5ded4] bg-gradient-to-r from-[#f7f1e8] to-[#edf3ee] px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="eyebrow">Suggested sequence · teacher review required</p>
                  <h2 className="mt-2 font-serif text-3xl text-[#294a3c]">{practiceGuide.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">{practiceGuide.intention}</p>
                </div>
                <span className="rounded-full border border-[#d5cabb] bg-white/70 px-3 py-1.5 text-xs text-stone-600">Adapt to today’s check-in</span>
              </div>

              <div className="p-5 sm:p-6">
                {issueProgress.length ? (
                  <div className="mb-6 rounded-xl border border-[#e4ddd3] bg-[#fbf8f2] p-4">
                    <div className="flex items-center justify-between gap-3"><h3 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-600">Issue evolution</h3><span className="text-[10px] text-stone-400">Based on complete class history</span></div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {issueProgress.map((item) => (
                        <span className={`progress-chip progress-${item.status}`} key={item.issue} title={item.evidence}>
                          {item.issue} · {item.status}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <ol className="sequence-track">
                  {practiceGuide.sequence.map((step, index) => (
                    <li className="sequence-step" key={step.pose}>
                      <span className="sequence-number">{index + 1}</span>
                      <div><h3 className="text-sm font-semibold text-[#294a3c]">{step.pose}</h3><p className="mt-1 text-xs leading-relaxed text-stone-500">{step.time} · {step.purpose}</p></div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 grid gap-3 lg:grid-cols-3">
                  <details className="teaching-detail" open>
                    <summary>Anatomy lens</summary>
                    <p>{practiceGuide.anatomy}</p>
                  </details>
                  <details className="teaching-detail">
                    <summary>Injury prevention</summary>
                    <ul>{practiceGuide.safety.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                  <details className="teaching-detail">
                    <summary>Language & cues</summary>
                    <ul>{practiceGuide.cues.map((item) => <li key={item}>“{item}”</li>)}</ul>
                  </details>
                </div>

                <p className="mt-5 border-t border-[#eee8df] pt-4 text-[11px] leading-relaxed text-stone-500">
                  Educational planning support only—not diagnosis or treatment. Ask for consent before hands-on adjustments, modify for the individual, and refer concerns beyond your qualifications to a healthcare professional. Safety basis: <a className="underline" href="https://www.nccih.nih.gov/health/yoga-effectiveness-and-safety" rel="noreferrer" target="_blank">NCCIH</a> and <a className="underline" href="https://yogaalliance.org/policies-priorities-progress/scope-of-practice/" rel="noreferrer" target="_blank">Yoga Alliance scope of practice</a>.
                </p>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </Layout>
  );
}
