import { useState, type Dispatch } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { BoardState, PriorityFilter, Status } from '../types'
import { STATUSES, isStatus } from '../types'
import { matchesFilters } from '../lib/filter'
import { STATUS_META } from '../lib/meta'
import { findColumn, type BoardAction } from '../store/boardReducer'
import { Column } from './Column'
import { TaskCard } from './TaskCard'

interface BoardProps {
  state: BoardState
  dispatch: Dispatch<BoardAction>
  query: string
  priority: PriorityFilter
  onOpenTask: (id: string) => void
  onAddTask: (status: Status) => void
}

export function Board({ state, dispatch, query, priority, onOpenTask, onAddTask }: BoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeTask = activeId ? state.tasks[activeId] : undefined

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return
    const id = String(active.id)
    const overKey = String(over.id)
    const from = findColumn(state.columns, id)
    if (!from) return

    // Soltada sobre el hueco de una columna: va al final.
    if (isStatus(overKey)) {
      if (overKey !== from) dispatch({ type: 'move', id, status: overKey, overId: null })
      return
    }

    const to = findColumn(state.columns, overKey)
    if (!to || overKey === id) return

    if (to !== from) {
      dispatch({ type: 'move', id, status: to, overId: overKey })
      return
    }

    // Misma columna: se reordena y se toma como referencia la tarea que queda detrás.
    const ids = state.columns[from]
    const newIndex = ids.indexOf(overKey)
    const reordered = arrayMove(ids, ids.indexOf(id), newIndex)
    dispatch({ type: 'move', id, status: to, overId: reordered[newIndex + 1] ?? null })
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            'Para mover una tarea pulsa Espacio, usa las flechas para cambiarla de sitio y vuelve a pulsar Espacio para soltarla. Escape cancela.',
        },
        announcements: {
          onDragStart: ({ active }) => `Tarea ${active.id} levantada.`,
          onDragOver: ({ active, over }) =>
            over ? `Tarea ${active.id} sobre ${describe(String(over.id))}.` : `Tarea ${active.id} fuera de las columnas.`,
          onDragEnd: ({ active, over }) =>
            over ? `Tarea ${active.id} soltada en ${describe(String(over.id))}.` : `Tarea ${active.id} soltada.`,
          onDragCancel: ({ active }) => `Movimiento de la tarea ${active.id} cancelado.`,
        },
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((status) => {
          const ids = state.columns[status]
          const tasks = ids.map((id) => state.tasks[id]).filter((t) => matchesFilters(t, query, priority))
          return (
            <Column
              key={status}
              status={status}
              tasks={tasks}
              total={ids.length}
              onOpenTask={onOpenTask}
              onAddTask={onAddTask}
            />
          )
        })}
      </div>
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} lifted /> : null}</DragOverlay>
    </DndContext>
  )

  function describe(key: string): string {
    if (isStatus(key)) return `la columna ${STATUS_META[key].label}`
    const column = findColumn(state.columns, key)
    return column ? `la tarea ${key} de ${STATUS_META[column].label}` : key
  }
}
