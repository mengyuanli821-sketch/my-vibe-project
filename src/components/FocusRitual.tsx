import { useEffect, useState } from "react";

function phaseForTime(elapsed: number) {
  const position = elapsed % 12;
  if (position < 4) return "Inhale";
  if (position < 6) return "Hold softly";
  return "Exhale";
}

export function FocusRitual() {
  const [remaining, setRemaining] = useState(60);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          setActive(false);
          return 60;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  const elapsed = 60 - remaining;

  return (
    <div className={`focus-sanctuary ${active ? "focus-active" : ""}`}>
      <div aria-hidden="true" className="spiritual-orbit orbit-one" />
      <div aria-hidden="true" className="spiritual-orbit orbit-two" />
      <div aria-hidden="true" className="spiritual-orbit orbit-three" />
      <div aria-hidden="true" className="spirit-particles">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</div>

      <div className="relative z-[2]">
        <svg aria-hidden="true" className="lotus-awakening mx-auto h-24 w-24" viewBox="0 0 100 100">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
            <path className="lotus-petal petal-center" d="M50 70C34 54 36 32 50 17c14 15 16 37 0 53Z" />
            <path className="lotus-petal petal-left" d="M47 73C25 69 15 52 16 35c18 1 31 14 31 38Z" />
            <path className="lotus-petal petal-right" d="M53 73c22-4 32-21 31-38-18 1-31 14-31 38Z" />
            <path className="lotus-petal petal-low-left" d="M47 76C27 82 13 73 8 61c17-5 30 0 39 15Z" />
            <path className="lotus-petal petal-low-right" d="M53 76c20 6 34-3 39-15-17-5-30 0-39 15Z" />
            <path d="M22 83c16 7 40 7 56 0" />
          </g>
        </svg>

        <div className="breath-orb" aria-live="polite">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{active ? phaseForTime(elapsed) : "Arrive"}</span>
          {active ? <strong>{remaining}</strong> : null}
        </div>

        <p className="mt-4 font-serif text-xl italic text-[#6e4f39]">{active ? "Follow one breath at a time" : "Begin before you teach"}</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-stone-500">{active ? "4 inhale · 2 pause · 6 exhale" : "A 60-second focus ritual"}</p>
        <button className="mt-5 rounded-full border border-[#cda983] bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#7c573d] backdrop-blur-sm hover:bg-white" onClick={() => { setRemaining(60); setActive((current) => !current); }} type="button">
          {active ? "End ritual" : "Begin focus"}
        </button>
      </div>
    </div>
  );
}
