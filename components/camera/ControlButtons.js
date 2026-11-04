'use client'

export default function ControlButtons({
  sessionStarted,
  method,
  photos,
  retakeSlot,
  perSesiActive,
  onStartSession,
  onCapturePhoto,
  onRetakePhoto,
  onCancel
}) {
  const filledSlots = photos.filter(photo => photo.blob !== null).length
  const totalSlots = photos.length

  // Retake mode
  const isRetakeMode = retakeSlot !== null
  
  // Per Foto mode: show capture button if not all slots filled
  const canCapture = sessionStarted && method === 'per-foto' && filledSlots < totalSlots && !perSesiActive
  
  // Cancel: only available for Per Foto mode, not for Per Sesi
  const canCancel = sessionStarted && method === 'per-foto' && !perSesiActive

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Start Session Button */}
      {!sessionStarted && !isRetakeMode && (
        <button
          onClick={onStartSession}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mulai Sesi Foto
        </button>
      )}

      {/* Capture Photo Button - Per Foto */}
      {canCapture && !isRetakeMode && (
        <button
          onClick={onCapturePhoto}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 active:bg-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📸 Ambil Foto
        </button>
      )}

      {/* Retake Photo Button */}
      {isRetakeMode && (
        <button
          onClick={onRetakePhoto}
          className="px-8 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 active:bg-amber-800 transition-all shadow-md hover:shadow-lg"
        >
          🔄 Ambil Foto Pengganti
        </button>
      )}

      {/* Per Sesi Active Indicator */}
      {perSesiActive && (
        <div className="px-8 py-3 bg-purple-100 text-purple-800 font-semibold rounded-lg border-2 border-purple-300">
          ⏳ Sesi Berjalan... ({filledSlots}/{totalSlots})
        </div>
      )}

      {/* Cancel Button */}
      {canCancel && !isRetakeMode && (
        <button
          onClick={onCancel}
          className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-all shadow-md hover:shadow-lg"
        >
          Batalkan Sesi
        </button>
      )}
    </div>
  )
}
