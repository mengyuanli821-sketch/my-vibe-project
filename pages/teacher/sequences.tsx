import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { POSE_LIBRARY } from "@/lib/poseLibrary";
import { buildCueGroups, buildReadiness } from "@/lib/sequenceGuidance";
import { DRAFT_KEY, fetchSavedSequences, makeSequenceItem, migrateBrowserSequences, persistSavedSequence, removeSavedSequence, SHORTLIST_KEY, type SavedSequence } from "@/lib/sequences";
import type { StudentWithStats } from "@/types/student";

const WORKFLOWS: Record<string, string[]> = {
  "全身平衡": ["easy-seat", "mountain", "upward-hands", "chair", "low-lunge", "warrior-two", "triangle", "tree", "bridge", "supine-twist", "corpse"],
  "髖部活動": ["easy-seat", "bound-angle", "cat-cow", "low-lunge", "warrior-two", "extended-side-angle", "garland", "half-lord-fishes", "happy-baby", "supine-twist", "corpse"],
  "核心穩定": ["mountain", "chair", "tiger", "forearm-plank", "boat", "warrior-three", "bridge", "knees-to-chest", "supine-twist", "corpse"],
  "肩頸舒展": ["easy-seat", "cat-cow", "puppy", "upward-hands", "eagle", "warrior-two", "sphinx", "supine-twist", "legs-up-wall", "corpse"],
  "舒緩恢復": ["easy-seat", "child", "cat-cow", "low-lunge", "bound-angle", "reclined-hand-to-toe", "happy-baby", "supine-twist", "legs-up-wall", "corpse"]
};

function distributeMinutes(ids: string[], duration: number) {
  const weights = ids.map((_, index) => index === ids.length - 1 ? 2 : index < 2 ? 1.2 : 1);
  const sum = weights.reduce((total, value) => total + value, 0);
  const minutes = weights.map((weight) => Math.max(1, Math.floor(duration * weight / sum)));
  let remaining = duration - minutes.reduce((total, value) => total + value, 0);
  for (let index = minutes.length - 1; remaining > 0; index = (index - 1 + minutes.length) % minutes.length) { minutes[index] += 1; remaining -= 1; }
  return minutes;
}

function adaptForStudents(ids: string[], students: StudentWithStats[]) {
  const context = students.map((student) => `${student.body_conditions} ${student.injury_notes} ${student.teacher_notes}`).join(" ").toLowerCase();
  const excluded = new Set<string>();
  if (/手腕|腕痛|wrist|carpal/.test(context)) ["forearm-plank", "side-plank", "wheel", "crow", "handstand"].forEach((id) => excluded.add(id));
  if (/膝|knee|meniscus|acl|mcl/.test(context)) ["garland", "hero", "lotus", "pigeon"].forEach((id) => excluded.add(id));
  if (/肩|shoulder|rotator|五十肩/.test(context)) ["wheel", "side-plank", "forearm-plank", "upward-hands"].forEach((id) => excluded.add(id));
  if (/腰|下背|椎間盤|back pain|lumbar|sciatica/.test(context)) ["wheel", "bow", "standing-forward-fold"].forEach((id) => excluded.add(id));
  const safe = ids.filter((id) => !excluded.has(id));
  if (safe.length < ids.length && !safe.includes("constructive-rest")) safe.splice(1, 0, "constructive-rest");
  return safe;
}

export default function SequenceLibraryPage() {
  const [sequences, setSequences] = useState<SavedSequence[]>([]);
  const [students, setStudents] = useState<StudentWithStats[]>([]);
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [focus, setFocus] = useState("全身平衡");
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("全部");
  const [notice, setNotice] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [guidanceId, setGuidanceId] = useState<string | null>(null);
  const [cueTabs, setCueTabs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchSavedSequences().then(migrateBrowserSequences).then(setSequences).catch(() => setNotice("無法讀取序列資料庫，請重新整理再試。"));
    fetch("/api/students").then((response) => response.json()).then((data) => setStudents(data.students ?? [])).catch(() => setStudents([]));
    if (new URLSearchParams(window.location.search).has("saved")) setNotice("序列已保存，可在下方補充備忘錄與標籤。");
  }, []);

  const tags = useMemo(() => Array.from(new Set(sequences.flatMap((sequence) => sequence.tags))).sort(), [sequences]);
  const visible = useMemo(() => sequences.filter((sequence) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || [sequence.name, sequence.theme, sequence.memo, ...sequence.tags].join(" ").toLowerCase().includes(needle);
    return matchesQuery && (tagFilter === "全部" || sequence.tags.includes(tagFilter) || sequence.studentIds.includes(tagFilter));
  }), [query, sequences, tagFilter]);

  function updateSequence(id: string, patch: Partial<SavedSequence>) {
    const updated = sequences.find((sequence) => sequence.id === id);
    if (!updated) return;
    const next = { ...updated, ...patch, updatedAt: new Date().toISOString() };
    setSequences((current) => current.map((sequence) => sequence.id === id ? next : sequence));
    persistSavedSequence(next).catch(() => { setNotice("更新未能寫入資料庫，請再試一次。"); void fetchSavedSequences().then(setSequences); });
  }
  function addTag(sequence: SavedSequence, raw: string) { const tag = raw.trim().replace(/^#/, ""); if (tag && !sequence.tags.includes(tag)) updateSequence(sequence.id, { tags: [...sequence.tags, tag] }); }
  async function deleteSequence(id: string) { try { await removeSavedSequence(id); setSequences((current) => current.filter((sequence) => sequence.id !== id)); setDeleteId(null); setNotice("序列已刪除。"); } catch { setNotice("刪除失敗，資料仍保留在資料庫中。"); } }
  function toggleCheck(sequenceId: string, itemId: string) { setChecked((current) => ({ ...current, [sequenceId]: (current[sequenceId] ?? []).includes(itemId) ? (current[sequenceId] ?? []).filter((id) => id !== itemId) : [...(current[sequenceId] ?? []), itemId] })); }
  function generate() {
    const selected = students.filter((student) => studentIds.includes(student.id));
    const ids = adaptForStudents(WORKFLOWS[focus], selected).filter((id) => POSE_LIBRARY.some((pose) => pose.id === id));
    const minutes = distributeMinutes(ids, duration);
    const items = ids.map((poseId, index) => makeSequenceItem(poseId, { minutes: minutes[index], phase: index < 2 ? "進入課堂" : index < Math.ceil(ids.length * .4) ? "暖身準備" : index < ids.length - 3 ? "主要探索" : index === ids.length - 1 ? "休息" : "緩和整合" }));
    const studentNames = selected.map((student) => student.name);
    window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(items));
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: `${focus} · ${duration} 分鐘`, theme: focus, duration: String(duration), classStyle: focus === "舒緩恢復" ? "Restorative" : "Hatha", props: "瑜伽磚、毛毯（依需要）", intention: studentNames.length ? `已依 ${studentNames.join("、")} 的學生檔案避開常見衝突體式；上課前仍需確認當天狀態與個別醫療建議。` : "保持呼吸穩定，依當天狀態調整幅度。", studentIds }));
    window.location.href = "/teacher/planner";
  }

  return <Layout title="序列庫" action={<Link className="premium-button inline-flex" href="/teacher/planner">＋ 手動建立序列</Link>}>
    <Head><title>序列庫 | Sattva</title></Head>
    <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link href="/teacher/planner">課程編排</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link><Link className="teacher-tab-active" href="/teacher/sequences">序列庫</Link></div>
    {notice ? <div className="sequence-notice">✓ {notice}</div> : null}
    <section className="local-planner-panel">
      <div className="local-planner-copy"><span className="local-badge">智能課程建議</span><h2>快速建立一堂課的骨架</h2><p>依學生狀態、訓練方向與上課時長，組合安全、連貫的基礎序列。生成後會先進入編排頁供老師檢查與修改。</p></div>
      <div className="local-planner-form">
        <label><span>主要訓練方向</span><select value={focus} onChange={(event) => setFocus(event.target.value)}>{Object.keys(WORKFLOWS).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>上課時長</span><select value={duration} onChange={(event) => setDuration(Number(event.target.value))}>{[30,45,60,75,90].map((value) => <option key={value} value={value}>{value} 分鐘</option>)}</select></label>
        <fieldset><legend>針對學生（選填）</legend><div className="sequence-student-chips">{students.length ? students.map((student) => <button aria-pressed={studentIds.includes(student.id)} key={student.id} onClick={() => setStudentIds((current) => current.includes(student.id) ? current.filter((id) => id !== student.id) : [...current, student.id])} type="button">{student.name}</button>) : <span>尚無學生資料，也可先建立通用序列</span>}</div></fieldset>
        <button className="local-generate-button" onClick={generate} type="button">生成可編輯草稿 →</button>
      </div>
    </section>

    <section className="sequence-library-section">
      <div className="sequence-library-heading"><div><p className="eyebrow">Saved sequences</p><h2>所有已保存序列</h2></div><strong>{sequences.length} 個序列</strong></div>
      <div className="sequence-filters"><input aria-label="搜尋序列" onChange={(event) => setQuery(event.target.value)} placeholder="搜尋名稱、主題、備忘錄或標籤…" type="search" value={query} /><select aria-label="依標籤或學生篩選" onChange={(event) => setTagFilter(event.target.value)} value={tagFilter}><option>全部</option><optgroup label="標籤">{tags.map((tag) => <option key={tag} value={tag}>#{tag}</option>)}</optgroup><optgroup label="學生">{students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}</optgroup></select></div>
      {visible.length ? <div className="sequence-card-grid">{visible.map((sequence) => {
        const poseNames = sequence.items.map((item) => POSE_LIBRARY.find((pose) => pose.id === item.poseId)?.zh).filter(Boolean);
        const names = students.filter((student) => sequence.studentIds.includes(student.id)).map((student) => student.name);
        const rows = sequence.items.map((item) => ({ item, pose: POSE_LIBRARY.find((pose) => pose.id === item.poseId) })).filter((row): row is { item: (typeof sequence.items)[number]; pose: (typeof POSE_LIBRARY)[number] } => Boolean(row.pose));
        const readiness = buildReadiness(rows, sequence.duration, sequence.props);
        const cueGroups = buildCueGroups(rows);
        const activeCueId = cueTabs[sequence.id] ?? "sequence";
        const activeCues = cueGroups.find((group) => group.id === activeCueId) ?? cueGroups[0];
        const isGuidanceOpen = guidanceId === sequence.id;
        return <article className={`sequence-card ${isGuidanceOpen ? "sequence-card-guidance-open" : ""}`} key={sequence.id}>
          <header><div><div className="sequence-card-meta"><span>{sequence.classStyle}</span><span>{sequence.duration} 分鐘</span><span>{sequence.items.length} 個步驟</span></div><h3>{sequence.name}</h3><p>{sequence.theme || "未設定主題"}</p></div><div className="sequence-card-actions"><Link className="sequence-start-link" href={`/teacher/session?id=${sequence.id}`}>▶ 開始上課</Link><Link href={`/teacher/planner?edit=${sequence.id}`}>編輯序列 →</Link><button aria-label={`刪除${sequence.name}`} onClick={() => setDeleteId(sequence.id)} type="button">刪除</button></div></header>
          <div className="sequence-pose-preview">{poseNames.slice(0, 6).map((name, index) => <span key={`${name}-${index}`}>{index + 1}. {name}</span>)}{poseNames.length > 6 ? <i>＋{poseNames.length - 6}</i> : null}</div>
          {names.length ? <div className="sequence-students">學員：{names.join("、")}</div> : null}
          <button aria-expanded={isGuidanceOpen} className="sequence-guidance-toggle" onClick={() => setGuidanceId(isGuidanceOpen ? null : sequence.id)} type="button"><span>課前準備與包容性教學口令</span><i>{isGuidanceOpen ? "收起 ↑" : "查看 →"}</i></button>
          {isGuidanceOpen ? <div className="saved-sequence-guidance">
            <p className="guidance-workflow-note">固定 workflow · 全部 {rows.length} 個體式 → 時間與輔具檢查 → 逐式口令 → 體式轉換 → 替代選項 → 自主選擇</p>
            <div className="saved-guidance-grid">
              <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">Before class</p><h2>課前準備檢查</h2></div><button onClick={() => setChecked((current) => ({ ...current, [sequence.id]: [] }))} type="button">重設</button></div><div className="toolkit-checklist">{readiness.map((item) => { const complete = (checked[sequence.id] ?? []).includes(item.id); return <button aria-pressed={complete} className={complete ? "toolkit-check-complete" : ""} key={item.id} onClick={() => toggleCheck(sequence.id, item.id)} type="button"><span>{complete ? "✓" : ""}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></button>; })}</div></section>
              <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">In the room · 依完整序列生成</p><h2>包容性教學口令</h2></div></div><div className="toolkit-cue-tabs">{cueGroups.map((group) => <button aria-pressed={activeCueId === group.id} key={group.id} onClick={() => setCueTabs((current) => ({ ...current, [sequence.id]: group.id }))} type="button">{group.label}</button>)}</div><div className="toolkit-cues">{activeCues.cues.map((cue, index) => <blockquote key={`${cue}-${index}`}>“{cue}”</blockquote>)}</div></section>
            </div>
          </div> : null}
          <label className="sequence-memo"><span>老師備忘錄</span><textarea onBlur={(event) => updateSequence(sequence.id, { memo: event.target.value })} defaultValue={sequence.memo} placeholder="記下教學觀察、下次調整或替代方案…" /></label>
          <div className="sequence-tags">{sequence.tags.map((tag) => <button aria-label={`移除標籤 ${tag}`} key={tag} onClick={() => updateSequence(sequence.id, { tags: sequence.tags.filter((item) => item !== tag) })} type="button">#{tag} ×</button>)}<input aria-label="新增標籤" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(sequence, event.currentTarget.value); event.currentTarget.value = ""; } }} placeholder="＋ 學生／訓練方向標籤" /></div>
          {deleteId === sequence.id ? <div className="sequence-delete-confirm" role="alert"><p>確定刪除「{sequence.name}」？此操作無法復原。</p><div><button onClick={() => setDeleteId(null)} type="button">取消</button><button onClick={() => deleteSequence(sequence.id)} type="button">確認刪除</button></div></div> : null}
        </article>;
      })}</div> : <div className="sequence-empty"><span>☰</span><h3>{sequences.length ? "沒有符合條件的序列" : "還沒有保存的序列"}</h3><p>{sequences.length ? "試著清除搜尋或切換到全部。" : "可以使用上方課程建議，或從體式庫開始手動編排。"}</p></div>}
    </section>
  </Layout>;
}
