const formatter = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })

/** "2026-10-18" → "18 oct" */
export function formatDue(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return iso
  return formatter.format(date).replace('.', '')
}

export function todayIso(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export function isOverdue(due: string | null, today = todayIso()): boolean {
  return due !== null && due < today
}
