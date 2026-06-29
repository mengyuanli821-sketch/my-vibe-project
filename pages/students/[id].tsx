import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { buildNextClassSuggestions } from "@/lib/suggestions";
import type { ClassNote, Student } from "@/types/student";

export default function StudentProfilePage() {
  const router = useRouter();
  const studentId = typeof router.query.id === "string" ? router.query.id : "";
  const [student, setStudent] = useState<Student | null>(null);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const suggestions = useMemo(() => {
    if (!student) {
      return [];
    }

    return buildNextClassSuggestions(student, classNotes);
  }, [classNotes, student]);

  return (
    <Layout
      title={student?.name ?? "Student profile"}
      action={
        <Link className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800" href="/class-notes/new">
          Add class note
        </Link>
      }
    >
      <Head>
        <title>{student ? `${student.name} | AI Student Notebook` : "Student Profile | AI Student Notebook"}</title>
      </Head>

      {isLoading ? <p className="text-stone-600">Loading profile...</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      {!isLoading && student ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-6">
            <div className="rounded-md border border-stone-200 bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold text-stone-950">Basic information</h2>
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
                  <dd className="mt-1 whitespace-pre-wrap text-sm text-stone-900">{student.body_conditions || "None recorded"}</dd>
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

            <div className="rounded-md border border-stone-200 bg-white">
              <div className="border-b border-stone-200 px-5 py-4">
                <h2 className="text-lg font-semibold text-stone-950">Class notes</h2>
              </div>
              {classNotes.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {classNotes.map((note) => (
                    <article key={note.id} className="p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-stone-950">{note.class_date || "No date"}</h3>
                        <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-700">{note.class_type || "Class"}</span>
                      </div>
                      <dl className="grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-stone-700">Condition</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-stone-900">{note.today_condition || "None recorded"}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-stone-700">Strengths</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-stone-900">{note.strengths || "None recorded"}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-stone-700">Issues</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-stone-900">{note.issues || "None recorded"}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-stone-700">Follow up</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-stone-900">{note.follow_up || "None recorded"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="font-medium text-stone-700">Teacher note</dt>
                          <dd className="mt-1 whitespace-pre-wrap text-stone-900">{note.teacher_note || "None recorded"}</dd>
                        </div>
                      </dl>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-6 text-sm text-stone-600">No class notes yet.</div>
              )}
            </div>
          </section>

          <aside className="rounded-md border border-teal-100 bg-teal-50 p-5 lg:sticky lg:top-5 lg:self-start">
            <h2 className="mb-3 text-lg font-semibold text-stone-950">Next-class suggestions</h2>
            <ul className="grid gap-3 text-sm text-stone-800">
              {suggestions.map((suggestion) => (
                <li className="rounded-md bg-white px-3 py-2" key={suggestion}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </Layout>
  );
}
