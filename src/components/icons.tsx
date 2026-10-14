interface IconProps {
  size?: number
  strokeWidth?: number
}

export function LogoIcon() {
  return (
    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="1" y="1" width="26" height="26" rx="7" className="fill-accent" />
      <path d="M8 8v12M14 8v7M20 8v10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 10.6A6.8 6.8 0 0 1 7.4 2.5a6.8 6.8 0 1 0 8.1 8.1Z" />
    </svg>
  )
}

export function SunIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="3.2" />
      <path d="M9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1 5 13M13 5l1.1-1.1" />
    </svg>
  )
}

export function PlusIcon({ size = 16, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <rect x="1.5" y="2.5" width="11" height="10" rx="2" />
      <path d="M1.5 5.5h11M4.5 1v2.5M9.5 1v2.5" />
    </svg>
  )
}

export function ChecklistIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="11" height="11" rx="2.5" />
      <path d="m4.5 7 2 2 3-4" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 7.5 2.5 2.5L11 4.5" />
    </svg>
  )
}

export function CloseIcon({ size = 16 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="m4 4 8 8M12 4l-8 8" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4.5h11M6 4.5V3h4v1.5M4 4.5l.6 8.5h6.8l.6-8.5" />
    </svg>
  )
}
