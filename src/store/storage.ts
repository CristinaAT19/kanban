import { createSeed } from '../data/seed'
import type { BoardState } from '../types'
import { PRIORITIES, STATUSES, TAGS } from '../types'

const STORAGE_KEY = 'trama:tablero'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidTask(task: unknown, id: string): boolean {
  if (!isRecord(task)) return false
  return (
    task.id === id &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    STATUSES.includes(task.status as never) &&
    PRIORITIES.includes(task.priority as never) &&
    TAGS.includes(task.tag as never) &&
    (task.due === null || typeof task.due === 'string') &&
    Array.isArray(task.subtasks) &&
    task.subtasks.every(
      (s) =>
        isRecord(s) &&
        typeof s.id === 'string' &&
        typeof s.title === 'string' &&
        typeof s.done === 'boolean',
    )
  )
}

function isValidBoard(value: unknown): value is BoardState {
  if (!isRecord(value) || !isRecord(value.tasks) || !isRecord(value.columns)) return false
  if (typeof value.nextNumber !== 'number' || !Number.isInteger(value.nextNumber)) return false

  const { tasks, columns } = value
  const seen = new Set<string>()
  for (const status of STATUSES) {
    const ids = columns[status]
    if (!Array.isArray(ids)) return false
    for (const id of ids) {
      if (typeof id !== 'string' || seen.has(id)) return false
      const task = tasks[id]
      if (!isValidTask(task, id) || (task as { status: string }).status !== status) return false
      seen.add(id)
    }
  }
  return seen.size === Object.keys(tasks).length
}

/** Interpreta lo guardado; ante cualquier dato ausente o corrupto devuelve la semilla. */
export function parseBoard(raw: string | null): BoardState {
  if (raw === null) return createSeed()
  try {
    const value: unknown = JSON.parse(raw)
    return isValidBoard(value) ? value : createSeed()
  } catch {
    return createSeed()
  }
}

export function loadBoard(): BoardState {
  try {
    return parseBoard(localStorage.getItem(STORAGE_KEY))
  } catch {
    return createSeed()
  }
}

export function saveBoard(state: BoardState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Sin almacenamiento disponible (modo privado, cuota): el tablero sigue en memoria.
  }
}
