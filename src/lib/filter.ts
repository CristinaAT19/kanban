import type { PriorityFilter, Task } from '../types'

export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function matchesFilters(task: Task, query: string, priority: PriorityFilter): boolean {
  if (priority !== 'all' && task.priority !== priority) return false
  const needle = normalize(query)
  return needle === '' || normalize(task.title).includes(needle)
}
