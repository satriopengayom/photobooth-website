'use client'

export default function CountdownOverlay({ secondsLeft, isActive, onCancel, allowCancel = true }) {
  if (!isActive) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <div className="text-center">
        <div
          className="font-serif text-5xl leading-none text-white sm:text-6xl"
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.35)' }}
        >
          {secondsLeft}
        </div>

        <p
          className="mt-2 text-[10px] uppercase tracking-[0.18em] text-white/85"
          style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}
        >
          Bersiap untuk foto…
        </p>

        {allowCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="pointer-events-auto mt-4 text-[10px] font-medium text-white/75 underline decoration-white/35 underline-offset-4 transition hover:text-white"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}
          >
            Batalkan
          </button>
        )}
      </div>
    </div>
  )
}
