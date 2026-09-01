import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { FormField, MultiSelect, TextArea, TextInput } from "@/components/FormField";
import { BodyMap } from "@/components/BodyMap";
import { Layout } from "@/components/Layout";
import { BODY_CONDITION_OPTIONS, toggleSelection } from "@/lib/options";
import type { NewStudentInput } from "@/types/student";

const initialForm: NewStudentInput = {
  name: "",
  contact: "",
  age_range: "",
  experience_level: "",
  goals: "",
  body_conditions: "",
  injury_notes: "",
  teacher_notes: ""
};

export default function NewStudentPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

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
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not create student");
      }

      router.push("/students");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not create student");
      setIsSaving(false);
    }
  }

  return (
    <Layout title="New student">
      <Head>
        <title>New Student | AI Student Notebook</title>
      </Head>

      <form className="form-shell" onSubmit={submitForm}>
        {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Name">
            <TextInput name="name" onChange={updateInput} required value={form.name} />
          </FormField>
          <FormField label="Contact">
            <TextInput name="contact" onChange={updateInput} placeholder="Email, phone, or Line" value={form.contact} />
          </FormField>
          <FormField label="Age range">
            <select
              className="form-control"
              name="age_range"
              onChange={updateInput}
              value={form.age_range}
            >
              <option value="">Not set</option>
              <option value="Under 20">Under 20</option>
              <option value="20s">20s</option>
              <option value="30s">30s</option>
              <option value="40s">40s</option>
              <option value="50s">50s</option>
              <option value="60+">60+</option>
            </select>
          </FormField>
          <FormField label="Experience level">
            <select
              className="form-control"
              name="experience_level"
              onChange={updateInput}
              value={form.experience_level}
            >
              <option value="">Not set</option>
              <option value="Beginner">Beginner</option>
              <option value="Some experience">Some experience</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </FormField>
        </div>

        <FormField label="Goals">
          <TextArea name="goals" onChange={updateInput} placeholder="Strength, flexibility, stress relief, posture..." value={form.goals} />
        </FormField>
        <FormField label="Areas that need support" hint="Select one or more areas on the front or back body. This is an observation tool, not a diagnosis.">
          <BodyMap
            onToggle={(option) => setForm((current) => ({ ...current, body_conditions: toggleSelection(current.body_conditions, option) }))}
            value={form.body_conditions}
          />
        </FormField>
        <FormField label="Wellbeing context" hint="Add any broader context that may affect practice.">
          <MultiSelect
            onToggle={(option) => setForm((current) => ({ ...current, body_conditions: toggleSelection(current.body_conditions, option) }))}
            options={BODY_CONDITION_OPTIONS}
            value={form.body_conditions}
          />
        </FormField>
        <FormField label="Injury details" hint="Optional details that are not covered by the tags above.">
          <TextArea name="injury_notes" onChange={updateInput} value={form.injury_notes} />
        </FormField>
        <FormField label="Teacher notes">
          <TextArea name="teacher_notes" onChange={updateInput} value={form.teacher_notes} />
        </FormField>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save student"}
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
