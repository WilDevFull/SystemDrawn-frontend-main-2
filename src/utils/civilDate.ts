function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function toCivilDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatCivilDate(value: string | null | undefined) {
  if (!value) return '';

  const dateParts = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!dateParts) return value;

  const [, year, month, day] = dateParts;
  return `${day}/${month}/${year}`;
}

export function formatLocalDate(date: Date) {
  return formatCivilDate(toCivilDateString(date));
}