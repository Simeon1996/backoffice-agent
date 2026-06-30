const DAY_START_HOUR = 9;

/** Format ms-since-DAY_START as a wall clock like "09:18". */
export function fmtClock(ms: number): string {
  const totalMin = Math.floor(ms / 60_000);
  const h = (DAY_START_HOUR + Math.floor(totalMin / 60)) % 24;
  const m = totalMin % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Money: 12400 -> "$12,400". */
export function fmtMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

/** Confidence: 0.984 -> "98%". */
export function fmtConfidence(c: number): string {
  return `${Math.round(c * 100)}%`;
}

/** A readable date from an ISO-ish "2026-06-24" -> "Jun 24, 2026". */
export function fmtDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}`;
}
