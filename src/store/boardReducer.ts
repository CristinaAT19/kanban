import type { BoardState, Columns, Status, TaskDraft } from '../types'
import { STATUSES } from '../types'

export type BoardAction =
  | { type: 'add'; draft: TaskDraft }
  | { type: 'update'; id: string; draft: TaskDraft }
  | { type: 'delete'; id: string }
  /** Coloca la tarea en `status` justo delante de `overId`; con null va al final. */
  | { type: 'move'; id: string; status: Status; overId: string | null }

export function formatTaskId(n: number): string {
  return `TRA-${String(n).padStart(2, '0')}`
}

export function findColumn(columns: Columns, id: string): Status | null {
  return STATUSES.find((status) => columns[status].includes(id)) ?? null
}

/** Devuelve las columnas con `id` insertado en `status` delante de `overId` (o al final). */
export function placeBefore(
  columns: Columns,
  id: string,
  status: Status,
  overId: string | null,
): Columns {
  if (overId === id) return columns
  const next = {} as Columns
  for (const s of STATUSES) next[s] = columns[s].filter((taskId) => taskId !== id)
  const index = overId === null ? -1 : next[status].indexOf(overId)
  if (index === -1) next[status].push(id)
  else next[status].splice(index, 0, id)
  return next
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'add': {
      const id = formatTaskId(state.nextNumber)
      const { draft } = action
      return {
        tasks: { ...state.tasks, [id]: { ...draft, id } },
        columns: { ...state.columns, [draft.status]: [...state.columns[draft.status], id] },
        nextNumber: state.nextNumber + 1,
      }
    }
    case 'update': {
      const current = state.tasks[action.id]
      if (!current) return state
      const { draft } = action
      return {
        ...state,
        tasks: { ...state.tasks, [action.id]: { ...draft, id: action.id } },
        columns:
          draft.status === current.status
            ? state.columns
            : placeBefore(state.columns, action.id, draft.status, null),
      }
    }
    case 'delete': {
      if (!state.tasks[action.id]) return state
      const tasks = { ...state.tasks }
      delete tasks[action.id]
      const columns = {} as Columns
      for (const s of STATUSES) columns[s] = state.columns[s].filter((id) => id !== action.id)
      return { ...state, tasks, columns }
    }
    case 'move': {
      const task = state.tasks[action.id]
      if (!task) return state
      return {
        ...state,
        tasks:
          task.status === action.status
            ? state.tasks
            : { ...state.tasks, [action.id]: { ...task, status: action.status } },
        columns: placeBefore(state.columns, action.id, action.status, action.overId),
      }
    }
  }
}
