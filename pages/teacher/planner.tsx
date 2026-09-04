import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormField, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import { PoseIllustration } from "@/components/PoseIllustration";
import { POSE_LIBRARY } from "@/lib/poseLibrary";
import { splitSelections, toggleSelection } from "@/lib/options";
import type { StudentWithStats } from "@/types/student";

type SequenceSettings = Record<string, { minutes: number; phase: string; note: string }>;
const PHASES = ["進入課堂", "暖身準備", "主要探索", "緩和整合", "休息"];

export default function ClassPlannerPage() {
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [sequence, setSequence] = useState<string[]>([]);
  const [settings, setSettings] = useState<SequenceSettings>({});
  const [dragged, setDragged] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [duration, setDuration] = useState("60");
  const [classStyle, setClassStyle] = useState("Hatha");
  const [props, setProps] = useState("");
  const [intention, setIntention] = useState("");
  const [saved, setSaved] = useState(false);
  const studentPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/students").then((response) => response.json()).then((data) => setStudents(data.students ?? [])).catch(() => setStudents([]));
    try {
      setSequence(JSON.parse(window.localStorage.getItem("sattva-pose-shortlist") || "[]"));
      const draft = JSON.parse(window.localStorage.getItem("sattva-class-draft") || "{}");
      if (draft.title) setTitle(draft.title); if (draft.theme) setTheme(draft.theme); if (draft.duration) setDuration(draft.duration);
      if (draft.classStyle) setClassStyle(draft.classStyle); if (draft.props) setProps(draft.props); if (draft.intention) setIntention(draft.intention);
      if (draft.studentIds) setStudentIds(draft.studentIds); if (draft.settings) setSettings(draft.settings);
    } catch { /* Keep a clean draft if stored data is malformed. */ }
  }, []);

  useEffect(() => {
    function closePicker(event: PointerEvent) { if (!studentPickerRef.current?.contains(event.target as Node)) setStudentPickerOpen(false); }
    document.addEventListener("pointerdown", closePicker);
    return () => document.removeEventListener("pointerdown", closePicker);
  }, []);
  useEffect(() => { window.localStorage.setItem("sattva-pose-shortlist", JSON.stringify(sequence)); }, [sequence]);

  const selectedStudents = students.filter((student) => studentIds.includes(student.id));
  const poses = useMemo(() => sequence.map((id) => POSE_LIBRARY.find((pose) => pose.id === id)).filter((pose): pose is (typeof POSE_LIBRARY)[number] => Boolean(pose)), [sequence]);
  const plannedMinutes = poses.reduce((total, pose) => total + (settings[pose.id]?.minutes ?? 3), 0);

  function updatePose(id: string, patch: Partial<SequenceSettings[string]>) { setSettings((current) => { const existing = current[id] ?? { minutes: 3, phase: "主要探索", note: "" }; return { ...current, [id]: { ...existing, ...patch } }; }); setSaved(false); }
  function movePose(id: string, targetId: string) { if (id === targetId) return; setSequence((current) => { const next = [...current]; const from = next.indexOf(id); const to = next.indexOf(targetId); if (from < 0 || to < 0) return current; next.splice(from, 1); next.splice(to, 0, id); return next; }); setSaved(false); }
  function nudgePose(id: string, direction: -1 | 1) { setSequence((current) => { const from = current.indexOf(id); const to = from + direction; if (from < 0 || to < 0 || to >= current.length) return current; const next = [...current]; [next[from], next[to]] = [next[to], next[from]]; return next; }); setSaved(false); }
  function removePose(id: string) { setSequence((current) => current.filter((item) => item !== id)); setSaved(false); }
  function saveDraft() { window.localStorage.setItem("sattva-class-draft", JSON.stringify({ title, theme, duration, classStyle, props, intention, studentIds, settings })); window.localStorage.setItem("sattva-pose-shortlist", JSON.stringify(sequence)); setSaved(true); }

  return <Layout title="課程編排" action={<Link className="premium-button inline-flex" href="/teacher/toolkit">＋ 從體式庫加入</Link>}>
    <Head><title>課程編排 | Sattva</title></Head>
    <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link className="teacher-tab-active" href="/teacher/planner">課程編排</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link></div>
    <section className="planner-intro"><div><p className="eyebrow">Teacher-led sequencing</p><h2 className="mt-2 font-serif text-3xl text-[#294a3c] sm:text-4xl">把備選體式，排成一堂完整的課。</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">從體式庫加入動作，依教學判斷安排順序、階段、時間與個別口令。草稿只保存在這台裝置。</p></div><span className="planner-sanskrit">krama<br /><small>one step at a time</small></span></section>
    <div className="planner-workspace mt-6">
      <section className="planner-form-card">
        <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">01 · Class context</p><h2 className="mt-1 font-serif text-2xl text-[#294a3c]">課堂設定</h2></div><span className="planner-source-badge">手動草稿</span></div>
        <div className="grid gap-4">
          <FormField label="課程名稱" hint="選填"><TextInput name="title" onChange={(event) => { setTitle(event.target.value); setSaved(false); }} placeholder="例如：穩定根基與髖部流動" value={title} /></FormField>
          <FormField label="學員" hint="可選擇一位或多位學員"><div className={`student-select ${studentPickerOpen ? "student-select-open" : ""}`} ref={studentPickerRef}><button aria-expanded={studentPickerOpen} className="student-select-trigger" onClick={() => setStudentPickerOpen((open) => !open)} type="button"><span>{selectedStudents.length ? selectedStudents.map((student) => <i key={student.id}>{student.name}</i>) : <em>選擇學員…</em>}</span><b>{selectedStudents.length ? `已選 ${selectedStudents.length} 位` : "選填"}<i aria-hidden="true">⌄</i></b></button>{studentPickerOpen ? <div className="student-select-menu" role="listbox">{students.map((student) => { const selected = studentIds.includes(student.id); return <button aria-selected={selected} className={`planner-student-option ${selected ? "planner-student-option-selected" : ""}`} key={student.id} onClick={() => { setStudentIds((current) => splitSelections(toggleSelection(current.join(", "), student.id))); setSaved(false); }} role="option" type="button"><span className="planner-check">{selected ? "✓" : "+"}</span><span><strong>{student.name}</strong><small>{student.experience_level || "程度未設定"} · {student.class_count} 堂課</small></span></button>; })}</div> : null}</div></FormField>
          <div className="grid gap-4 sm:grid-cols-2"><FormField label="課程類型"><select className="form-control" onChange={(event) => { setClassStyle(event.target.value); setSaved(false); }} value={classStyle}><option>Hatha</option><option>Vinyasa</option><option>Ashtanga</option><option>Iyengar</option><option>Yin</option><option>Restorative</option></select></FormField><FormField label="預計時長"><select className="form-control" onChange={(event) => { setDuration(event.target.value); setSaved(false); }} value={duration}><option value="30">30 分鐘</option><option value="45">45 分鐘</option><option value="60">60 分鐘</option><option value="75">75 分鐘</option><option value="90">90 分鐘</option></select></FormField></div>
          <FormField label="課程主題"><TextInput name="theme" onChange={(event) => { setTheme(event.target.value); setSaved(false); }} placeholder="例如：平衡、肩頸放鬆、腿後側" value={theme} /></FormField>
          <FormField label="輔具與空間"><TextInput name="props" onChange={(event) => { setProps(event.target.value); setSaved(false); }} placeholder="瑜伽磚、椅子、毛毯…" value={props} /></FormField>
          <FormField label="老師意圖／全班提醒"><TextArea name="intention" onChange={(event) => { setIntention(event.target.value); setSaved(false); }} placeholder="這堂課希望學員探索什麼？" value={intention} /></FormField>
        </div>
        <button className="mt-6 w-full rounded-full bg-[#294a3c] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#1d3329]" onClick={saveDraft} type="button">{saved ? "✓ 草稿已儲存" : "儲存課程草稿"}</button>
      </section>
      <section className="planner-output-card manual-planner-output">
        <div className="manual-plan-heading"><div><p className="eyebrow !text-[#e9bd89]">02 · Sequence</p><h2>{title || "未命名課程"}</h2><p>{theme || "拖曳體式以安排教學順序"}</p></div><div className={`manual-time-total ${plannedMinutes > Number(duration) ? "manual-time-over" : ""}`}><strong>{plannedMinutes}</strong><span>／{duration} 分鐘</span></div></div>
        {poses.length ? <ol className="manual-sequence-list">{poses.map((pose, index) => { const item = settings[pose.id] ?? { minutes: 3, phase: "主要探索", note: "" }; return <li className={dragged === pose.id ? "manual-pose-dragging" : ""} draggable key={pose.id} onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDragStart={() => setDragged(pose.id)} onDrop={() => { if (dragged) movePose(dragged, pose.id); setDragged(null); }}><div className="manual-pose-main"><span className="manual-drag">⠿</span><b>{String(index + 1).padStart(2, "0")}</b><PoseIllustration pose={`${pose.en} ${pose.zh}`} /><div><strong>{pose.zh}</strong><small>{pose.en} · {pose.position} · {pose.level}</small></div><div className="manual-pose-actions"><button aria-label="上移" disabled={index === 0} onClick={() => nudgePose(pose.id, -1)} type="button">↑</button><button aria-label="下移" disabled={index === poses.length - 1} onClick={() => nudgePose(pose.id, 1)} type="button">↓</button><button aria-label="移除" onClick={() => removePose(pose.id)} type="button">×</button></div></div><div className="manual-pose-fields"><label>階段<select onChange={(event) => updatePose(pose.id, { phase: event.target.value })} value={item.phase}>{PHASES.map((phase) => <option key={phase}>{phase}</option>)}</select></label><label>分鐘<input min="1" onChange={(event) => updatePose(pose.id, { minutes: Math.max(1, Number(event.target.value)) })} type="number" value={item.minutes} /></label><label>教學備註<input onChange={(event) => updatePose(pose.id, { note: event.target.value })} placeholder="口令、左右次數或替代方案…" value={item.note} /></label></div></li>; })}</ol> : <div className="manual-plan-empty"><span>＋</span><h3>尚未加入體式</h3><p>前往教學工具箱搜尋體式並加入備選，體式會自動出現在這裡。</p><Link href="/teacher/toolkit">打開體式資料庫 →</Link></div>}
        {poses.length ? <div className="manual-plan-footer"><p>共 <strong>{poses.length}</strong> 個體式 · 已安排 <strong>{plannedMinutes}</strong> 分鐘</p><Link href="/teacher/toolkit">＋ 繼續加入體式</Link></div> : null}
      </section>
    </div>
  </Layout>;
}
