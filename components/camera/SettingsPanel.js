'use client'

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
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

function InfoIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-7h.01" />
    </svg>
  )
}

function Segment({ active, disabled, onClick, label, small = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-sm px-2 py-2 text-center font-semibold transition ${
        small ? 'text-[10px] leading-tight' : 'text-[10px] uppercase tracking-[0.08em]'
      } ${
        active
          ? 'bg-[#1E1C1A] text-white shadow-sm'
          : 'bg-white text-black/55 hover:text-black'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      {label}
      {active && <CheckIcon />}
    </button>
  )
}

export default function SettingsPanel({
  settings,
  sessionStarted,
  onUpdate,
  showTitle = true,
  onOpenSettings
}) {
  const { photoCount, countdown, mode, method, gesture } = settings

  return (
    <div className={showTitle ? 'rounded-sm bg-[#EFEAE3] p-5' : ''}>
      {showTitle && (
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-black/10 pb-4">
          <div>
            <h2 className="font-serif text-2xl tracking-tight">Pengaturan sesi</h2>
            <p className="mt-1 text-[11px] text-black/45">Atur dulu. Jepret sesukamu.</p>
          </div>
          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Buka panel pengaturan"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/15 text-black/60 transition hover:border-black/40 hover:text-black"
            >
              <SlidersIcon />
            </button>
          )}
        </div>
      )}

      {/* Jumlah Foto */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold">Jumlah Foto</p>
        <div className="grid grid-cols-2 gap-1 rounded-sm bg-white/50 p-1">
          {[3, 4].map((count) => (
            <Segment
              key={count}
              active={photoCount === count}
              disabled={sessionStarted}
              onClick={() => onUpdate({ photoCount: count })}
              label={`${count} Foto`}
            />
          ))}
        </div>
        {sessionStarted && (
          <p className="mt-2 text-[10px] text-black/40">Jumlah foto dikunci setelah sesi dimulai.</p>
        )}
      </div>

      {/* Countdown */}
      <div className="mb-5">
        <label htmlFor="countdown" className="mb-2 block text-[11px] font-semibold">
          Countdown (detik)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/45">
            <ClockIcon />
          </span>
          <select
            id="countdown"
            value={countdown}
            onChange={(event) => onUpdate({ countdown: parseInt(event.target.value, 10) })}
            className="w-full appearance-none rounded-sm border border-black/15 bg-white py-2.5 pl-9 pr-9 text-[11px] font-medium text-black outline-none transition focus:border-black/45"
          >
            <option value={3}>3 detik</option>
            <option value={5}>5 detik</option>
            <option value={10}>10 detik</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/45">
            <ChevronIcon />
          </span>
        </div>
      </div>

      {/* Mode */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold">Mode Pengambilan</p>
        <div className="grid grid-cols-2 gap-1 rounded-sm bg-white/50 p-1">
          <Segment
            active={mode === 'manual'}
            onClick={() => onUpdate({ mode: 'manual' })}
            label="MANUAL"
          />
          <Segment
            active={mode === 'gesture'}
            onClick={() => onUpdate({ mode: 'gesture' })}
            label="GESTURE"
          />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-black/40">
          {mode === 'manual'
            ? 'Klik tombol jepret untuk memulai hitung mundur.'
            : 'Tunjukkan gesture ke kamera untuk memicu jepretan.'}
        </p>
      </div>

      {/* Metode */}
      <div className="mb-5">
        <p className="mb-2 text-[11px] font-semibold">Metode</p>
        <div className="grid grid-cols-2 gap-1 rounded-sm bg-white/50 p-1">
          <Segment
            active={method === 'per-foto'}
            onClick={() => onUpdate({ method: 'per-foto' })}
            label="Manual / Per Foto"
            small
          />
          <Segment
            active={method === 'per-sesi'}
            onClick={() => onUpdate({ method: 'per-sesi' })}
            label="Otomatis / Per Sesi"
            small
          />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-black/40">
          {method === 'per-foto'
            ? 'Satu klik untuk satu foto. Kamu bisa berganti pose sebelum jepretan berikutnya.'
            : 'Semua foto diambil berurutan otomatis setelah sesi dimulai.'}
        </p>
      </div>

      {/* Gesture target */}
      {mode === 'gesture' && (
        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold">Gestur Deteksi</p>
          <div className="grid grid-cols-2 gap-1 rounded-sm bg-white/50 p-1">
            <Segment
              active={gesture === 'peace'}
              onClick={() => onUpdate({ gesture: 'peace' })}
              label="Peace ✌️"
            />
            <Segment
              active={gesture === 'palm'}
              onClick={() => onUpdate({ gesture: 'palm' })}
              label="Open Palm ✋"
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 flex items-start gap-2 border-t border-black/10 pt-4 text-black/45">
        <span className="mt-0.5 shrink-0">
          <InfoIcon />
        </span>
        <p className="text-[10px] leading-relaxed">
          Pengaturan langsung diterapkan. Kamera tetap aktif saat kamu menyesuaikan sesi.
        </p>
      </div>
    </div>
  )
}
