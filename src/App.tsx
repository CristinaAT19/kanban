import { useState } from 'react'
import type { PriorityFilter, Status } from './types'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { TaskModal } from './components/TaskModal'
import { Toolbar } from './components/Toolbar'
import { useTheme } from './hooks/useTheme'
import { useBoard } from './store/useBoard'

type Editor = { mode: 'closed' } | { mode: 'new'; status: Status } | { mode: 'edit'; id: string }

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [state, dispatch] = useBoard()
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<PriorityFilter>('all')
  const [editor, setEditor] = useState<Editor>({ mode: 'closed' })

  const editingTask = editor.mode === 'edit' ? (state.tasks[editor.id] ?? null) : null
  const close = () => setEditor({ mode: 'closed' })

  return (
    <div className="flex min-h-dvh flex-col">
      <Header theme={theme} onToggleTheme={toggleTheme} onNewTask={() => setEditor({ mode: 'new', status: 'todo' })} />
      <main className="flex flex-1 flex-col gap-6 px-[clamp(16px,3vw,32px)] py-6">
        <Toolbar query={query} onQueryChange={setQuery} priority={priority} onPriorityChange={setPriority} />
        <Board
          state={state}
          dispatch={dispatch}
          query={query}
          priority={priority}
          onOpenTask={(id) => setEditor({ mode: 'edit', id })}
          onAddTask={(status) => setEditor({ mode: 'new', status })}
        />
      </main>

      {editor.mode !== 'closed' && (editor.mode === 'new' || editingTask) && (
        <TaskModal
          key={editor.mode === 'edit' ? editor.id : `new-${editor.status}`}
          task={editingTask}
          initialStatus={editor.mode === 'new' ? editor.status : 'todo'}
          onSave={(draft) => {
            if (editingTask) dispatch({ type: 'update', id: editingTask.id, draft })
            else dispatch({ type: 'add', draft })
            close()
          }}
          onDelete={(id) => {
            dispatch({ type: 'delete', id })
            close()
          }}
          onClose={close}
        />
      )}
    </div>
  )
}
