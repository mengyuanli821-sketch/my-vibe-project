import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FormField, MultiSelect, RatingSelector, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import { CLASS_ISSUE_OPTIONS, toggleSelection } from "@/lib/options";
import type { NewClassNoteInput, StudentWithStats } from "@/types/student";

const today = new Date().toISOString().slice(0, 10);
const currentTime = new Date().toTimeString().slice(0, 5);

const initialForm: NewClassNoteInput = {
  student_id: "",
  class_date: today,
  class_time: currentTime,
  class_type: "",
  today_condition: "",
  strengths: "",
  issues: "",
  follow_up: "",
  teacher_note: "",
  energy_score: "3",
  body_comfort_score: "3",
  focus_score: "3"
};

export default function NewClassNotePage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load students");
        }

        setStudents(data.students);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load students");
      } finally {
        setIsLoadingStudents(false);
      }
    }

    loadStudents();
  }, []);

  useEffect(() => {
    const selectedStudent = typeof router.query.student_id === "string" ? router.query.student_id : "";
    if (selectedStudent) {
      setForm((current) => ({ ...current, student_id: selectedStudent }));
    }
  }, [router.query.student_id]);

  function updateInput(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/class-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create class note");
      }

      router.push(`/students/${data.classNote.student_id}`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create class note");
      setIsSaving(false);
    }
  }

  return (
    <Layout title="New class note">
      <Head>
        <title>New Class Note | AI Student Notebook</title>
      </Head>

      <form className="form-shell" onSubmit={submitForm}>
        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Student">
            <select
              className="form-control"
              disabled={isLoadingStudents}
              name="student_id"
              onChange={updateInput}
              required
              value={form.student_id}
            >
              <option value="">{isLoadingStudents ? "Loading students..." : "Select a student"}</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Class date">
            <TextInput name="class_date" onChange={updateInput} required type="date" value={form.class_date} />
          </FormField>
          <FormField label="Class time">
            <TextInput name="class_time" onChange={updateInput} type="time" value={form.class_time} />
          </FormField>
          <FormField label="Class type">
            <select
              className="form-control"
              name="class_type"
              onChange={updateInput}
              value={form.class_type}
            >
              <option value="">Not set</option>
              <option value="Yoga">Yoga</option>
              <option value="Pilates">Pilates</option>
              <option value="Barre">Barre</option>
              <option value="Private session">Private session</option>
              <option value="Group class">Group class</option>
            </select>
          </FormField>
        </div>

        <section>
          <div className="mb-3">
            <h2 className="font-serif text-xl text-[#294a3c]">Class pulse</h2>
            <p className="mt-1 text-sm text-stone-500">A quick check-in across body, energy and mind.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <RatingSelector label="Energy" lowLabel="Depleted" highLabel="Vibrant" onChange={(value) => setForm((current) => ({ ...current, energy_score: value }))} value={form.energy_score} />
            <RatingSelector label="Body comfort" lowLabel="Sensitive" highLabel="Easeful" onChange={(value) => setForm((current) => ({ ...current, body_comfort_score: value }))} value={form.body_comfort_score} />
            <RatingSelector label="Focus" lowLabel="Scattered" highLabel="Present" onChange={(value) => setForm((current) => ({ ...current, focus_score: value }))} value={form.focus_score} />
          </div>
        </section>

        <FormField label="Areas to support" hint="Choose all observations from today's practice.">
          <MultiSelect
            onToggle={(option) => setForm((current) => ({ ...current, issues: toggleSelection(current.issues, option) }))}
            options={CLASS_ISSUE_OPTIONS}
            value={form.issues}
          />
        </FormField>
        <FormField label="Class highlight" hint="One short note is enough.">
          <TextInput name="strengths" onChange={updateInput} placeholder="What opened, improved or felt joyful?" value={form.strengths} />
        </FormField>
        <FormField label="Teacher reflection" hint="Optional cue, intention or follow-up for next time.">
          <TextArea name="teacher_note" onChange={updateInput} placeholder="A cue to remember, a theme to revisit, or a moment of insight…" value={form.teacher_note} />
        </FormField>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={isSaving || isLoadingStudents}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save class note"}
          </button>
          <button
            className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            onClick={() => router.push("/students")}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </Layout>
  );
}
