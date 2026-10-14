import type { Priority, Status, Tag } from '../types'

export const STATUS_META: Record<Status, { label: string; dot: string }> = {
  todo: { label: 'Por hacer', dot: 'bg-status-todo' },
  doing: { label: 'En curso', dot: 'bg-status-doing' },
  review: { label: 'En revisión', dot: 'bg-status-review' },
  done: { label: 'Hecho', dot: 'bg-accent-ink' },
}

export const PRIORITY_META: Record<Priority, { label: string; dot: string; dotInverse: string }> = {
  high: { label: 'Alta', dot: 'bg-prio-high', dotInverse: 'bg-prio-high-inverse' },
  medium: { label: 'Media', dot: 'bg-prio-medium', dotInverse: 'bg-prio-medium' },
  low: { label: 'Baja', dot: 'bg-prio-low', dotInverse: 'bg-prio-low' },
}

export const TAG_META: Record<Tag, { label: string; chip: string }> = {
  design: { label: 'Diseño', chip: 'bg-tag-design-bg text-tag-design-fg' },
  dev: { label: 'Desarrollo', chip: 'bg-tag-dev-bg text-tag-dev-fg' },
  content: { label: 'Contenido', chip: 'bg-tag-content-bg text-tag-content-fg' },
  bug: { label: 'Error', chip: 'bg-tag-bug-bg text-tag-bug-fg' },
}
