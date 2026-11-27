const toDate = (s: string) => new Date(s.replace(" ", "T") + "Z");

const dateFmt = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" });
const dateTimeFmt = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 2026.11.27 */
export function formatDate(s: string) {
  const p = Object.fromEntries(dateFmt.formatToParts(toDate(s)).map((x) => [x.type, x.value]));
  return `${p.year}.${p.month}.${p.day}`;
}

/** 2026.11.27 14:05 */
export function formatDateTime(s: string) {
  const p = Object.fromEntries(dateTimeFmt.formatToParts(toDate(s)).map((x) => [x.type, x.value]));
  return `${p.year}.${p.month}.${p.day} ${p.hour}:${p.minute}`;
}

export function isRecent(s: string, hours = 24) {
  return Date.now() - toDate(s).getTime() < hours * 3600_000;
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
