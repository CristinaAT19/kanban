import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../types'
import { formatDue, isOverdue } from '../lib/dates'
import { PRIORITY_META, TAG_META } from '../lib/meta'
import { CalendarIcon, ChecklistIcon } from './icons'

interface TaskCardProps {
  task: Task
  onOpen?: (id: string) => void
  lifted?: boolean
}

export function TaskCard({ task, onOpen, lifted = false }: TaskCardProps) {
  const tag = TAG_META[task.tag]
  const priority = PRIORITY_META[task.priority]
  const total = task.subtasks.length
  const done = task.subtasks.filter((s) => s.done).length
  const overdue = task.status !== 'done' && isOverdue(task.due)

  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border border-line bg-surface p-3.5 ${
        lifted ? 'rotate-[1.5deg] shadow-lifted' : 'shadow-card hover:border-line-strong'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted">{task.id}</span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${tag.chip}`}>{tag.label}</span>
      </div>

      <h3 className="text-[15px] leading-snug font-medium">
        <button
          type="button"
          onClick={() => onOpen?.(task.id)}
          // Evita que Enter/Espacio sobre el título inicie un arrastre con teclado.
          onKeyDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          className="text-left hover:underline"
        >
          {task.title}
        </button>
      </h3>

      {total > 0 && (
        <div className="flex items-center gap-2.5 text-xs text-muted">
          <ChecklistIcon />
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-track"
            role="progressbar"
            aria-label="Subtareas completadas"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
          >
            <div className="h-full rounded-full bg-accent-ink" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="font-mono">
            {done}/{total}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <span className={`size-2 rounded-full ${priority.dot}`} aria-hidden="true" />
          {priority.label}
        </span>
        {task.due && (
          <span className={`inline-flex items-center gap-1.5 ${overdue ? 'font-medium text-danger' : 'text-muted'}`}>
            <CalendarIcon />
            <span>
              {formatDue(task.due)}
              {overdue && <span className="sr-only"> (vencida)</span>}
            </span>
          </span>
        )}
      </div>
    </article>
  )
}

interface SortableTaskCardProps {
  task: Task
  onOpen: (id: string) => void
}

export function SortableTaskCard({ task, onOpen }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`touch-none rounded-xl cursor-grab ${isDragging ? 'opacity-40' : ''}`}
      {...attributes}
      {...listeners}
      aria-roledescription="tarea arrastrable"
    >
      <TaskCard task={task} onOpen={onOpen} />
    </li>
  )
}
