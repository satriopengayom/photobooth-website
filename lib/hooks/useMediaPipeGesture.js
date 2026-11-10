'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision'
import {
  MIN_GESTURE_CONFIDENCE,
  advanceGestureTracker,
  createGestureTracker,
  summarizeHandGestures
} from '@/lib/utils/gestureResults'

/**
 * Path WASM MediaPipe Tasks Vision (versi harus sama dengan dependency).
 * Dimuat dari CDN agar tidak perlu menyalin aset ke /public.
 */
const WASM_PATH = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.2.0/wasm'

/**
 * Model Gesture Recognizer resmi MediaPipe (float16).
 * Kategori: None, Closed_Fist, Open_Palm, Pointing_Up, Thumb_Down,
 * Thumb_Up, Victory, ILoveYou
 */
const MODEL_PATH =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'

/** Throttle deteksi ~10 FPS */
const DETECTION_INTERVAL_MS = 100

/** Maksimal tangan yang dideteksi dalam satu frame. */
const MAX_HANDS = 4

/** Label untuk ditampilkan ke pengguna */
export const GESTURE_LABEL = {
  peace: 'Peace ✌️',
  palm: 'Open Palm ✋'
}

/**
 * TensorFlow Lite di dalam MediaPipe mencetak log INFO/WARNING lewat
 * console.error (mis. "INFO: Created TensorFlow Lite XNNPACK delegate for CPU.").
 * Next.js dev overlay memperlakukan console.error sebagai issue, jadi log
 * informatif itu kita saring sementara saat model dibuat.
 */
const TFLITE_LOG_PATTERNS = [
  'TensorFlow Lite',
  'XNNPACK',
  'GL_VERSION',
  'landmark_projection',
  'absl'
]

function silenceTfLiteLogs() {
  if (typeof console === 'undefined') return () => {}

  const originalError = console.error
  const originalWarn = console.warn

  const shouldSilence = (args) => {
    const text = args
      .map((arg) => (typeof arg === 'string' ? arg : arg?.message ?? ''))
      .join(' ')
    return TFLITE_LOG_PATTERNS.some((pattern) => text.includes(pattern))
  }

  console.error = (...args) => {
    if (!shouldSilence(args)) originalError(...args)
  }
  console.warn = (...args) => {
    if (!shouldSilence(args)) originalWarn(...args)
  }

  return () => {
    console.error = originalError
    console.warn = originalWarn
  }
}

/**
 * Hook deteksi gesture tangan dengan MediaPipe Gesture Recognizer.
 *
 * Hanya melakukan deteksi ketika:
 * - mode gesture aktif (gestureType terisi), dan
 * - kamera aktif (stream tersedia).
 *
 * Hook ini TIDAK memicu pengambilan foto. Ia hanya melaporkan status.
 *
 * @param {Object} options
 * @param {Object} options.videoRef - Ref ke <video> dari useCamera
 * @param {MediaStream|null} options.stream - Stream kamera aktif (pemicu lifecycle)
 * @param {'peace'|'palm'|null} options.gestureType - Gesture target, null = nonaktif
 */
export function useMediaPipeGesture({ videoRef, stream = null, gestureType = null }) {
  const isEnabled = Boolean(gestureType) && Boolean(stream)

  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isModelError, setIsModelError] = useState(false)

  // Status: idle | loading | waiting | confirming | confirmed | error
  const [gestureStatus, setGestureStatus] = useState('idle')
  const [detectedGesture, setDetectedGesture] = useState(null) // gesture target yang terkonfirmasi
  const [currentGesture, setCurrentGesture] = useState(null) // gesture apa pun yang sedang terbaca

  const recognizerRef = useRef(null)
  const intervalRef = useRef(null)
  const loadingRef = useRef(false)
  const mountedRef = useRef(true)

  // State deteksi (pakai ref agar tidak memicu render tiap frame)
  const lastVideoTimeRef = useRef(-1)
  const trackerRef = useRef(createGestureTracker())
  const statusRef = useRef('idle')
  const gestureTypeRef = useRef(gestureType)
  const lastTargetRef = useRef(gestureType)

  // Sinkronkan gesture target tanpa memicu ulang interval
  useEffect(() => {
    gestureTypeRef.current = gestureType
  }, [gestureType])

  // Ref agar resetDetection tidak bergantung pada isEnabled (hindari re-create)
  const isEnabledRef = useRef(isEnabled)
  useEffect(() => {
    isEnabledRef.current = isEnabled
  }, [isEnabled])

  const applyStatus = useCallback((next) => {
    if (statusRef.current === next) return
    statusRef.current = next
    setGestureStatus(next)
  }, [])

  const resetDetection = useCallback(() => {
    trackerRef.current = createGestureTracker()
    lastVideoTimeRef.current = -1
    setDetectedGesture(null)
    setCurrentGesture(null)
    applyStatus(isEnabledRef.current ? 'waiting' : 'idle')
  }, [applyStatus])

  /**
   * Muat model sekali saja. Jika GPU gagal, fallback ke CPU.
   */
  const loadModel = useCallback(async () => {
    // Model sudah pernah dimuat: jangan inisialisasi ulang
    if (recognizerRef.current) {
      setIsModelLoaded(true)
      applyStatus('waiting')
      return
    }
    if (loadingRef.current) return

    loadingRef.current = true
    setIsModelLoading(true)
    setIsModelError(false)
    applyStatus('loading')

    const createRecognizer = async (delegate) => {
      const fileset = await FilesetResolver.forVisionTasks(WASM_PATH)
      return GestureRecognizer.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_PATH,
          delegate
        },
        runningMode: 'VIDEO',
        numHands: MAX_HANDS,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
        cannedGesturesClassifierOptions: {
          scoreThreshold: MIN_GESTURE_CONFIDENCE
        }
      })
    }

    try {
      let recognizer
      const restoreLogs = silenceTfLiteLogs()
      try {
        try {
          recognizer = await createRecognizer('GPU')
        } catch (gpuErr) {
          console.warn('GPU delegate gagal, fallback ke CPU:', gpuErr)
          recognizer = await createRecognizer('CPU')
        }
      } finally {
        restoreLogs()
      }

      if (!mountedRef.current) {
        recognizer.close()
        return
      }

      recognizerRef.current = recognizer
      setIsModelLoaded(true)
      applyStatus('waiting')
    } catch (err) {
      console.error('Gagal memuat model gesture MediaPipe:', err)
      if (mountedRef.current) {
        setIsModelError(true)
        applyStatus('error')
      }
    } finally {
      loadingRef.current = false
      if (mountedRef.current) setIsModelLoading(false)
    }
  }, [applyStatus])

  /**
   * Evaluasi hasil recognizer: confidence + stabilitas + latch (re-arm).
   *
   * Semua tangan diperiksa independen. Gesture target dianggap terdeteksi
   * jika minimal satu tangan memenuhinya; tangan lain tidak membatalkan.
   */
  const evaluateResults = useCallback(
    (results) => {
      const target = gestureTypeRef.current
      if (!target) return

      // Target gesture berubah: mulai dari kondisi bersih (tanpa effect tambahan)
      if (lastTargetRef.current !== target) {
        lastTargetRef.current = target
        trackerRef.current = createGestureTracker('waiting')
        setDetectedGesture(null)
        setCurrentGesture(null)
        statusRef.current = 'waiting'
        setGestureStatus('waiting')
      }

      const summary = summarizeHandGestures(results, target)
      const previous = trackerRef.current
      const next = advanceGestureTracker(previous, {
        target,
        targetDetected: summary.targetDetected,
        currentGesture: summary.currentGesture
      })

      trackerRef.current = next

      // Tampilkan gesture yang sedang terbaca (tanpa render berulang).
      if (next.currentGesture !== previous.currentGesture) {
        setCurrentGesture(next.currentGesture)
      }

      // detectedGesture hanya berubah saat latch naik atau dilepas.
      if (next.detectedGesture !== previous.detectedGesture) {
        setDetectedGesture(next.detectedGesture)
      }

      if (next.status !== previous.status) {
        applyStatus(next.status)
      }
    },
    [applyStatus]
  )

  // Muat model hanya ketika fitur diaktifkan (mode gesture + kamera aktif)
  useEffect(() => {
    mountedRef.current = true

    // Sinkronisasi dengan sistem eksternal (MediaPipe). Memuat model memang
    // mengubah state loading, jadi setState di dalam alur ini disengaja.
    if (isEnabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadModel()
    } else {
      resetDetection()
    }
  }, [isEnabled, loadModel, resetDetection])

  // Jalankan / hentikan loop deteksi
  useEffect(() => {
    // Bersihkan interval lama terlebih dahulu (idempotent)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isEnabled || !isModelLoaded) {
      return
    }

    intervalRef.current = setInterval(() => {
      const video = videoRef.current
      const recognizer = recognizerRef.current

      if (!mountedRef.current || !video || !recognizer) return
      if (video.readyState < 2 || !video.videoWidth) return

      // Jangan proses frame yang sama dua kali (timestamp MediaPipe harus naik)
      if (video.currentTime === lastVideoTimeRef.current) return
      lastVideoTimeRef.current = video.currentTime

      try {
        const results = recognizer.recognizeForVideo(video, performance.now())
        evaluateResults(results)
      } catch (err) {
        console.warn('Error saat deteksi gesture:', err)
      }
    }, DETECTION_INTERVAL_MS)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isEnabled, isModelLoaded, videoRef, evaluateResults])

  // Cleanup saat unmount: hentikan interval & tutup recognizer
  useEffect(() => {
    return () => {
      mountedRef.current = false

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (recognizerRef.current) {
        try {
          recognizerRef.current.close()
        } catch (err) {
          console.warn('Error menutup recognizer:', err)
        }
        recognizerRef.current = null
      }

      loadingRef.current = false
    }
  }, [])

  const retryLoadModel = useCallback(() => {
    setIsModelError(false)
    loadModel()
  }, [loadModel])

  const getStatusMessage = () => {
    if (!isEnabled) return 'Deteksi gesture nonaktif'
    if (isModelLoading) return 'Memuat model gesture recognition...'
    if (isModelError) return 'Gagal memuat model gesture'

    const targetLabel = GESTURE_LABEL[gestureType] ?? 'gesture'

    if (gestureStatus === 'confirmed') return `${targetLabel} stabil terdeteksi.`
    if (gestureStatus === 'confirming') {
      return `${targetLabel} terdeteksi. Menstabilkan...`
    }
    if (gestureStatus === 'waiting') return `Menunggu gesture ${targetLabel}...`
    return 'Menunggu...'
  }

  return {
    isEnabled,
    isModelLoading,
    isModelLoaded,
    isModelError,
    detectedGesture,
    currentGesture,
    gestureStatus,
    statusMessage: getStatusMessage(),
    isGestureConfirmed: gestureStatus === 'confirmed',
    resetDetection,
    retryLoadModel
  }
}
