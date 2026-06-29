import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FormField, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import type { NewClassNoteInput, StudentWithStats } from "@/types/student";

const today = new Date().toISOString().slice(0, 10);

const initialForm: NewClassNoteInput = {
  student_id: "",
  class_date: today,
  class_type: "",
  today_condition: "",
  strengths: "",
  issues: "",
  follow_up: "",
  teacher_note: ""
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

      <form className="grid max-w-3xl gap-5 rounded-md border border-stone-200 bg-white p-5" onSubmit={submitForm}>
        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Student">
            <select
              className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
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
          <FormField label="Class type">
            <select
              className="min-h-11 rounded-md border border-stone-300 bg-white px-3 py-2 text-stone-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
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

        <FormField label="Today's condition">
          <TextArea name="today_condition" onChange={updateInput} placeholder="Energy, mood, soreness, limitations..." value={form.today_condition} />
        </FormField>
        <FormField label="Strengths">
          <TextArea name="strengths" onChange={updateInput} placeholder="What improved or worked well today?" value={form.strengths} />
        </FormField>
        <FormField label="Issues">
          <TextArea name="issues" onChange={updateInput} placeholder="Pain points, movement limits, confusion, fatigue..." value={form.issues} />
        </FormField>
        <FormField label="Follow up">
          <TextArea name="follow_up" onChange={updateInput} placeholder="What should be checked next class?" value={form.follow_up} />
        </FormField>
        <FormField label="Teacher note">
          <TextArea name="teacher_note" onChange={updateInput} value={form.teacher_note} />
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
