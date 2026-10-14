export const STATUSES = ['todo', 'doing', 'review', 'done'] as const
export type Status = (typeof STATUSES)[number]

export const PRIORITIES = ['high', 'medium', 'low'] as const
export type Priority = (typeof PRIORITIES)[number]

export const TAGS = ['design', 'dev', 'content', 'bug'] as const
export type Tag = (typeof TAGS)[number]

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  tag: Tag
  /** Fecha límite en formato AAAA-MM-DD, o null si no tiene. */
  due: string | null
  subtasks: Subtask[]
}

export type TaskDraft = Omit<Task, 'id'>

export type Columns = Record<Status, string[]>

export interface BoardState {
  tasks: Record<string, Task>
  columns: Columns
  nextNumber: number
}

export type PriorityFilter = Priority | 'all'

export function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as Status)
}
