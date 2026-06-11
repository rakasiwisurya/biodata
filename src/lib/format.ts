const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(date: Date | null | undefined): string {
  if (!date) return "Present";
  return MONTH_YEAR.format(date);
}

export function formatPeriod(start: Date | null | undefined, end: Date | null | undefined): string {
  if (!start && !end) return "";
  if (!start) return formatMonthYear(end);
  return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
}
