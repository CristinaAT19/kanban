import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Status, Task } from '../types'
import { STATUS_META } from '../lib/meta'
import { PlusIcon } from './icons'
import { SortableTaskCard } from './TaskCard'

interface ColumnProps {
  status: Status
  tasks: Task[]
  total: number
  onOpenTask: (id: string) => void
  onAddTask: (status: Status) => void
}

export function Column({ status, tasks, total, onOpenTask, onAddTask }: ColumnProps) {
  const meta = STATUS_META[status]
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { status } })
  const headingId = `columna-${status}`
  const filtered = tasks.length !== total

  return (
    <section
      aria-labelledby={headingId}
      className={`flex min-w-0 flex-col gap-3 rounded-2xl bg-column p-3 ${isOver ? 'ring-2 ring-accent-ink' : ''}`}
    >
      <header className="flex items-center justify-between gap-2 px-1">
        <h2 id={headingId} className="flex items-center gap-2 text-sm font-semibold">
          <span className={`size-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
          {meta.label}
          <span className="font-mono text-xs font-normal text-muted">
            {filtered ? `${tasks.length}/${total}` : total}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          aria-label={`Añadir tarea en ${meta.label}`}
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-ink"
        >
          <PlusIcon />
        </button>
      </header>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="flex min-h-24 flex-1 flex-col gap-2.5">
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))}
          {tasks.length === 0 && (
            <li className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-dash px-3 text-center text-sm text-muted">
              {filtered ? 'Ninguna tarea coincide' : 'Suelta aquí una tarea'}
            </li>
          )}
        </ul>
      </SortableContext>
    </section>
  )
}
