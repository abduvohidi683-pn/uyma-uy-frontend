import type { PropertyStatus } from "../../types/property";
import { STATUS_LABELS } from "../../utils/format";
import "./StatusBadge.css";

/** PENDING — sariq, APPROVED — yashil, REJECTED — qizil (Notion 4-bo'lim). */
function StatusBadge({ status }: { status: PropertyStatus }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default StatusBadge;
