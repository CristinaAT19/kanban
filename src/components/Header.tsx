import type { Theme } from '../hooks/useTheme'
import { LogoIcon, MoonIcon, PlusIcon, SunIcon } from './icons'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
  onNewTask: () => void
}

export function Header({ theme, onToggleTheme, onNewTask }: HeaderProps) {
  const isDark = theme === 'dark'
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line bg-surface px-[clamp(16px,3vw,32px)] py-3.5">
      <div className="flex items-center gap-3">
        <LogoIcon />
        <span className="text-[19px] font-semibold tracking-[-0.02em]">Trama</span>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          className="inline-flex size-11 items-center justify-center rounded-[10px] border border-line bg-surface text-ink hover:border-line-strong"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <button
          type="button"
          onClick={onNewTask}
          className="inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-accent px-[18px] font-medium text-white hover:brightness-110"
        >
          <PlusIcon strokeWidth={1.7} />
          Nueva tarea
        </button>
      </div>
    </header>
  )
}
