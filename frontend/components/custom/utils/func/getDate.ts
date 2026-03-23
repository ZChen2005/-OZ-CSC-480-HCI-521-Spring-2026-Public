export default function getWorklogDate(semesterStart: Date) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;

  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + (dayOfWeek === 1 ? 0 : daysUntilMonday));
  nextMonday.setHours(23, 59, 0, 0);

  if (nextMonday < semesterStart) return null;

  const diffMs = nextMonday.getTime() - semesterStart.getTime();
  const weekNumber = String(Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1);

  const label = nextMonday.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    due: label,
    weekNumber,
  };
}
