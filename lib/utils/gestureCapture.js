/**
 * Menentukan aksi yang dipicu oleh gesture yang BARU terkonfirmasi.
 *
 * Fungsi murni (tanpa React/DOM) agar aturan pemicuan dapat diuji terpisah:
 * - Hanya transisi "belum terkonfirmasi -> terkonfirmasi" yang memicu aksi.
 * - Satu gesture tidak boleh memicu capture berulang selama masih ditahan.
 * - Deteksi tidak boleh memicu capture saat countdown/ capture/ sesi berjalan.
 *
 * @param {Object} state
 * @param {boolean} state.confirmed     - Gesture target sedang terkonfirmasi
 * @param {boolean} state.wasConfirmed  - Nilai confirmed pada render sebelumnya
 * @param {'manual'|'gesture'} state.mode
 * @param {'per-foto'|'per-sesi'} state.method
 * @param {boolean} state.sessionStarted
 * @param {boolean} state.allFilled
 * @param {number|null} state.retakeSlot
 * @param {boolean} state.countdownActive
 * @param {boolean} state.isCapturing
 * @param {boolean} state.perSesiActive
 * @returns {'none'|'retake'|'start-per-foto'|'start-per-sesi'|'capture-per-foto'|'capture-per-sesi'}
 */
export function resolveGestureAction({
  confirmed,
  wasConfirmed,
  mode,
  method,
  sessionStarted,
  allFilled,
  retakeSlot,
  countdownActive,
  isCapturing,
  perSesiActive
}) {
  // Hanya tepi naik (rising edge): satu gesture = satu aksi
  if (!confirmed || wasConfirmed) return 'none'

  // Fitur hanya untuk mode gesture
  if (mode !== 'gesture') return 'none'

  // Jangan memicu saat countdown, capture, atau rangkaian Per Sesi berjalan
  if (countdownActive || isCapturing || perSesiActive) return 'none'

  // Retake selalu mengganti slot yang dipilih
  if (retakeSlot !== null && retakeSlot !== undefined) return 'retake'

  if (sessionStarted) {
    if (allFilled) return 'none'
    return method === 'per-sesi' ? 'capture-per-sesi' : 'capture-per-foto'
  }

  // Sesi belum dimulai: gesture pertama memulai sesi sekaligus capture
  return method === 'per-sesi' ? 'start-per-sesi' : 'start-per-foto'
}
