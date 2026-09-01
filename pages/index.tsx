import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { TeachingFlowVisual } from "@/components/TeachingFlowVisual";
import type { StudentWithStats } from "@/types/student";

const GUIDANCE = [
  { number: "01", title: "Know the person", detail: "Record goals, experience and areas that need support before planning shapes.", href: "/students/new", action: "Add a student" },
  { number: "02", title: "Observe the practice", detail: "After class, capture three scores and only the details that will matter next time.", href: "/class-notes/new", action: "Record a class" },
  { number: "03", title: "Teach the next breath", detail: "Open a profile to review trends, safe sequence ideas and concise teaching cues.", href: "/students", action: "Plan next class" }
];

export default function HomePage() {
  const [students, setStudents] = useState<StudentWithStats[]>([]);

  useEffect(() => {
    fetch("/api/students")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Could not load students")))
      .then((data) => setStudents(data.students))
      .catch(() => setStudents([]));
  }, []);

  const totalClasses = students.reduce((total, student) => total + student.class_count, 0);
  const recentStudents = [...students]
    .filter((student) => student.last_class_date)
    .sort((a, b) => `${b.last_class_date}T${b.last_class_time}`.localeCompare(`${a.last_class_date}T${a.last_class_time}`))
    .slice(0, 3);

  return (
    <Layout>
      <Head><title>Sattva | Teaching guidance</title></Head>

      <section className="home-hero">
        <div className="max-w-2xl">
          <p className="eyebrow">A mindful teaching companion</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-[#294a3c] sm:text-6xl">Hold every student<br />with clarity and care.</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone-600">A quiet place to remember the body, notice the practice and shape the next class—without losing the human in the notes.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link className="rounded-full bg-[#557a68] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#416353]" href="/class-notes/new">Record today’s class</Link>
            <Link className="rounded-full border border-[#cfc6b8] bg-white/70 px-5 py-3 text-sm font-semibold text-[#405a4d] hover:bg-white" href="/students">View students</Link>
          </div>
        </div>
        <TeachingFlowVisual />
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><p className="eyebrow">Guidance</p><h2 className="mt-1 font-serif text-3xl text-[#294a3c]">A simple teaching rhythm</h2></div>
          <p className="hidden max-w-xs text-right text-xs leading-relaxed text-stone-500 sm:block">Short, grouped steps keep the notebook useful during a real teaching day.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {GUIDANCE.map((item) => (
            <article className="guidance-card" key={item.number}>
              <span className="font-serif text-3xl text-[#d49a68]">{item.number}</span>
              <h3 className="mt-5 font-serif text-xl text-[#294a3c]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.detail}</p>
              <Link className="mt-5 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[#557a68] hover:underline" href={item.href}>{item.action} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-[#ead7c3] bg-[#f7ede3]/80 p-5">
          <p className="eyebrow">Your sanctuary</p>
          <div className="mt-4 flex gap-8">
            <div><p className="font-serif text-4xl text-[#294a3c]">{students.length}</p><p className="text-xs text-stone-500">students</p></div>
            <div><p className="font-serif text-4xl text-[#294a3c]">{totalClasses}</p><p className="text-xs text-stone-500">classes</p></div>
          </div>
          <p className="mt-5 border-t border-[#e4cfba] pt-4 text-xs leading-relaxed text-stone-600">Health notes support observation and modification; they do not replace assessment by a qualified healthcare professional.</p>
        </div>
        <div className="rounded-2xl border border-[#ddd5c8] bg-white/80 p-5">
          <div className="flex items-center justify-between"><h2 className="font-serif text-xl text-[#294a3c]">Recent practice</h2><Link className="text-xs font-semibold text-[#557a68]" href="/students">All students →</Link></div>
          <div className="mt-3 divide-y divide-[#eee8df]">
            {recentStudents.length ? recentStudents.map((student) => (
              <Link className="flex items-center justify-between gap-4 py-3 hover:text-[#557a68]" href={`/students/${student.id}`} key={student.id}>
                <span className="text-sm font-medium">{student.name}</span>
                <span className="text-xs text-stone-500">{student.last_class_date}{student.last_class_time ? ` · ${student.last_class_time}` : ""}</span>
              </Link>
            )) : <p className="py-5 text-sm text-stone-500">Your recent classes will appear here.</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
}
