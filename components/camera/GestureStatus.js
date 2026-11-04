'use client'

import { GESTURE_LABEL } from '@/lib/hooks/useMediaPipeGesture'

export default function GestureStatus({
  isModelLoading,
  isModelError,
  gestureStatus,
  gestureType,
  currentGesture,
  statusMessage,
  onRetry
}) {
  // Tidak ditampilkan jika tidak ada gesture target (mode manual)
  if (!gestureType) {
    return null
  }

  const targetLabel = GESTURE_LABEL[gestureType] ?? gestureType
  const statusColor = isModelError
    ? 'text-red-600'
    : isModelLoading
      ? 'text-amber-700'
      : gestureStatus === 'confirmed'
        ? 'text-emerald-700'
        : 'text-black/55'

  const statusIcon = isModelError
    ? '✕'
    : isModelLoading
      ? '…'
      : gestureStatus === 'confirmed'
        ? '✓'
        : gestureStatus === 'confirming'
          ? '·'
          : '·'

  return (
    <div className="rounded-sm border border-black/10 bg-[#EFEAE3] p-5 text-[#1A1A1A]">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-sm border border-black/10 bg-white p-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/40">Target</p>
          <p className="mt-1 text-sm font-semibold">{targetLabel}</p>
        </div>

        <div className="rounded-sm border border-black/10 bg-white p-3">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/40">Terbaca</p>
          <p
            className={`mt-1 text-sm font-semibold ${
              currentGesture === gestureType && currentGesture
                ? 'text-emerald-700'
                : currentGesture
                  ? 'text-amber-700'
                  : 'text-black/40'
            }`}
          >
            {currentGesture ? GESTURE_LABEL[currentGesture] ?? currentGesture : 'Tidak ada'}
          </p>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-2 flex items-center gap-2 border-t border-black/10 pt-3">
        <span aria-hidden="true" className={`text-xs ${statusColor}`}>
          {statusIcon}
        </span>
        <span className={`text-[11px] font-medium ${statusColor}`}>{statusMessage}</span>
      </div>

      {/* Retry saat model gagal */}
      {isModelError && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 w-full rounded-sm bg-[#1E1C1A] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-black"
        >
          Muat Ulang Model
        </button>
      )}
    </div>
  )
}
