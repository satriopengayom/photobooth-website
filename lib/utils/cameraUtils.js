/**
 * Capture photo dari video element menggunakan Canvas API
 * @param {HTMLVideoElement} videoElement - Video element dari camera stream
 * @returns {Promise<Blob>} - Blob dari captured image
 */
export async function capturePhoto(videoElement) {
  if (!videoElement || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) {
    throw new Error('Video element tidak siap untuk capture')
  }

  const canvas = document.createElement('canvas')
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight

  const context = canvas.getContext('2d')
  // Gambar video ke canvas.
  // CSS di CameraPreview menyertakan 'transform scale-x-[-1]' agar preview mirip cermin,
  // tetapi kita membatalkan efek mirror ini saat capture agar hasil foto bukan mirror.
  context.scale(-1, 1)
  context.drawImage(videoElement, -videoElement.videoWidth, 0, canvas.width, canvas.height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Gagal membuat blob dari canvas'))
        }
      },
      'image/jpeg',
      0.9
    )
  })
}

/**
 * Format countdown time untuk display
 * @param {number} seconds - Seconds remaining
 * @returns {string} - Formatted time string
 */
export function formatCountdown(seconds) {
  if (seconds <= 0) return ''
  return `${seconds}`
}

/**
 * Get video constraints untuk getUserMedia
 * @returns {MediaTrackConstraints} - Video constraints
 */
export function getVideoConstraints() {
  return {
    facingMode: 'user',
    width: { ideal: 640 },
    height: { ideal: 360 }
  }
}
