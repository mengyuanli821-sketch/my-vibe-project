import { splitSelections } from "@/lib/options";

type BodyMapProps = {
  value: string;
  onToggle: (region: string) => void;
};

type Marker = {
  label: string;
  left: string;
  top: string;
};

const FRONT_MARKERS: Marker[] = [
  { label: "Neck", left: "50%", top: "17%" },
  { label: "Shoulders", left: "34%", top: "24%" },
  { label: "Chest", left: "50%", top: "29%" },
  { label: "Wrists", left: "17%", top: "46%" },
  { label: "Abdomen", left: "50%", top: "41%" },
  { label: "Hips", left: "50%", top: "52%" },
  { label: "Knees", left: "40%", top: "72%" },
  { label: "Ankles & feet", left: "40%", top: "91%" }
];

const BACK_MARKERS: Marker[] = [
  { label: "Shoulders", left: "66%", top: "24%" },
  { label: "Upper back", left: "50%", top: "31%" },
  { label: "Lower back", left: "50%", top: "43%" },
  { label: "Hips", left: "50%", top: "52%" },
  { label: "Knees", left: "60%", top: "72%" },
  { label: "Ankles & feet", left: "60%", top: "91%" }
];

function BodyFigure({ side, markers, selected, onToggle }: { side: string; markers: Marker[]; selected: string[]; onToggle: (region: string) => void }) {
  return (
    <div className="body-figure">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{side}</p>
      <div className="relative mx-auto h-[390px] w-[190px]">
        <svg aria-hidden="true" className="h-full w-full" viewBox="0 0 190 390">
          <circle cx="95" cy="35" fill="#eadbc9" r="24" />
          <path d="M81 59h28l5 20 29 18 18 78-17 5-24-62-8 72 20 77-11 111H98l-3-99-3 99H69L58 267l20-77-8-72-24 62-17-5 18-78 29-18 5-20Z" fill="#eadbc9" stroke="#c9b49c" strokeLinejoin="round" strokeWidth="2" />
          <path d="M95 64v210M69 202h52" fill="none" opacity=".35" stroke="#b69a7d" strokeDasharray="3 5" />
        </svg>
        {markers.map((marker) => {
          const active = selected.includes(marker.label);
          return (
            <button
              aria-label={`${active ? "Remove" : "Select"} ${marker.label}`}
              aria-pressed={active}
              className={`body-marker ${active ? "body-marker-selected" : ""}`}
              key={`${side}-${marker.label}`}
              onClick={() => onToggle(marker.label)}
              style={{ left: marker.left, top: marker.top }}
              title={marker.label}
              type="button"
            >
              <span aria-hidden="true">{active ? "✓" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BodyMap({ value, onToggle }: BodyMapProps) {
  const selected = splitSelections(value);
  const selectedRegions = selected.filter((item) => [...FRONT_MARKERS, ...BACK_MARKERS].some((marker) => marker.label === item));

  return (
    <div className="body-map-shell">
      <div className="grid grid-cols-2 gap-2">
        <BodyFigure markers={FRONT_MARKERS} onToggle={onToggle} selected={selected} side="Front" />
        <BodyFigure markers={BACK_MARKERS} onToggle={onToggle} selected={selected} side="Back" />
      </div>
      <div aria-live="polite" className="border-t border-[#e2d9cd] px-4 py-3">
        <p className="text-xs font-semibold text-stone-700">Selected areas</p>
        <div className="mt-2 flex min-h-7 flex-wrap gap-2">
          {selectedRegions.length ? selectedRegions.map((region) => (
            <button className="rounded-full bg-[#e8f0eb] px-2.5 py-1 text-xs text-[#294a3c]" key={region} onClick={() => onToggle(region)} type="button">{region} ×</button>
          )) : <span className="text-xs font-normal text-stone-500">Tap a point on the body to record an area.</span>}
        </div>
      </div>
    </div>
  );
}
