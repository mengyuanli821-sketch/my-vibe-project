import { useCallback, useEffect, useRef, useState } from "react";

type AudioGraph = {
  context: AudioContext;
  master: GainNode;
  sources: AudioScheduledSourceNode[];
};

function createAmbientSound(): AudioGraph {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const context = new AudioContextClass();
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.075, context.currentTime + 2.8);
  master.connect(context.destination);

  const sources: AudioScheduledSourceNode[] = [];
  [130.81, 196, 261.63].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index === 1 ? -7 : index === 2 ? 5 : 0;
    gain.gain.value = index === 0 ? .48 : .2;
    filter.type = "lowpass";
    filter.frequency.value = 650;
    oscillator.connect(filter).connect(gain).connect(master);
    oscillator.start();
    sources.push(oscillator);
  });

  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  lfo.frequency.value = .075;
  lfoGain.gain.value = .016;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();
  sources.push(lfo);
  return { context, master, sources };
}

function playBell(context: AudioContext, destination: AudioNode, ending = false) {
  const now = context.currentTime;
  const notes = ending ? [523.25, 659.25, 783.99] : [659.25];
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now + index * .28);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * .995, now + index * .28 + 2.2);
    gain.gain.setValueAtTime(.0001, now + index * .28);
    gain.gain.exponentialRampToValueAtTime(.18, now + index * .28 + .025);
    gain.gain.exponentialRampToValueAtTime(.0001, now + index * .28 + 2.2);
    oscillator.connect(gain).connect(destination);
    oscillator.start(now + index * .28);
    oscillator.stop(now + index * .28 + 2.25);
  });
}

export function MeditationPlayer() {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(5);
  const [remaining, setRemaining] = useState(0);
  const [meditating, setMeditating] = useState(false);
  const audioRef = useRef<AudioGraph | null>(null);
  const endAtRef = useRef(0);
  const warnedRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);

  function startSound() {
    if (pauseTimerRef.current) { window.clearTimeout(pauseTimerRef.current); pauseTimerRef.current = null; }
    if (!audioRef.current || audioRef.current.context.state === "closed") audioRef.current = createAmbientSound();
    else {
      if (audioRef.current.context.state === "suspended") void audioRef.current.context.resume();
      audioRef.current.master.gain.cancelScheduledValues(audioRef.current.context.currentTime);
      audioRef.current.master.gain.setValueAtTime(Math.max(.0001, audioRef.current.master.gain.value), audioRef.current.context.currentTime);
      audioRef.current.master.gain.exponentialRampToValueAtTime(.075, audioRef.current.context.currentTime + 1.5);
    }
    setPlaying(true);
  }

  const pauseSound = useCallback(() => {
    if (audioRef.current?.context.state === "running") void audioRef.current.context.suspend();
    setPlaying(false);
  }, []);

  function toggleSound() { if (playing) pauseSound(); else startSound(); }

  function startMeditation() {
    startSound();
    warnedRef.current = false;
    endAtRef.current = Date.now() + duration * 60_000;
    setRemaining(duration * 60);
    setMeditating(true);
  }

  const finishMeditation = useCallback(() => {
    const graph = audioRef.current;
    if (graph) {
      if (graph.context.state === "suspended") void graph.context.resume();
      graph.master.gain.cancelScheduledValues(graph.context.currentTime);
      graph.master.gain.setValueAtTime(Math.max(.0001, graph.master.gain.value), graph.context.currentTime);
      graph.master.gain.exponentialRampToValueAtTime(.0001, graph.context.currentTime + 4);
      playBell(graph.context, graph.context.destination, true);
    }
    setMeditating(false);
    setRemaining(0);
    pauseTimerRef.current = window.setTimeout(() => { pauseSound(); pauseTimerRef.current = null; }, 4300);
  }, [pauseSound]);

  useEffect(() => {
    if (!meditating) return;
    const timer = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(seconds);
      if (seconds <= 10 && seconds > 0 && !warnedRef.current && audioRef.current) {
        warnedRef.current = true;
        playBell(audioRef.current.context, audioRef.current.context.destination);
      }
      if (seconds === 0) { window.clearInterval(timer); finishMeditation(); }
    }, 250);
    return () => window.clearInterval(timer);
  }, [finishMeditation, meditating]);

  useEffect(() => () => {
    if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
    const graph = audioRef.current;
    graph?.sources.forEach((source) => { try { source.stop(); } catch { /* Already stopped. */ } });
    if (graph && graph.context.state !== "closed") void graph.context.close();
  }, []);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = meditating ? 1 - remaining / (duration * 60) : 0;

  return <section className={`meditation-player ${meditating ? "meditation-active" : ""}`}>
    <div className="meditation-orb" style={{ "--meditation-progress": `${progress * 360}deg` } as React.CSSProperties}><span>{meditating ? `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}` : "ॐ"}</span></div>
    <div className="meditation-copy"><p className="eyebrow">Pause & breathe</p><h2>快速冥想</h2><p>{meditating ? "讓呼吸自然流動，結束前會以柔和鈴聲提醒你。" : "選擇一段安靜時間，讓聲音陪你回到當下。"}</p><div className="meditation-controls"><button aria-pressed={playing} className="sound-toggle" onClick={toggleSound} type="button"><span>{playing ? "Ⅱ" : "▶"}</span>{playing ? "暫停背景音樂" : "播放背景音樂"}</button>{!meditating ? <><select aria-label="冥想時長" onChange={(event) => setDuration(Number(event.target.value))} value={duration}>{[1,3,5,10,15,20,30].map((value) => <option key={value} value={value}>{value} 分鐘</option>)}</select><button className="meditation-start" onClick={startMeditation} type="button">開始冥想</button></> : <button className="meditation-stop" onClick={finishMeditation} type="button">提前結束</button>}</div></div>
  </section>;
}
