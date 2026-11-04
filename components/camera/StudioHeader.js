'use client'

function CameraMark() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h11M19 6h1M4 12h5M13 12h7M4 18h9M17 18h3" />
      <circle cx="17" cy="6" r="2" />
      <circle cx="11" cy="12" r="2" />
      <circle cx="15" cy="18" r="2" />
    </svg>
  )
}

export default function StudioHeader({ onOpenSettings }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-black/10 py-5">
      {/* Brand */}
      <div className="flex min-w-0 items-center gap-2">
        <CameraMark />
        <span className="truncate font-serif text-lg tracking-tight">Photo Booth</span>
        <span className="hidden font-serif text-lg italic text-black/50 sm:inline">di browser</span>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Buka pengaturan sesi"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 transition hover:border-black/40 hover:text-black active:scale-95 lg:hidden"
        >
          <SlidersIcon />
        </button>
      </div>
    </header>
  )
}
