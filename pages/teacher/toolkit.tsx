import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { PoseIllustration } from "@/components/PoseIllustration";
import { FOCUS_FILTERS, POSE_LIBRARY, POSITION_FILTERS, TRADITION_FILTERS } from "@/lib/poseLibrary";
import { buildCueGroups, buildReadiness } from "@/lib/sequenceGuidance";
import { DRAFT_KEY, makeSequenceItem, readShortlist, SHORTLIST_KEY, type SequenceItem } from "@/lib/sequences";

const ARC = [
  ["Arrival", "Observe breath, energy and current symptoms before adding load."],
  ["Preparation", "Rehearse the joint actions and transitions needed later in the class."],
  ["Main exploration", "Repeat a coherent pattern with bilateral balance and visible options."],
  ["Integration", "Reduce complexity, revisit the intention and leave enough time for rest."]
];

export default function TeachingToolkitPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const [cueGroup, setCueGroup] = useState("sequence");
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<(typeof POSITION_FILTERS)[number]>("全部");
  const [focus, setFocus] = useState<(typeof FOCUS_FILTERS)[number]>("全部");
  const [tradition, setTradition] = useState<(typeof TRADITION_FILTERS)[number]>("全部");
  const [openPose, setOpenPose] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<SequenceItem[]>([]);
  const [shortlistHydrated, setShortlistHydrated] = useState(false);
  const [draggedPose, setDraggedPose] = useState<string | null>(null);
  const [draftContext, setDraftContext] = useState<{ title?: string; duration?: string; props?: string }>({});

  useEffect(() => { try { setChecked(JSON.parse(window.localStorage.getItem("sattva-readiness") || "[]")); } catch { setChecked([]); } }, []);
  useEffect(() => { window.localStorage.setItem("sattva-readiness", JSON.stringify(checked)); }, [checked]);
  useEffect(() => { setShortlist(readShortlist()); try { setDraftContext(JSON.parse(window.localStorage.getItem(DRAFT_KEY) || "{}")); } catch { setDraftContext({}); } setShortlistHydrated(true); }, []);
  useEffect(() => { if (shortlistHydrated) window.localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist)); }, [shortlist, shortlistHydrated]);
  useEffect(() => {
    if (!openPose) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") setOpenPose(null); }
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", closeOnEscape); };
  }, [openPose]);

  function toggle(id: string) { setChecked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); }
  function addToShortlist(id: string) { setShortlist((current) => [...current, makeSequenceItem(id)]); }
  function removeShortlist(instanceId: string) { setShortlist((current) => current.filter((item) => item.instanceId !== instanceId)); }
  function moveShortlist(id: string, targetId: string) {
    if (id === targetId) return;
    setShortlist((current) => { const next = [...current]; const from = next.findIndex((item) => item.instanceId === id); const to = next.findIndex((item) => item.instanceId === targetId); if (from < 0 || to < 0) return current; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; });
  }
  function nudgeShortlist(id: string, direction: -1 | 1) {
    setShortlist((current) => { const from = current.findIndex((item) => item.instanceId === id); const to = from + direction; if (from < 0 || to < 0 || to >= current.length) return current; const next = [...current]; [next[from], next[to]] = [next[to], next[from]]; return next; });
  }
  const poses = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("zh-TW").replaceAll(" ", "");
    return POSE_LIBRARY.filter((pose) => {
      const positionMatch = position === "全部" || pose.position === position;
      const focusMatch = focus === "全部" || pose.tags.includes(focus) || pose.focus.some((item) => item.includes(focus));
      const traditionMatch = tradition === "全部" || pose.traditions?.includes(tradition);
      const searchable = [pose.zh, pose.en, pose.sanskrit, pose.position, pose.level, pose.summary, ...pose.focus, ...pose.tags, ...(pose.traditions ?? [])].join("").toLocaleLowerCase("zh-TW").replaceAll(" ", "");
      return positionMatch && focusMatch && traditionMatch && (!needle || searchable.includes(needle));
    });
  }, [focus, position, query, tradition]);

  const selectedPose = POSE_LIBRARY.find((pose) => pose.id === openPose);
  const shortlistedPoses = shortlist.map((item) => ({ item, pose: POSE_LIBRARY.find((pose) => pose.id === item.poseId) })).filter((row): row is { item: SequenceItem; pose: (typeof POSE_LIBRARY)[number] } => Boolean(row.pose));
  const readiness = useMemo(() => buildReadiness(shortlistedPoses, Number(draftContext.duration) || shortlistedPoses.reduce((sum, row) => sum + row.item.minutes, 0), draftContext.props), [draftContext.duration, draftContext.props, shortlistedPoses]);
  const cueGroups = useMemo(() => buildCueGroups(shortlistedPoses), [shortlistedPoses]);
  const activeCues = cueGroups.find((group) => group.id === cueGroup) ?? cueGroups[0];

  function resetPoseFilters() { setQuery(""); setPosition("全部"); setFocus("全部"); setTradition("全部"); }

  return (
    <Layout title="Teaching Toolkit" action={<Link className="premium-button toolkit-complete-button inline-flex" href="/teacher/planner">✓ 完成編排 · 返回課程 →</Link>}>
      <Head><title>Teaching Toolkit | Sattva</title></Head>
      <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link href="/teacher/planner">課程編排</Link><Link className="teacher-tab-active" href="/teacher/toolkit">Teaching Toolkit</Link><Link href="/teacher/sequences">序列庫</Link></div>
      <section className="toolkit-hero"><div><p className="eyebrow">體式教學資料庫</p><h2>從教學目的，找到適合課程的體式。</h2><p>搜尋「平衡」、「髖部」或體式名稱，快速比較進入方式、教學口令、注意事項與退階／進階選項。</p></div><div className="toolkit-progress"><strong>{POSE_LIBRARY.length}</strong><span>個完整體式指南</span><i style={{ width: "100%" }} /></div></section>

      <section className="pose-library" aria-labelledby="pose-library-title">
        <div className="pose-library-heading">
          <div><p className="eyebrow">01 · Asana finder</p><h2 id="pose-library-title">找體式，建立你的課程備選</h2><p>可用中文、英文、梵文、訓練部位或教學目的搜尋。</p></div>
          <div className="pose-shortlist-count"><strong>{shortlist.length}</strong><span>已加入備選</span></div>
        </div>
        <div className="pose-search-wrap">
          <span aria-hidden="true">⌕</span>
          <input aria-label="搜尋體式、部位或訓練目的" onChange={(event) => setQuery(event.target.value)} placeholder="例如：平衡、腿後側、Tree、Vrksasana…" type="search" value={query} />
          {query ? <button onClick={() => setQuery("")} type="button">清除</button> : null}
        </div>
        <div className="pose-filter-row"><strong>依姿勢</strong><div>{POSITION_FILTERS.map((item) => <button aria-pressed={position === item} key={item} onClick={() => setPosition(item)} type="button">{item}</button>)}</div></div>
        <div className="pose-filter-row"><strong>依重點</strong><div>{FOCUS_FILTERS.map((item) => <button aria-pressed={focus === item} key={item} onClick={() => setFocus(item)} type="button">{item}</button>)}</div></div>
        <div className="pose-filter-row"><strong>依系統</strong><div>{TRADITION_FILTERS.map((item) => <button aria-pressed={tradition === item} key={item} onClick={() => setTradition(item)} type="button">{item}</button>)}</div></div>

        {shortlistedPoses.length ? <section className="pose-shortlist pose-sequence-track" aria-labelledby="shortlist-title"><div className="pose-shortlist-heading"><div><p className="eyebrow">Course shortlist</p><h3 id="shortlist-title">課程備選順序</h3></div><div><span>可重複加入 · 拖曳排序</span><Link href="/teacher/planner">完成編排 →</Link></div></div><ol>{shortlistedPoses.map(({ item, pose }, index) => <li className={draggedPose === item.instanceId ? "pose-shortlist-dragging" : ""} draggable key={item.instanceId} onDragEnd={() => setDraggedPose(null)} onDragOver={(event) => event.preventDefault()} onDragStart={() => setDraggedPose(item.instanceId)} onDrop={() => { if (draggedPose) moveShortlist(draggedPose, item.instanceId); setDraggedPose(null); }} style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}><span className="pose-drag-handle" title="拖曳排序">⠿</span><b>{String(index + 1).padStart(2, "0")}</b><button className="pose-shortlist-name" onClick={() => setOpenPose(pose.id)} type="button"><strong>{pose.zh}</strong><small>{pose.en}</small></button><div className="pose-shortlist-actions"><button aria-label={`再加入一次${pose.zh}`} onClick={() => addToShortlist(pose.id)} title="再加入一次" type="button">＋</button><button aria-label={`將${pose.zh}上移`} disabled={index === 0} onClick={() => nudgeShortlist(item.instanceId, -1)} type="button">↑</button><button aria-label={`將${pose.zh}下移`} disabled={index === shortlistedPoses.length - 1} onClick={() => nudgeShortlist(item.instanceId, 1)} type="button">↓</button><button aria-label={`移除${pose.zh}`} onClick={() => removeShortlist(item.instanceId)} type="button">×</button></div></li>)}</ol></section> : <section className="pose-shortlist-empty"><span>＋</span><div><strong>尚未加入課程備選</strong><p>點擊體式卡右上角的「＋」，同一體式也可以重複加入。</p></div></section>}

        <div className="pose-results-meta"><p>找到 <strong>{poses.length}</strong> 個體式{query ? <>，搜尋「{query}」</> : null}</p>{(query || position !== "全部" || focus !== "全部" || tradition !== "全部") ? <button onClick={resetPoseFilters} type="button">重設篩選</button> : null}</div>
        {poses.length ? <div className="pose-library-grid">{poses.map((pose) => {
          const count = shortlist.filter((item) => item.poseId === pose.id).length;
          return <article className="pose-guide-card" key={pose.id}>
            <div className="pose-guide-summary">
              <div className="pose-guide-visual"><PoseIllustration pose={`${pose.en} ${pose.zh}`} /></div>
              <div className="pose-guide-title"><div className="pose-guide-badges"><span>{pose.position}</span><span>{pose.level}</span>{pose.traditions?.slice(0, 1).map((item) => <span key={item}>{item}</span>)}</div><h3>{pose.zh}</h3><p>{pose.en} · <i>{pose.sanskrit}</i></p></div>
              <button aria-label={`將${pose.zh}加入備選`} className="pose-save-button" onClick={() => addToShortlist(pose.id)} title="加入備選（可重複）" type="button">{count ? `+${count}` : "+"}</button>
            </div>
            <p className="pose-guide-description">{pose.summary}</p>
            <div className="pose-focus-list">{pose.focus.map((item) => <span key={item}>{item}</span>)}</div>
            <button className="pose-detail-toggle" onClick={() => setOpenPose(pose.id)} type="button"><span>查看完整教學指南</span><i aria-hidden="true">↗</i></button>
          </article>;
        })}</div> : <div className="pose-empty"><span>⌕</span><h3>目前沒有相符體式</h3><p>試試較廣的詞，例如「平衡」、「伸展」、「髖部」或重設篩選。</p><button onClick={resetPoseFilters} type="button">查看全部體式</button></div>}
        <aside className="pose-library-note"><div><strong>教學安全提醒</strong><p>此資料庫提供教學規劃參考，不作診斷或治療。疼痛、暈眩、麻木或呼吸困難出現時應停止；有傷病、孕期、高血壓、青光眼或其他健康狀況者，應依醫療專業人員的個別建議調整。</p></div><div className="pose-source-links"><a href="https://www.nccih.nih.gov/health/yoga-effectiveness-and-safety" rel="noreferrer" target="_blank">NCCIH 安全指引 ↗</a><a href="https://yogaalliance.org/policies-priorities-progress/scope-of-practice/" rel="noreferrer" target="_blank">Yoga Alliance 執業範圍 ↗</a></div></aside>
      </section>

      {selectedPose ? <div aria-labelledby="pose-dialog-title" aria-modal="true" className="pose-modal-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpenPose(null); }} role="dialog"><article className="pose-modal">
        <header><div className="pose-modal-visual"><PoseIllustration pose={`${selectedPose.en} ${selectedPose.zh}`} /></div><div><div className="pose-guide-badges"><span>{selectedPose.position}</span><span>{selectedPose.level}</span>{(selectedPose.traditions ?? ["哈達"]).map((item) => <span key={item}>{item}</span>)}</div><h2 id="pose-dialog-title">{selectedPose.zh}</h2><p>{selectedPose.en} · <i>{selectedPose.sanskrit}</i></p></div><button aria-label="關閉體式詳情" className="pose-modal-close" onClick={() => setOpenPose(null)} type="button">×</button></header>
        <div className="pose-modal-summary"><p>{selectedPose.summary}</p><div className="pose-focus-list">{selectedPose.focus.map((item) => <span key={item}>{item}</span>)}</div></div>
        <div className="pose-guide-details pose-modal-details"><section><h4><span>01</span> 如何進入</h4><ol>{selectedPose.enter.map((step) => <li key={step}>{step}</li>)}</ol><p className="pose-exit"><b>安全退出</b>{selectedPose.exit}</p></section><section><h4><span>02</span> 教學口令</h4><ul>{selectedPose.cues.map((cue) => <li key={cue}>{cue}</li>)}</ul></section><section className="pose-caution"><h4><span>!</span> 注意事項</h4><ul>{selectedPose.cautions.map((item) => <li key={item}>{item}</li>)}</ul></section><div className="pose-options-grid"><section><h4>退階／更有支撐</h4><ul>{selectedPose.regressions.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h4>進階／增加挑戰</h4><ul>{selectedPose.progressions.map((item) => <li key={item}>{item}</li>)}</ul></section></div></div>
        <footer><div><b>可用輔具</b><span>{selectedPose.props.join(" · ")}</span></div><a href={selectedPose.source.url} rel="noreferrer" target="_blank">參考：{selectedPose.source.label} ↗</a><button onClick={() => addToShortlist(selectedPose.id)} type="button">＋ 加入課程備選{shortlist.some((item) => item.poseId === selectedPose.id) ? `（已有 ${shortlist.filter((item) => item.poseId === selectedPose.id).length}）` : ""}</button></footer>
      </article></div> : null}
      <div className="toolkit-grid">
        <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">02 · Before class · {draftContext.title || "目前序列"}</p><h2>課前準備檢查</h2></div><button onClick={() => setChecked([])} type="button">重設</button></div><div className="toolkit-checklist">{readiness.map((item) => { const complete = checked.includes(item.id); return <button aria-pressed={complete} className={complete ? "toolkit-check-complete" : ""} key={item.id} onClick={() => toggle(item.id)} type="button"><span>{complete ? "✓" : ""}</span><div><strong>{item.title}</strong><p>{item.detail}</p></div></button>; })}</div></section>
        <section className="toolkit-panel"><div className="toolkit-panel-heading"><div><p className="eyebrow">03 · In the room · 依目前序列生成</p><h2>包容性教學口令</h2></div></div><div className="toolkit-cue-tabs">{cueGroups.map((group) => <button aria-pressed={cueGroup === group.id} key={group.id} onClick={() => setCueGroup(group.id)} type="button">{group.label}</button>)}</div><div className="toolkit-cues">{activeCues.cues.map((cue) => <blockquote key={cue}>“{cue}”</blockquote>)}</div></section>
        <section className="toolkit-panel toolkit-panel-wide"><div className="toolkit-panel-heading"><div><p className="eyebrow">04 · Sequence review</p><h2>Four-part arc audit</h2></div><span>Teacher review</span></div><div className="toolkit-arc">{ARC.map(([title, detail], index) => <article key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{detail}</p></div></article>)}</div><p className="toolkit-scope-note">Teaching support only: do not diagnose or treat health conditions. Pause or adapt movements that reproduce symptoms, and refer concerns beyond your qualifications to an appropriate healthcare professional.</p></section>
      </div>
    </Layout>
  );
}
