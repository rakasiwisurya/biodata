const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function parseISO(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatMonthYear(value: string | null | undefined): string {
  const d = parseISO(value);
  return d ? MONTH_YEAR.format(d) : "Present";
}

export function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined
): string {
  const s = parseISO(start);
  if (!s && !end) return "";
  if (!s) return formatMonthYear(end);
  return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
}
