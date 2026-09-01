import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ClassStatusLight } from "@/components/ClassStatusLight";
import type { StudentWithStats } from "@/types/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => student.name.toLowerCase().includes(query));
  }, [search, students]);

  const totalClasses = students.reduce((total, student) => total + student.class_count, 0);

  return (
    <Layout
      title="Students"
      action={
        <Link className="rounded-full bg-[#557a68] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#416353]" href="/students/new">
          New student
        </Link>
      }
    >
      <Head>
        <title>Students | AI Student Notebook</title>
      </Head>

      {!isLoading && !error ? (
        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ddd5c8] bg-white/80 p-4">
            <p className="text-xs text-stone-500">Community</p>
            <p className="mt-1 font-serif text-3xl text-[#294a3c]">{students.length}</p>
            <p className="text-xs text-stone-500">students held in care</p>
          </div>
          <div className="rounded-2xl border border-[#ddd5c8] bg-white/80 p-4">
            <p className="text-xs text-stone-500">Practice journey</p>
            <p className="mt-1 font-serif text-3xl text-[#294a3c]">{totalClasses}</p>
            <p className="text-xs text-stone-500">classes remembered</p>
          </div>
          <div className="rounded-2xl border border-[#ead7c3] bg-[#f7ede3]/80 p-4">
            <p className="text-xs text-[#8b6647]">Today’s intention</p>
            <p className="mt-2 font-serif text-lg italic text-[#6e4f39]">Teach the person, not the pose.</p>
          </div>
        </section>
      ) : null}

      <div className="mb-5 max-w-md">
        <label className="grid gap-2 text-sm font-medium text-stone-800">
          <span>Search by name</span>
          <input
            className="form-control"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Student name"
            value={search}
          />
        </label>
      </div>

      {isLoading ? <p className="text-stone-600">Loading students...</p> : null}
      {error ? <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}

      {!isLoading && !error ? (
        <div className="overflow-hidden rounded-2xl border border-[#ddd5c8] bg-white/90 shadow-[0_12px_40px_rgba(57,71,61,0.04)]">
          <table className="w-full min-w-[1020px] border-collapse text-left text-sm">
            <thead className="bg-[#f1eee7] text-xs uppercase tracking-wide text-stone-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Experience</th>
                <th className="px-4 py-3 font-semibold">Goals</th>
                <th className="px-4 py-3 font-semibold">Body conditions</th>
                <th className="px-4 py-3 font-semibold">Last class date</th>
                <th className="px-4 py-3 font-semibold">Last class time</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Classes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-stone-950">
                    <Link className="text-teal-800 hover:underline" href={`/students/${student.id}`}>
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{student.experience_level || "Not set"}</td>
                  <td className="px-4 py-3 text-stone-700">{student.goals || "None recorded"}</td>
                  <td className="px-4 py-3 text-stone-700">{student.body_conditions || "None recorded"}</td>
                  <td className="px-4 py-3 text-stone-700">{student.last_class_date || "No classes yet"}</td>
                  <td className="px-4 py-3 text-stone-700">{student.last_class_time || "—"}</td>
                  <td className="px-4 py-3"><ClassStatusLight compact status={student.last_class_status} /></td>
                  <td className="px-4 py-3 text-stone-700">{student.class_count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 ? (
            <div className="border-t border-stone-100 px-4 py-6 text-sm text-stone-600">No students found.</div>
          ) : null}
        </div>
      ) : null}
    </Layout>
  );
}
