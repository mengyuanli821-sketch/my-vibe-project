import { CLASS_STATUS_COPY } from "@/lib/classStatus";
import type { ClassStatus } from "@/types/student";

export function ClassStatusLight({ status, compact = false }: { status: ClassStatus; compact?: boolean }) {
  const copy = CLASS_STATUS_COPY[status];
  return (
    <div className={`status-light ${compact ? "status-light-compact" : ""}`} title={copy.detail}>
      <span aria-hidden="true" className="traffic-lens traffic-red" data-active={status === "red"} />
      <span aria-hidden="true" className="traffic-lens traffic-amber" data-active={status === "amber"} />
      <span aria-hidden="true" className="traffic-lens traffic-green" data-active={status === "green"} />
      <span className="status-copy"><strong>{copy.label}</strong>{compact ? null : <small>{copy.detail}</small>}</span>
    </div>
  );
}
