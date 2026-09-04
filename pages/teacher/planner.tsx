import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FormField, TextArea, TextInput } from "@/components/FormField";
import { Layout } from "@/components/Layout";
import { PoseIllustration } from "@/components/PoseIllustration";
import { POSE_LIBRARY } from "@/lib/poseLibrary";
import { DRAFT_KEY, makeSequenceItem, readSavedSequences, readShortlist, SHORTLIST_KEY, type SavedSequence, type SequenceItem, writeSavedSequences } from "@/lib/sequences";
import { splitSelections, toggleSelection } from "@/lib/options";
import type { StudentWithStats } from "@/types/student";

const PHASES = ["進入課堂", "暖身準備", "主要探索", "緩和整合", "休息"];

export default function ClassPlannerPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");
  const [duration, setDuration] = useState("60");
  const [classStyle, setClassStyle] = useState("Hatha");
  const [props, setProps] = useState("");
  const [intention, setIntention] = useState("");
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [itemsHydrated, setItemsHydrated] = useState(false);
  const studentPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/students").then((response) => response.json()).then((data) => setStudents(data.students ?? [])).catch(() => setStudents([]));
    try {
      const editId = new URLSearchParams(window.location.search).get("edit");
      const source = editId ? readSavedSequences().find((sequence) => sequence.id === editId) : null;
      const draft = source ?? JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "{}");
      setItems(source?.items ?? readShortlist());
      if (draft.name || draft.title) setTitle(draft.name || draft.title); if (draft.theme) setTheme(draft.theme); if (draft.duration) setDuration(String(draft.duration));
      if (draft.classStyle) setClassStyle(draft.classStyle); if (draft.props) setProps(draft.props); if (draft.intention) setIntention(draft.intention);
      if (draft.studentIds) setStudentIds(draft.studentIds);
    } catch { setItems(readShortlist()); }
    setHydrated(true);
    setItemsHydrated(true);
  }, []);

  useEffect(() => {
    function closePicker(event: PointerEvent) { if (!studentPickerRef.current?.contains(event.target as Node)) setStudentPickerOpen(false); }
    document.addEventListener("pointerdown", closePicker);
    return () => document.removeEventListener("pointerdown", closePicker);
  }, []);
  useEffect(() => { if (itemsHydrated) window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(items)); }, [items, itemsHydrated]);
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, theme, duration, classStyle, props, intention, studentIds }));
  }, [classStyle, duration, hydrated, intention, props, studentIds, theme, title]);

  const selectedStudents = students.filter((student) => studentIds.includes(student.id));
  const rows = useMemo(() => items.map((item) => ({ item, pose: POSE_LIBRARY.find((pose) => pose.id === item.poseId) })).filter((row): row is { item: SequenceItem; pose: (typeof POSE_LIBRARY)[number] } => Boolean(row.pose)), [items]);
  const plannedMinutes = items.reduce((total, item) => total + item.minutes, 0);

  function dirty() { setSaved(false); }
  function updateItem(instanceId: string, patch: Partial<SequenceItem>) { setItems((current) => current.map((item) => item.instanceId === instanceId ? { ...item, ...patch } : item)); dirty(); }
  function moveItem(instanceId: string, targetId: string) { if (instanceId === targetId) return; setItems((current) => { const next = [...current]; const from = next.findIndex((item) => item.instanceId === instanceId); const to = next.findIndex((item) => item.instanceId === targetId); if (from < 0 || to < 0) return current; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; }); dirty(); }
  function nudgeItem(instanceId: string, direction: -1 | 1) { setItems((current) => { const from = current.findIndex((item) => item.instanceId === instanceId); const to = from + direction; if (from < 0 || to < 0 || to >= current.length) return current; const next = [...current]; [next[from], next[to]] = [next[to], next[from]]; return next; }); dirty(); }
  function removeItem(instanceId: string) { setItems((current) => current.filter((item) => item.instanceId !== instanceId)); dirty(); }
  function duplicateItem(item: SequenceItem) { setItems((current) => { const index = current.findIndex((entry) => entry.instanceId === item.instanceId); const next = [...current]; next.splice(index + 1, 0, makeSequenceItem(item.poseId, { minutes: item.minutes, phase: item.phase, note: item.note })); return next; }); dirty(); }
  function saveSequence() {
    const name = title.trim();
    if (!name) { window.alert("請先為序列命名"); return; }
    if (!items.length) { window.alert("請先加入至少一個體式"); return; }
    const now = new Date().toISOString();
    const editId = new URLSearchParams(window.location.search).get("edit");
    const all = readSavedSequences();
    const previous = editId ? all.find((sequence) => sequence.id === editId) : undefined;
    const next: SavedSequence = { id: previous?.id ?? `sequence_${Date.now()}`, name, theme, duration: Number(duration), classStyle, props, intention, studentIds, items, memo: previous?.memo ?? "", tags: previous?.tags ?? [], createdAt: previous?.createdAt ?? now, updatedAt: now };
    writeSavedSequences(previous ? all.map((sequence) => sequence.id === previous.id ? next : sequence) : [next, ...all]);
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, theme, duration, classStyle, props, intention, studentIds }));
    setSaved(true);
    void router.push("/teacher/sequences?saved=1");
  }

  return <Layout title="課程編排" action={<div className="flex gap-2"><Link className="secondary-button inline-flex" href="/teacher/sequences">已存序列</Link><Link className="premium-button inline-flex" href="/teacher/toolkit">＋ 從體式庫加入</Link></div>}>
    <Head><title>課程編排 | Sattva</title></Head>
    <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link className="teacher-tab-active" href="/teacher/planner">課程編排</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link><Link href="/teacher/sequences">序列庫</Link></div>
    <section className="planner-intro"><div><p className="eyebrow">Teacher-led sequencing</p><h2 className="mt-2 font-serif text-3xl text-[#294a3c] sm:text-4xl">把體式排成一堂完整的課。</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">同一體式可重複加入。拖曳排序，快速設定階段與時間，完成後命名保存到序列庫。</p></div><span className="planner-sanskrit">krama<br /><small>one step at a time</small></span></section>
    <div className="planner-workspace mt-6">
      <section className="planner-form-card">
        <div className="mb-5 flex items-center justify-between"><div><p className="eyebrow">01 · Class context</p><h2 className="mt-1 font-serif text-2xl text-[#294a3c]">課堂設定</h2></div><span className="planner-source-badge">本機保存</span></div>
        <div className="grid gap-4">
          <FormField label="序列名稱" hint="保存時必填"><TextInput name="title" onChange={(event) => { setTitle(event.target.value); dirty(); }} placeholder="例如：穩定根基與髖部流動" value={title} /></FormField>
          <FormField label="學員" hint="可選擇一位或多位"><div className={`student-select ${studentPickerOpen ? "student-select-open" : ""}`} ref={studentPickerRef}><button aria-expanded={studentPickerOpen} className="student-select-trigger" onClick={() => setStudentPickerOpen((open) => !open)} type="button"><span>{selectedStudents.length ? selectedStudents.map((student) => <i key={student.id}>{student.name}</i>) : <em>選擇學員…</em>}</span><b>{selectedStudents.length ? `已選 ${selectedStudents.length} 位` : "選填"}<i>⌄</i></b></button>{studentPickerOpen ? <div className="student-select-menu" role="listbox">{students.map((student) => { const selected = studentIds.includes(student.id); return <button aria-selected={selected} className={`planner-student-option ${selected ? "planner-student-option-selected" : ""}`} key={student.id} onClick={() => { setStudentIds((current) => splitSelections(toggleSelection(current.join(", "), student.id))); dirty(); }} role="option" type="button"><span className="planner-check">{selected ? "✓" : "+"}</span><span><strong>{student.name}</strong><small>{student.experience_level || "程度未設定"} · {student.class_count} 堂課</small></span></button>; })}</div> : null}</div></FormField>
          <div className="grid gap-4 sm:grid-cols-2"><FormField label="課程類型"><select className="form-control" onChange={(event) => { setClassStyle(event.target.value); dirty(); }} value={classStyle}>{["Hatha", "Vinyasa", "Ashtanga", "Iyengar", "Yin", "Restorative"].map((value) => <option key={value}>{value}</option>)}</select></FormField><FormField label="預計時長"><select className="form-control" onChange={(event) => { setDuration(event.target.value); dirty(); }} value={duration}>{[30,45,60,75,90].map((value) => <option key={value} value={value}>{value} 分鐘</option>)}</select></FormField></div>
          <FormField label="課程主題"><TextInput name="theme" onChange={(event) => { setTheme(event.target.value); dirty(); }} placeholder="例如：平衡、肩頸放鬆、腿後側" value={theme} /></FormField>
          <FormField label="輔具與空間"><TextInput name="props" onChange={(event) => { setProps(event.target.value); dirty(); }} placeholder="瑜伽磚、椅子、毛毯…" value={props} /></FormField>
          <FormField label="老師意圖／全班提醒"><TextArea name="intention" onChange={(event) => { setIntention(event.target.value); dirty(); }} placeholder="這堂課希望學員探索什麼？" value={intention} /></FormField>
        </div>
      </section>
      <section className="planner-output-card manual-planner-output">
        <div className="manual-plan-heading"><div><p className="eyebrow !text-[#e9bd89]">02 · Sequence</p><h2>{title || "未命名序列"}</h2><p>{theme || "拖曳體式以安排教學順序"}</p></div><div className={`manual-time-total ${plannedMinutes > Number(duration) ? "manual-time-over" : ""}`}><strong>{plannedMinutes}</strong><span>／{duration} 分鐘</span></div></div>
        {rows.length ? <ol className="manual-sequence-list compact-sequence-list">{rows.map(({ item, pose }, index) => <Fragment key={item.instanceId}>{(index === 0 || rows[index - 1].item.phase !== item.phase) ? <li className={`sequence-stage-divider stage-${PHASES.indexOf(item.phase)}`}><span>{item.phase}</span><i>{rows.filter((row) => row.item.phase === item.phase).length} 個步驟</i></li> : null}<li className={dragged === item.instanceId ? "manual-pose-dragging" : ""} draggable onDragEnd={() => setDragged(null)} onDragOver={(event) => event.preventDefault()} onDragStart={() => setDragged(item.instanceId)} onDrop={() => { if (dragged) moveItem(dragged, item.instanceId); setDragged(null); }} style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}><div className="manual-pose-main"><span className="manual-drag">⠿</span><b>{String(index + 1).padStart(2, "0")}</b><PoseIllustration pose={`${pose.en} ${pose.zh}`} /><div><strong>{pose.zh}</strong><small>{pose.en}</small></div><span className="sequence-minute-pill">{item.minutes} 分</span><div className="manual-pose-actions"><button aria-label="複製" onClick={() => duplicateItem(item)} title="在下方重複一次" type="button">＋</button><button aria-label="上移" disabled={index === 0} onClick={() => nudgeItem(item.instanceId, -1)} type="button">↑</button><button aria-label="下移" disabled={index === rows.length - 1} onClick={() => nudgeItem(item.instanceId, 1)} type="button">↓</button><button aria-label="移除" onClick={() => removeItem(item.instanceId)} type="button">×</button></div></div><div className="manual-pose-fields"><label>階段<select onChange={(event) => updateItem(item.instanceId, { phase: event.target.value })} value={item.phase}>{PHASES.map((phase) => <option key={phase}>{phase}</option>)}</select></label><label>分鐘<input min="1" onChange={(event) => updateItem(item.instanceId, { minutes: Math.max(1, Number(event.target.value)) })} type="number" value={item.minutes} /></label><label>教學備註<input onChange={(event) => updateItem(item.instanceId, { note: event.target.value })} placeholder="口令、左右次數或替代方案…" value={item.note} /></label></div></li></Fragment>)}</ol> : <div className="manual-plan-empty"><span>＋</span><h3>尚未加入體式</h3><p>前往體式庫，點擊「＋ 加入」；同一體式可加入多次。</p><Link href="/teacher/toolkit">打開體式資料庫 →</Link></div>}
        {rows.length ? <div className="manual-plan-footer"><p>共 <strong>{rows.length}</strong> 個步驟 · 已安排 <strong>{plannedMinutes}</strong> 分鐘</p><Link className="edit-sequence-button" href="/teacher/toolkit">編輯序列 <span>→</span></Link></div> : null}
      </section>
    </div>
    <section className="planner-save-bar"><div><span>03 · Save sequence</span><h2>{title.trim() || "為這個序列命名後保存"}</h2><p>{rows.length} 個步驟 · {plannedMinutes}／{duration} 分鐘{selectedStudents.length ? ` · ${selectedStudents.map((student) => student.name).join("、")}` : ""}</p></div><button disabled={!title.trim() || !items.length} onClick={saveSequence} type="button">{saved ? "✓ 已保存到序列庫" : "保存序列"}<i>→</i></button></section>
  </Layout>;
}
