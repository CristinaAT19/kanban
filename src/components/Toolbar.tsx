import type { PriorityFilter } from '../types'
import { PRIORITIES } from '../types'
import { PRIORITY_META } from '../lib/meta'
import { SearchIcon } from './icons'

interface ToolbarProps {
  query: string
  onQueryChange: (query: string) => void
  priority: PriorityFilter
  onPriorityChange: (priority: PriorityFilter) => void
}

const FILTERS: { value: PriorityFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  ...PRIORITIES.map((value) => ({ value, label: PRIORITY_META[value].label })),
]

export function Toolbar({ query, onQueryChange, priority, onPriorityChange }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-8">
      <div className="flex flex-col gap-1">
        <div className="font-mono text-xs tracking-[0.04em] text-muted uppercase">Tablero</div>
        <h1 className="text-[clamp(24px,2.6vw,32px)] leading-[1.15] font-semibold tracking-[-0.03em]">
          Rediseño del sitio web
        </h1>
      </div>
      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 sm:flex-[1_1_220px]">
          <label htmlFor="buscar" className="sr-only">
            Buscar tareas
          </label>
          <SearchIcon className="pointer-events-none absolute top-3.5 left-3.5 text-muted" />
          <input
            id="buscar"
            type="search"
            placeholder="Buscar tareas"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-11 w-full rounded-[10px] border border-line bg-surface pr-3.5 pl-10 text-ink placeholder:text-muted"
          />
        </div>
        <div
          role="group"
          aria-label="Filtrar por prioridad"
          className="flex gap-0.5 rounded-[10px] border border-line bg-surface p-1"
        >
          {FILTERS.map(({ value, label }) => {
            const selected = priority === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => onPriorityChange(value)}
                className={`relative min-h-9 flex-1 rounded-[7px] px-3.5 text-sm after:absolute after:inset-x-0 after:-inset-y-1 sm:flex-none ${
                  selected ? 'bg-ink font-medium text-surface' : 'text-ink hover:bg-column'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
