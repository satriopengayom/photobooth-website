'use client'

/**
 * Daftar foto vertikal (desktop) / horizontal scroll (mobile).
 * Menampilkan seluruh foto sesi berurutan, tanpa grid 2x2.
 *
 * @param {Object} props
 * @param {Array<{ blob: Blob | null }>} props.photos
 * @param {Array<string | null>} props.urls
 */
export default function PhotoList({ photos = [], urls = [] }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
        <span className="font-semibold">Daftar Foto</span>
        <span className="text-black/35">{photos.length}</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {photos.map((photo, index) => (
          <div key={index} className="w-28 shrink-0 lg:w-full">
            <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/60">
              Foto {String(index + 1).padStart(2, '0')}
            </div>
            <div className="aspect-video w-full overflow-hidden border border-black/10 bg-[#E7E1D8]">
              {urls[index] ? (
                <img
                  src={urls[index]}
                  alt={`Foto ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[0.12em] text-black/30">
                  Kosong
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
