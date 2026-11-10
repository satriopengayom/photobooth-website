/**
 * Aturan deteksi gesture untuk MediaPipe Gesture Recognizer.
 *
 * Modul ini murni (tanpa React/DOM) agar logika multi-tangan dan latch
 * dapat diuji dengan simulasi hasil recognizer.
 */

/** Confidence minimum agar gesture dianggap valid. */
export const MIN_GESTURE_CONFIDENCE = 0.7

/** Jumlah frame berturut-turut untuk stabilitas ±500 ms (5 × 100 ms). */
export const STABILITY_FRAMES = 5

/** Jumlah frame tanpa gesture target sebelum latch dilepas (re-arm). */
export const RELEASE_FRAMES = 3

/** Pemetaan kategori MediaPipe -> nilai gesture internal aplikasi. */
export const CATEGORY_TO_GESTURE = {
  Victory: 'peace',
  Open_Palm: 'palm'
}

/**
 * Meringkas hasil recognizer untuk SEMUA tangan yang terdeteksi.
 *
 * Setiap tangan diperiksa independen berdasarkan kategori gesture milik
 * tangan tersebut. Kehadiran tangan lain tidak membatalkan gesture target.
 *
 * @param {Object} results - Hasil recognizeForVideo MediaPipe.
 * @param {'peace'|'palm'} target - Gesture yang sedang dicari.
 * @param {number} [minConfidence=MIN_GESTURE_CONFIDENCE]
 * @returns {{
 *   targetDetected: boolean,
 *   targetScore: number,
 *   currentGesture: 'peace'|'palm'|null,
 *   recognizedHands: number,
 *   detectedHands: number
 * }}
 */
export function summarizeHandGestures(
  results,
  target,
  minConfidence = MIN_GESTURE_CONFIDENCE
) {
  const hands = Array.isArray(results?.gestures) ? results.gestures : []

  let targetDetected = false
  let targetScore = 0
  let bestGesture = null
  let bestScore = 0
  let recognizedHands = 0

  hands.forEach((hand) => {
    // Setiap elemen `gestures` adalah daftar kategori untuk satu tangan.
    // Tidak memakai handedness: dua tangan dengan sisi yang sama pun tetap
    // dievaluasi terpisah berdasarkan indeks hasil recognizer.
    const top = Array.isArray(hand) ? hand[0] : null
    if (!top) return

    const score = Number(top.score) || 0
    const mapped = top.categoryName
      ? CATEGORY_TO_GESTURE[top.categoryName] ?? null
      : null

    if (!mapped || score < minConfidence) return

    recognizedHands += 1

    if (mapped === target) {
      targetDetected = true
      if (score > targetScore) targetScore = score
    }

    if (score > bestScore) {
      bestScore = score
      bestGesture = mapped
    }
  })

  return {
    targetDetected,
    targetScore,
    // Prioritaskan gesture target agar status tidak didominasi tangan lain.
    currentGesture: targetDetected ? target : bestGesture,
    recognizedHands,
    detectedHands: hands.length
  }
}

/**
 * State awal tracker stabilitas + latch.
 *
 * @param {'idle'|'waiting'} [status='idle']
 */
export function createGestureTracker(status = 'idle') {
  return {
    matchCount: 0,
    missingCount: 0,
    status,
    currentGesture: null,
    detectedGesture: null
  }
}

/**
 * Memajukan tracker satu frame.
 *
 * - `targetDetected` berasal dari SEMUA tangan, jadi tambahan tangan lain
 *   tidak menghalangi gesture target.
 * - Latch `confirmed` hanya dilepas setelah `RELEASE_FRAMES` frame tanpa
 *   gesture target, sehingga satu gesture hanya memicu satu kali.
 *
 * @param {ReturnType<typeof createGestureTracker>} tracker
 * @param {Object} frame
 * @param {'peace'|'palm'} frame.target
 * @param {boolean} frame.targetDetected
 * @param {'peace'|'palm'|null} frame.currentGesture
 */
export function advanceGestureTracker(
  tracker,
  { target, targetDetected, currentGesture }
) {
  const next = { ...tracker, currentGesture }

  if (!targetDetected) {
    next.matchCount = 0

    if (next.status === 'confirmed') {
      next.missingCount += 1
      if (next.missingCount >= RELEASE_FRAMES) {
        next.missingCount = 0
        next.detectedGesture = null
        next.status = 'waiting'
      }
      return next
    }

    next.missingCount = 0
    next.status = 'waiting'
    return next
  }

  // Gesture target terlihat pada minimal satu tangan.
  next.missingCount = 0

  // Sudah terkunci: jangan pernah memicu konfirmasi baru selama ditahan.
  if (next.status === 'confirmed') return next

  next.matchCount += 1
  if (next.matchCount >= STABILITY_FRAMES) {
    next.detectedGesture = target
    next.status = 'confirmed'
  } else {
    next.status = 'confirming'
  }

  return next
}
