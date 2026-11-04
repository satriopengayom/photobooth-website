'use client'

import CountdownOverlay from './CountdownOverlay'

export default function CameraPreview({
  videoRef,
  stream,
  error,
  loading,
  onRetry,
  countdown,
  allowCancelCountdown = true
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-black/15 bg-[#E7E1D8] sm:aspect-[3/2]">
      {/* Video Preview - always rendered */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 h-full w-full scale-x-[-1] object-contain ${stream ? 'block' : 'hidden'}`}
      />

      {/* Countdown Overlay */}
      {countdown && (
        <CountdownOverlay
          secondsLeft={countdown.secondsLeft}
          isActive={countdown.isActive}
          onCancel={countdown.cancel}
          allowCancel={allowCancelCountdown}
        />
      )}

      {/* Loading State */}
      {loading && !stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E7E1D8]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-black/20 border-t-black/70"></div>
            <p className="text-xs uppercase tracking-[0.18em] text-black/50">Memuat kamera…</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E7E1D8]">
          <div className="max-w-sm px-6 text-center">
            <p className="font-serif text-xl text-black/80">Kamera tidak dapat diakses</p>
            <p className="mt-2 text-[11px] leading-relaxed text-black/45">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-sm bg-[#1E1C1A] px-5 py-2.5 text-[11px] font-semibold text-white transition hover:bg-black"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      )}

      {/* Placeholder when no stream, no error, no loading */}
      {!stream && !error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E7E1D8]">
          <p className="text-xs uppercase tracking-[0.18em] text-black/40">Preview kamera</p>
        </div>
      )}
    </div>
  )
}
