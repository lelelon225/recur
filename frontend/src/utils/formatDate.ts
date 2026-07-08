export function formatDate(d: string): string | null {
  const date = new Date(d);
  return isNaN(date.getTime()) ? null : date.toLocaleDateString("de-DE");
}
