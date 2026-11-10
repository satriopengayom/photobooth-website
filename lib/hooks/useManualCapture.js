'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { capturePhoto } from '@/lib/utils/cameraUtils'
import { useCountdown } from './useCountdown'

/**
 * Hook untuk handle manual capture flow
 * @param {Object} options
 * @param {Object} options.videoRef - Ref ke video element
 * @param {Object} options.photoSession - Context dari usePhotoSession
 */
export function useManualCapture({ videoRef, photoSession }) {
  const router = useRouter()
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureError, setCaptureError] = useState(null)
  const [perSesiActive, setPerSesiActive] = useState(false)
  const captureInProgressRef = useRef(false)
  const captureRunRef = useRef(0)
  const perSesiPhotoIndexRef = useRef(0)
  const timeoutsRef = useRef(new Set())
  const countdownStartRef = useRef(null)

  // Jadwalkan timer yang selalu dibersihkan saat unmount
  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id)
      fn()
    }, delay)
    timeoutsRef.current.add(id)
    return id
  }, [])

  const clearScheduled = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id))
    timeoutsRef.current.clear()
  }, [])

  const {
    settings,
    photos,
    retakeSlot,
    addPhoto,
    getNextEmptySlot,
    clearRetake
  } = photoSession

  // Countdown completion handler
  const handleCountdownComplete = useCallback(async () => {
    if (captureInProgressRef.current) return

    const runId = captureRunRef.current
    captureInProgressRef.current = true
    setIsCapturing(true)
    setCaptureError(null)

    try {
      const videoElement = videoRef.current
      if (!videoElement) {
        throw new Error('Video element tidak tersedia')
      }

      const photoBlob = await capturePhoto(videoElement)

      // Sesi sudah dibatalkan / diganti saat foto sedang diproses.
      if (runId !== captureRunRef.current) return

      // Determine target slot
      let targetSlot
      if (retakeSlot !== null) {
        targetSlot = retakeSlot
      } else {
        targetSlot = getNextEmptySlot()
      }

      if (targetSlot === -1) {
        throw new Error('Tidak ada slot kosong tersedia')
      }

      // Save photo to slot
      addPhoto(targetSlot, photoBlob)

      // Handle post-capture logic
      if (retakeSlot !== null) {
        // Retake mode - navigate back to review
        clearRetake()
        schedule(() => {
          router.push('/review')
        }, 500)
      } else if (perSesiActive) {
        // Per Sesi mode - continue to next photo
        perSesiPhotoIndexRef.current++
        
        if (perSesiPhotoIndexRef.current >= settings.photoCount) {
          // All photos captured
          setPerSesiActive(false)
          schedule(() => {
            router.push('/review')
          }, 800)
        } else {
          // Continue to next photo after delay
          schedule(() => {
            countdownStartRef.current?.(settings.countdown)
          }, 1500)
        }
      } else {
        // Per Foto mode - check if all photos done
        const updatedPhotos = [...photos]
        updatedPhotos[targetSlot] = { slot: targetSlot, blob: photoBlob, timestamp: Date.now() }
        const allFilled = updatedPhotos.every(p => p.blob !== null)
        
        if (allFilled) {
          schedule(() => {
            router.push('/review')
          }, 800)
        }
      }
    } catch (err) {
      // Abaikan error dari capture yang sudah dibatalkan.
      if (runId === captureRunRef.current) {
        console.error('Capture error:', err)
        setCaptureError(err.message || 'Gagal mengambil foto')
        setPerSesiActive(false)
      }
    } finally {
      // Jangan menimpa status capture baru jika capture lama selesai belakangan.
      if (runId === captureRunRef.current) {
        setIsCapturing(false)
        captureInProgressRef.current = false
      }
    }
  }, [videoRef, photos, retakeSlot, addPhoto, getNextEmptySlot, clearRetake, router, perSesiActive, settings, schedule])

  const countdown = useCountdown({
    initialSeconds: settings.countdown,
    onComplete: handleCountdownComplete
  })

  // Simpan referensi start agar handler di atas dapat memakainya tanpa
  // melanggar urutan deklarasi (countdown dibuat setelah handler).
  useEffect(() => {
    countdownStartRef.current = countdown.start
  }, [countdown.start])

  // Manual Per Foto - single capture
  const capturePerFoto = useCallback(() => {
    if (countdown.isActive || isCapturing || perSesiActive) return
    captureRunRef.current += 1
    countdown.start(settings.countdown)
  }, [countdown, isCapturing, perSesiActive, settings.countdown])

  // Manual Per Sesi - automatic sequence
  const capturePerSesi = useCallback(() => {
    if (countdown.isActive || isCapturing || perSesiActive) return

    captureRunRef.current += 1
    perSesiPhotoIndexRef.current = 0
    setPerSesiActive(true)
    
    // Start first photo countdown
    countdown.start(settings.countdown)
  }, [countdown, isCapturing, perSesiActive, settings.countdown])

  /**
   * Hentikan sesi yang sedang berjalan, termasuk rangkaian otomatis Per Sesi.
   * Timer lanjutan, countdown aktif, dan hasil capture yang masih diproses
   * dibatalkan agar tidak ada foto yang masuk setelah sesi di-reset.
   */
  const cancelSession = useCallback(() => {
    captureRunRef.current += 1
    clearScheduled()
    perSesiPhotoIndexRef.current = 0
    captureInProgressRef.current = false
    setPerSesiActive(false)
    setIsCapturing(false)
    countdown.cancel()
  }, [clearScheduled, countdown])

  // Cleanup on unmount: hentikan semua timer & reset penanda sesi
  useEffect(() => {
    return () => {
      captureRunRef.current += 1
      clearScheduled()
      perSesiPhotoIndexRef.current = 0
      captureInProgressRef.current = false
    }
  }, [clearScheduled])

  return {
    countdown,
    isCapturing,
    captureError,
    capturePerFoto,
    capturePerSesi,
    cancelSession,
    perSesiActive
  }
}
