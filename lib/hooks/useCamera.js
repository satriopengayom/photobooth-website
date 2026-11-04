'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useCamera() {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const videoRef = useRef(null)
  
  // Ref to track actual stream and prevent concurrent requests
  const streamRef = useRef(null)
  const isRequestingRef = useRef(false)

  const stopCamera = useCallback(() => {
    // Stop actual stream from ref, not state
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    setStream(null)

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, []) // No dependencies - always stable

  const startCamera = useCallback(async () => {
    // Prevent concurrent requests
    if (isRequestingRef.current || streamRef.current) {
      return
    }

    isRequestingRef.current = true
    setLoading(true)
    setError(null)

    try {
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 360 }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Check if component unmounted during async operation
      if (!isRequestingRef.current) {
        // Late arrival after cleanup - stop immediately
        mediaStream.getTracks().forEach(track => track.stop())
        return
      }

      streamRef.current = mediaStream
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        // Ensure video plays
        try {
          await videoRef.current.play()
        } catch (playErr) {
          // Autoplay might be blocked, but video will play when user interacts
          console.warn('Autoplay prevented:', playErr)
        }
      }
    } catch (err) {
      let errorMessage = 'Gagal mengakses kamera'

      if (err.name === 'NotAllowedError') {
        errorMessage = 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.'
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Kamera tidak ditemukan pada perangkat Anda.'
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut dan coba lagi.'
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Akses kamera diblokir oleh pengaturan keamanan browser.'
      }

      setError(errorMessage)
      console.error('Camera error:', err)
    } finally {
      setLoading(false)
      isRequestingRef.current = false
    }
  }, []) // No dependencies - always stable

  const retryCamera = useCallback(() => {
    setError(null)
    startCamera()
  }, [startCamera])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      isRequestingRef.current = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  return {
    stream,
    error,
    loading,
    videoRef,
    startCamera,
    stopCamera,
    retryCamera
  }
}
