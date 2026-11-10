'use client'

function MoveIcon({ direction }) {
  return (
    <svg
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {direction === 'up' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      )}
    </svg>
  )
}

/**
 * Daftar foto + kontrol urutan di dalam tab Layout.
 *
 * `order` berisi indeks foto asli sesuai urutan tampil saat ini.
 * Contoh: [2, 0, 1, 3] berarti Foto 03 tampil paling atas.
 *
 * @param {Object} props
 * @param {Array<{ slot: number, blob: Blob | null }>} props.photos
 * @param {Array<string | null>} props.urls
 * @param {number[]} props.order
 * @param {(position: number, direction: -1 | 1) => void} props.onMove
 */
export default function PhotoList({
  photos = [],
  urls = [],
  order = [],
  onMove = () => {}
}) {
  const total = order.length

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
        <span className="font-semibold">Daftar Foto</span>
        <span className="text-black/35">{total}</span>
      </div>

      <p className="mb-3 text-[10px] leading-relaxed text-black/40">
        Atur urutan foto untuk hasil akhir. Foto paling atas tampil lebih dulu.
      </p>

      <ol className="space-y-2">
        {order.map((originalIndex, position) => {
          const photo = photos[originalIndex]
          const url = urls[originalIndex]
          const isFirst = position === 0
          const isLast = position === total - 1

          if (!photo) return null

          return (
            <li
              key={originalIndex}
              className="flex items-center gap-2 border border-black/10 bg-white/60 p-1.5"
            >
              <div className="h-10 w-14 shrink-0 overflow-hidden border border-black/10 bg-[#E7E1D8]">
                {url ? (
                  <img
                    src={url}
                    alt={`Foto ${originalIndex + 1}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[8px] uppercase tracking-[0.1em] text-black/30">
                    Kosong
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/70">
                  Foto {String(originalIndex + 1).padStart(2, '0')}
                </p>
                <p className="mt-0.5 text-[8px] uppercase tracking-[0.12em] text-black/35">
                  Posisi {String(position + 1).padStart(2, '0')}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onMove(position, -1)}
                  disabled={isFirst}
                  aria-label={`Naikkan foto ${originalIndex + 1}`}
                  title="Naikkan"
                  className="flex h-7 w-7 items-center justify-center border border-black/10 bg-white text-black/60 transition hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <MoveIcon direction="up" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(position, 1)}
                  disabled={isLast}
                  aria-label={`Turunkan foto ${originalIndex + 1}`}
                  title="Turunkan"
                  className="flex h-7 w-7 items-center justify-center border border-black/10 bg-white text-black/60 transition hover:border-black/30 hover:text-black disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <MoveIcon direction="down" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      <p className="mt-2 text-[9px] leading-relaxed text-black/35">
        Urutan ini dipakai untuk preview dan file download.
      </p>
    </div>
  )
}
