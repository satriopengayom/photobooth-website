'use client'

import { createContext, useContext, useState } from 'react'

const PhotoSessionContext = createContext(undefined)

export function PhotoSessionProvider({ children }) {
  const [state, setState] = useState({
    settings: {
      photoCount: 4,
      countdown: 3,
      mode: 'manual',
      method: 'per-foto',
      gesture: 'peace'
    },
    photos: [],
    retakeSlot: null,
    sessionStarted: false
  })

  // Initialize session dengan fixed-length array
  const startSession = (settings) => {
    const { photoCount } = settings
    
    // Create fixed-length array dengan empty slots
    const slots = Array.from({ length: photoCount }, (_, index) => ({
      slot: index,
      blob: null,
      timestamp: null
    }))
    
    setState({
      settings: { ...settings },
      photos: slots,
      sessionStarted: true,
      retakeSlot: null
    })
  }

  // Update settings (untuk settings yang tidak locked)
  const updateSettings = (partialSettings) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...partialSettings
      }
    }))
  }

  // Add photo ke slot tertentu
  const addPhoto = (slotIndex, blob) => {
    setState(prev => {
      const updatedPhotos = [...prev.photos]
      
      // Update hanya slot yang ditentukan
      updatedPhotos[slotIndex] = {
        slot: slotIndex,
        blob: blob,
        timestamp: Date.now()
      }
      
      return {
        ...prev,
        photos: updatedPhotos
      }
    })
  }

  // Get photo dari slot tertentu
  const getPhoto = (slotIndex) => {
    return state.photos[slotIndex]
  }

  // Get semua photos
  const getAllPhotos = () => {
    return state.photos
  }

  // Check apakah semua slot terisi
  const isSessionComplete = () => {
    if (state.photos.length === 0) return false
    return state.photos.every(slot => slot.blob !== null)
  }

  // Get slot kosong berikutnya
  const getNextEmptySlot = () => {
    return state.photos.findIndex(slot => slot.blob === null)
  }

  // Set retake slot
  const setRetakeSlot = (slotIndex) => {
    setState(prev => ({
      ...prev,
      retakeSlot: slotIndex
    }))
  }

  // Clear retake flag
  const clearRetake = () => {
    setState(prev => ({
      ...prev,
      retakeSlot: null
    }))
  }

  // Reset seluruh session
  const resetSession = () => {
    setState({
      settings: {
        photoCount: 4,
        countdown: 3,
        mode: 'manual',
        method: 'per-foto',
        gesture: 'peace'
      },
      photos: [],
      retakeSlot: null,
      sessionStarted: false
    })
  }

  const value = {
    // State
    settings: state.settings,
    photos: state.photos,
    retakeSlot: state.retakeSlot,
    sessionStarted: state.sessionStarted,
    
    // Methods
    startSession,
    updateSettings,
    addPhoto,
    getPhoto,
    getAllPhotos,
    isSessionComplete,
    getNextEmptySlot,
    setRetakeSlot,
    clearRetake,
    resetSession
  }

  return (
    <PhotoSessionContext.Provider value={value}>
      {children}
    </PhotoSessionContext.Provider>
  )
}

export function usePhotoSession() {
  const context = useContext(PhotoSessionContext)
  if (context === undefined) {
    throw new Error('usePhotoSession must be used within PhotoSessionProvider')
  }
  return context
}
