'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook untuk countdown timer
 * @param {Object} options
 * @param {number} options.initialSeconds - Initial countdown value
 * @param {function} options.onComplete - Callback when countdown reaches 0
 * @param {function} options.onTick - Callback on each second (optional)
 */
export function useCountdown({ initialSeconds = 3, onComplete, onTick } = {}) {
  const [isActive, setIsActive] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)

  // Keep refs up to date
  useEffect(() => {
    onCompleteRef.current = onComplete
    onTickRef.current = onTick
  }, [onComplete, onTick])

  const start = useCallback((seconds = initialSeconds) => {
    // Cegah countdown ganda (mis. gesture + klik tombol hampir bersamaan)
    if (intervalRef.current) return
    setSecondsLeft(seconds)
    setIsActive(true)
  }, [initialSeconds])

  const cancel = useCallback(() => {
    setIsActive(false)
    setSecondsLeft(initialSeconds)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [initialSeconds])

  const pause = useCallback(() => {
    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resume = useCallback(() => {
    if (secondsLeft > 0) {
      setIsActive(true)
    }
  }, [secondsLeft])

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          const newValue = prev - 1
          
          // Call onTick if provided
          if (onTickRef.current) {
            onTickRef.current(newValue)
          }

          if (newValue <= 0) {
            setIsActive(false)
            clearInterval(intervalRef.current)
            intervalRef.current = null
            
            // Call onComplete when countdown finishes
            if (onCompleteRef.current) {
              onCompleteRef.current()
            }
            
            return 0
          }
          
          return newValue
        })
      }, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
    }
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    secondsLeft,
    isActive,
    start,
    cancel,
    pause,
    resume
  }
}
