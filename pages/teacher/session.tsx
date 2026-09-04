import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { PoseIllustration } from "@/components/PoseIllustration";
import { POSE_LIBRARY } from "@/lib/poseLibrary";
import { fetchSavedSequence } from "@/lib/sequences";
import type { SavedSequence, SequenceItem } from "@/lib/sequences";

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

export default function TeachingSessionPage() {
  const router = useRouter();
  const [sequence, setSequence] = useState<SavedSequence | null>(null);
  const [items, setItems] = useState<SequenceItem[]>([]);
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    const id = typeof router.query.id === "string" ? router.query.id : "";
    if (!id) { setError("找不到要執行的序列。"); setLoading(false); return; }
    fetchSavedSequence(id).then((saved) => {
      if (!saved) { setError("找不到要執行的序列。"); return; }
      setSequence(saved);
      setItems(saved.items);
      setSeconds((saved.items[0]?.minutes ?? 0) * 60);
    }).catch(() => setError("序列讀取失敗，請回到序列庫再試一次。")).finally(() => setLoading(false));
  }, [router.isReady, router.query.id]);

  const current = items[index];
  const currentPose = useMemo(() => POSE_LIBRARY.find((pose) => pose.id === current?.poseId), [current]);
  const nextPose = useMemo(() => items.slice(index + 1).map((item) => ({ item, pose: POSE_LIBRARY.find((pose) => pose.id === item.poseId) })).find((row) => row.pose), [index, items]);
  const progress = items.length ? ((index + (complete ? 1 : 0)) / items.length) * 100 : 0;

  useEffect(() => {
    if (!running || complete || !current) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value > 1) return value - 1;
        if (index >= items.length - 1) {
          setRunning(false);
          setComplete(true);
          return 0;
        }
        setIndex((valueIndex) => valueIndex + 1);
        return (items[index + 1]?.minutes ?? 1) * 60;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [complete, current, index, items, running]);

  function goTo(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= items.length) return;
    setIndex(nextIndex);
    setSeconds((items[nextIndex]?.minutes ?? 1) * 60);
    setComplete(false);
    setRunning(false);
  }

  function finish() { setRunning(false); setComplete(true); }

  return <Layout title="課堂執行" action={<Link className="secondary-button inline-flex" href="/teacher/sequences">離開課堂</Link>}>
    <Head><title>{sequence ? `${sequence.name} · 課堂執行` : "課堂執行 | Sattva"}</title></Head>
    {loading ? <div className="session-state">正在載入序列…</div> : error ? <div className="session-state"><h2>{error}</h2><Link className="premium-button inline-flex" href="/teacher/sequences">回到序列庫</Link></div> : sequence ? <>
      <div className="teacher-tabs"><Link href="/teacher">Capability profile</Link><Link href="/teacher/planner">課程編排</Link><Link href="/teacher/toolkit">Teaching Toolkit</Link><Link className="teacher-tab-active" href="/teacher/session">課堂執行</Link></div>
      <section className="session-header"><div><p className="eyebrow">Live teaching · {sequence.classStyle}</p><h2>{sequence.name}</h2><p>{sequence.theme || "依序列逐步帶領"} · {sequence.duration} 分鐘 · {items.length} 個步驟</p></div><Link className="session-review-link" href={`/teacher/planner?edit=${sequence.id}`}>編輯序列 →</Link></section>
      <div className="session-progress"><span style={{ width: `${progress}%` }} /><div><b>{complete ? items.length : index + 1}</b>／{items.length} 個體式</div></div>
      {complete ? <section className="session-complete"><span>✓</span><p className="eyebrow">Practice complete</p><h2>這堂課完成了。</h2><p>保留一點時間觀察學生的呼吸與感受，再記下課後回饋。</p><div><button className="premium-button" onClick={() => { setIndex(0); setSeconds((items[0]?.minutes ?? 1) * 60); setComplete(false); }} type="button">重新開始</button><Link className="secondary-button inline-flex" href={`/teacher/planner?edit=${sequence.id}`}>記錄課後觀察</Link></div></section> : currentPose ? <section className="session-workspace">
        <aside className="session-rail"><p className="eyebrow">Sequence</p><ol>{items.map((item, itemIndex) => { const pose = POSE_LIBRARY.find((entry) => entry.id === item.poseId); return <li className={itemIndex === index ? "session-rail-active" : itemIndex < index ? "session-rail-done" : ""} key={item.instanceId}><button onClick={() => goTo(itemIndex)} type="button"><span>{itemIndex < index ? "✓" : String(itemIndex + 1).padStart(2, "0")}</span><strong>{pose?.zh ?? "體式"}</strong><small>{item.minutes} 分 · {item.phase}</small></button></li>; })}</ol></aside>
        <main className="session-current"><div className="session-phase"><span>{current.phase}</span><b>{index + 1} / {items.length}</b></div><div className="session-pose-visual"><PoseIllustration pose={`${currentPose.en} ${currentPose.zh}`} /></div><h1>{currentPose.zh}</h1><p className="session-pose-en">{currentPose.en} · {currentPose.sanskrit}</p><div className={`session-clock ${running ? "session-clock-running" : ""}`} aria-label={`剩餘 ${formatTime(seconds)}`}>{formatTime(seconds)}</div><div className="session-controls"><button aria-label="上一個體式" disabled={index === 0} onClick={() => goTo(index - 1)} type="button">← 上一個</button><button className="session-play" onClick={() => setRunning((value) => !value)} type="button">{running ? "暫停" : "開始計時"}</button><button aria-label="下一個體式" disabled={index === items.length - 1} onClick={() => goTo(index + 1)} type="button">下一個 →</button></div><button className="session-finish" onClick={finish} type="button">提前完成這堂課</button></main>
        <aside className="session-cue-card"><p className="eyebrow">Teaching note</p><h3>教學備註</h3><p>{current.note || currentPose.cues[0] || "保持呼吸穩定，讓學生選擇適合今天的幅度。"}</p><div className="session-next">{nextPose ? <><span>下一個</span><strong>{nextPose.pose?.zh}</strong><small>{nextPose.item.phase} · {nextPose.item.minutes} 分鐘</small></> : <><span>Sequence end</span><strong>休息與整合</strong><small>留意學生的回饋</small></>}</div></aside>
      </section> : null}
    </> : null}
  </Layout>;
}
