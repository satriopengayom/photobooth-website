'use client'

import { useEffect, useMemo } from 'react'

function SlotThumb({ blob, alt }) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  if (!url) return null

  return <img src={url} alt={alt} className="h-full w-full object-cover" />
}

function CameraIcon() {
  return (
    <svg
      className="h-4 w-4"
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

export default function SlotDock({
  slots = [],
  totalSlots = 0,
  nextSlotIndex = -1,
  retakeSlot = null,
  actionLabel,
  onAction,
  actionDisabled = false,
  actionBusy = false,
  hintText,
  hintStrong = false,
  onCancel,
  cancelLabel = 'Batalkan sesi',
  onBack,
  backLabel = 'Kembali',
  note
}) {
  const total = totalSlots || slots.length
  const filled = slots.filter((photo) => photo?.blob).length

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        {/* Slot indicators */}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold">Foto dalam sesi</p>
          <p className="mt-0.5 text-[10px] text-black/40">
            {filled === 0 ? 'Belum ada foto diambil' : `${filled} dari ${total} foto diambil`}
          </p>

          <div
            className="mt-3 flex flex-wrap gap-2"
            role="list"
            aria-label={`Slot foto ${total}`}
          >
            {slots.map((photo, index) => {
              const isRetakeTarget = retakeSlot === index
              const isNext = !isRetakeTarget && index === nextSlotIndex
              const isFilled = Boolean(photo?.blob)

              return (
                <div
                  key={index}
                  role="listitem"
                  title={`Foto ${index + 1}${isFilled ? ' (terisi)' : ''}`}
                  className={`relative flex h-12 w-16 items-center justify-center overflow-hidden rounded-sm border text-[10px] font-semibold transition ${
                    isRetakeTarget
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : isNext
                        ? 'border-black/70 bg-white text-black'
                        : isFilled
                          ? 'border-black/20 bg-white'
                          : 'border-dashed border-black/25 bg-transparent text-black/35'
                  }`}
                >
                  {isFilled ? (
                    <SlotThumb blob={photo.blob} alt={`Foto ${index + 1}`} />
                  ) : (
                    String(index + 1).padStart(2, '0')
                  )}

                  {(isNext || isRetakeTarget) && (
                    <span
                      className={`absolute right-1 top-1 h-1.5 w-1.5 rounded-full ${
                        isRetakeTarget ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Hint + action */}
        <div className="shrink-0 sm:max-w-xs sm:text-right">
          <p
            className={`text-[11px] leading-relaxed ${
              hintStrong ? 'font-semibold text-black' : 'text-black/55'
            }`}
          >
            {hintText}
          </p>
          {note && <p className="mt-1 text-[10px] leading-relaxed text-black/40">{note}</p>}

          <button
            type="button"
            onClick={onAction}
            disabled={actionDisabled || actionBusy}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#1E1C1A] px-6 py-3.5 text-[11px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <CameraIcon />
            <span>{actionLabel}</span>
          </button>

          {(onCancel || onBack) && (
            <div className="mt-3 flex flex-wrap items-center gap-4 sm:justify-end">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-[11px] text-black/50 underline decoration-black/20 underline-offset-4 transition hover:text-black"
                >
                  ← {backLabel}
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-[11px] text-black/40 underline decoration-black/15 underline-offset-4 transition hover:text-black"
                >
                  {cancelLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
