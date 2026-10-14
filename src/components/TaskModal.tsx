import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { Status, Subtask, Task, TaskDraft } from '../types'
import { PRIORITIES, STATUSES, TAGS } from '../types'
import { PRIORITY_META, STATUS_META, TAG_META } from '../lib/meta'
import { CheckIcon, CloseIcon, PlusIcon, TrashIcon } from './icons'

interface TaskModalProps {
  /** Tarea a editar; si es null se crea una nueva. */
  task: Task | null
  initialStatus: Status
  onSave: (draft: TaskDraft) => void
  onDelete: (id: string) => void
  onClose: () => void
}

function emptyDraft(status: Status): TaskDraft {
  return { title: '', description: '', status, priority: 'medium', tag: 'dev', due: null, subtasks: [] }
}

function newSubtaskId(): string {
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

const fieldClass =
  'h-11 w-full rounded-[10px] border border-line bg-surface px-3 text-ink placeholder:text-muted'
const labelClass = 'text-sm font-medium'

export function TaskModal({ task, initialStatus, onSave, onDelete, onClose }: TaskModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [draft, setDraft] = useState<TaskDraft>(() => {
    if (!task) return emptyDraft(initialStatus)
    const { id: _id, ...rest } = task
    return structuredClone(rest)
  })
  const [newSubtask, setNewSubtask] = useState('')
  const uid = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  function updateSubtasks(fn: (subtasks: Subtask[]) => Subtask[]) {
    setDraft((d) => ({ ...d, subtasks: fn(d.subtasks) }))
  }

  function addSubtask() {
    const title = newSubtask.trim()
    if (!title) return
    updateSubtasks((list) => [...list, { id: newSubtaskId(), title, done: false }])
    setNewSubtask('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const title = draft.title.trim()
    if (!title) return
    onSave({
      ...draft,
      title,
      description: draft.description.trim(),
      subtasks: draft.subtasks.filter((s) => s.title.trim() !== ''),
    })
  }

  const titleId = `${uid}-titulo`

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close()
      }}
      className="m-auto w-[min(560px,calc(100vw-32px))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-lifted"
    >
      <form onSubmit={handleSubmit} className="flex max-h-[calc(100dvh-48px)] flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold tracking-[-0.01em]">
            {task ? (
              <>
                Editar tarea <span className="font-mono text-sm font-normal text-muted">{task.id}</span>
              </>
            ) : (
              'Nueva tarea'
            )}
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Cerrar"
            className="inline-flex size-10 items-center justify-center rounded-lg text-muted hover:bg-column hover:text-ink"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-title`} className={labelClass}>
              Título
            </label>
            <input
              id={`${uid}-title`}
              required
              autoFocus
              value={draft.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="¿Qué hay que hacer?"
              className={fieldClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${uid}-desc`} className={labelClass}>
              Descripción
            </label>
            <textarea
              id={`${uid}-desc`}
              rows={3}
              value={draft.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Detalles opcionales"
              className="w-full resize-y rounded-[10px] border border-line bg-surface px-3 py-2.5 text-ink placeholder:text-muted"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-status`} className={labelClass}>
                Estado
              </label>
              <select
                id={`${uid}-status`}
                value={draft.status}
                onChange={(e) => update('status', e.target.value as Status)}
                className={fieldClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-priority`} className={labelClass}>
                Prioridad
              </label>
              <select
                id={`${uid}-priority`}
                value={draft.priority}
                onChange={(e) => update('priority', e.target.value as TaskDraft['priority'])}
                className={fieldClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_META[p].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-tag`} className={labelClass}>
                Etiqueta
              </label>
              <select
                id={`${uid}-tag`}
                value={draft.tag}
                onChange={(e) => update('tag', e.target.value as TaskDraft['tag'])}
                className={fieldClass}
              >
                {TAGS.map((t) => (
                  <option key={t} value={t}>
                    {TAG_META[t].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`${uid}-due`} className={labelClass}>
                Fecha límite
              </label>
              <input
                id={`${uid}-due`}
                type="date"
                value={draft.due ?? ''}
                onChange={(e) => update('due', e.target.value || null)}
                className={fieldClass}
              />
            </div>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className={`${labelClass} mb-1.5`}>Subtareas</legend>
            {draft.subtasks.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {draft.subtasks.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={s.done}
                      aria-label={`Completada: ${s.title}`}
                      onClick={() =>
                        updateSubtasks((list) => list.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)))
                      }
                      className={`inline-flex size-6 shrink-0 items-center justify-center rounded-md border ${
                        s.done ? 'border-accent bg-accent text-white' : 'border-line-strong bg-surface'
                      }`}
                    >
                      {s.done && <CheckIcon />}
                    </button>
                    <input
                      aria-label="Título de la subtarea"
                      value={s.title}
                      onChange={(e) =>
                        updateSubtasks((list) =>
                          list.map((x) => (x.id === s.id ? { ...x, title: e.target.value } : x)),
                        )
                      }
                      className={`h-10 min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 hover:border-line focus:border-line ${
                        s.done ? 'text-muted line-through' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => updateSubtasks((list) => list.filter((x) => x.id !== s.id))}
                      aria-label={`Eliminar subtarea: ${s.title}`}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-column hover:text-danger"
                    >
                      <CloseIcon size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                aria-label="Nueva subtarea"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSubtask()
                  }
                }}
                placeholder="Añadir subtarea"
                className={`${fieldClass} min-w-0 flex-1`}
              />
              <button
                type="button"
                onClick={addSubtask}
                aria-label="Añadir subtarea"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink hover:border-line-strong"
              >
                <PlusIcon />
              </button>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
          {task ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`¿Eliminar la tarea ${task.id}?`)) onDelete(task.id)
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-[10px] px-3 font-medium text-danger hover:bg-column"
            >
              <TrashIcon />
              Eliminar
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="min-h-11 rounded-[10px] border border-line px-4 font-medium hover:border-line-strong"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-11 rounded-[10px] bg-accent px-[18px] font-medium text-white hover:brightness-110"
            >
              {task ? 'Guardar' : 'Crear tarea'}
            </button>
          </div>
        </div>
      </form>
    </dialog>
  )
}
