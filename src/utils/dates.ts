export function formatDateTime(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

export function statusSentence(status: string, opensAt: string, deadlineAt: string) {
  if (status === "waiting") return `Opens ${formatDateTime(opensAt)}.`;
  if (status === "locked") return `Sealed after ${formatDateTime(deadlineAt)}.`;
  return `Open for wishes until ${formatDateTime(deadlineAt)}.`;
}

export function toLocalInput(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  const pad = (part: number) => String(part).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes())
  ].join("");
}

export function fromLocalInput(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}

export function nextSundaySchedule() {
  const today = new Date();
  const daysUntilSunday = (7 - today.getDay()) % 7 || 7;
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);
  sunday.setHours(13, 0, 0, 0);

  const opensAt = new Date(sunday);
  opensAt.setDate(sunday.getDate() - 2);
  opensAt.setHours(9, 0, 0, 0);

  const deadlineAt = new Date(sunday);
  deadlineAt.setHours(10, 0, 0, 0);

  return {
    dateLabel: formatPickupDate({ pickupAt: sunday.toISOString(), dateLabel: "" }),
    opensAt: toLocalInput(opensAt),
    deadlineAt: toLocalInput(deadlineAt),
    pickupAt: toLocalInput(sunday),
    opensAtIso: opensAt.toISOString(),
    deadlineAtIso: deadlineAt.toISOString(),
    pickupAtIso: sunday.toISOString()
  };
}

interface DateLikeEvent {
  dateLabel?: string;
  deadlineAt?: string;
  pickupAt?: string;
}

export function formatPickupDate(event: DateLikeEvent) {
  const date = event.pickupAt ? new Date(event.pickupAt) : parseDateLabel(event.dateLabel) || new Date(event.deadlineAt || "");

  if (Number.isFinite(date.getTime())) {
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${weekday} ${day}.${month}.${date.getFullYear()}`;
  }

  return event.dateLabel || "Sunday";
}

export function formatPickupTime(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function parseDateLabel(dateLabel?: string) {
  if (!dateLabel) return null;

  const currentYear = new Date().getFullYear();
  const withYear = /\b\d{4}\b/.test(dateLabel) ? dateLabel : `${dateLabel}, ${currentYear}`;
  const parsed = new Date(withYear);

  return Number.isFinite(parsed.getTime()) ? parsed : null;
}
