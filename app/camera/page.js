'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePhotoSession } from '@/lib/context/PhotoSessionContext'
import { useCamera } from '@/lib/hooks/useCamera'
import { useManualCapture } from '@/lib/hooks/useManualCapture'
import { useMediaPipeGesture, GESTURE_LABEL } from '@/lib/hooks/useMediaPipeGesture'
import { resolveGestureAction } from '@/lib/utils/gestureCapture'
import CameraPreview from '@/components/camera/CameraPreview'
import SettingsPanel from '@/components/camera/SettingsPanel'
import GestureStatus from '@/components/camera/GestureStatus'
import StudioHeader from '@/components/camera/StudioHeader'
import SlotDock from '@/components/camera/SlotDock'
import SettingsDrawer from '@/components/camera/SettingsDrawer'

const STATUS_TEXT = {
  live: 'Kamera hidup',
  connecting: 'Menyambung…',
  offline: 'Kamera mati'
}

const STATUS_DOT = {
  live: 'bg-emerald-500',
  connecting: 'animate-pulse bg-amber-500',
  offline: 'bg-black/30'
}

export default function CameraPage() {
  const [mounted, setMounted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const router = useRouter()

  const { stream, error, loading, videoRef, startCamera, retryCamera } = useCamera()
  const photoSession = usePhotoSession()
  const {
    settings,
    photos,
    sessionStarted,
    retakeSlot,
    startSession,
    updateSettings,
    resetSession,
    clearRetake
  } = photoSession

  // Manual capture hook
  const manualCapture = useManualCapture({ videoRef, photoSession })

  // Gesture detection hook - hanya aktif di mode gesture & saat stream siap
  const gestureDetection = useMediaPipeGesture({
    videoRef,
    stream,
    gestureType: settings.mode === 'gesture' ? settings.gesture : null
  })

  // Nilai turunan (dipakai juga oleh effect pemicu gesture)
  const filledCount = photos.filter((photo) => photo.blob !== null).length
  const totalSlots = photos.length || settings.photoCount
  const nextSlotIndex = photos.length ? photos.findIndex((photo) => photo.blob === null) : 0
  const displaySlots =
    photos.length > 0
      ? photos
      : Array.from({ length: settings.photoCount }, (_, index) => ({ slot: index, blob: null }))
  const allFilled = photos.length > 0 && filledCount === photos.length
  const countdownActive = manualCapture.countdown.isActive
  const isRetake = retakeSlot !== null
  const cameraStatus = stream ? 'live' : loading ? 'connecting' : 'offline'

  // Penanda tepi-naik gesture & timer jeda setelah sesi dimulai
  const gestureWasConfirmedRef = useRef(false)
  const startTimeoutRef = useRef(null)

  useEffect(() => {
    // Gate mount: konten kamera hanya dirender di client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Mulai kamera sekali saat mounted
  useEffect(() => {
    if (mounted) {
      startCamera()
    }
  }, [mounted, startCamera])

  // Bersihkan timer saat unmount / ganti halaman
  useEffect(() => {
    return () => {
      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current)
        startTimeoutRef.current = null
      }
    }
  }, [])

  /**
   * Pemicu gesture -> capture.
   *
   * Hanya bereaksi pada tepi-naik (gesture baru terkonfirmasi), sehingga
   * gesture yang masih ditahan tidak memicu capture berulang. Aturan lengkap
   * ada di resolveGestureAction (fungsi murni, dapat diuji terpisah).
   */
  useEffect(() => {
    const confirmed = gestureDetection.isGestureConfirmed
    const wasConfirmed = gestureWasConfirmedRef.current
    gestureWasConfirmedRef.current = confirmed

    const action = resolveGestureAction({
      confirmed,
      wasConfirmed,
      mode: settings.mode,
      method: settings.method,
      sessionStarted,
      allFilled,
      retakeSlot,
      countdownActive,
      isCapturing: manualCapture.isCapturing,
      perSesiActive: manualCapture.perSesiActive
    })

    if (action === 'none') return

    // Retake / foto berikutnya: pakai countdown & capture yang sudah ada
    if (action === 'retake' || action === 'capture-per-foto') {
      manualCapture.capturePerFoto()
      return
    }
    if (action === 'capture-per-sesi') {
      manualCapture.capturePerSesi()
      return
    }

    // Sesi belum dimulai: gesture pertama memulai sesi sekaligus capture
    setSettingsOpen(false)
    startSession(settings)

    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current)
    startTimeoutRef.current = setTimeout(() => {
      startTimeoutRef.current = null
      if (action === 'start-per-sesi') {
        manualCapture.capturePerSesi()
      } else {
        manualCapture.capturePerFoto()
      }
    }, 100)
  }, [
    gestureDetection.isGestureConfirmed,
    settings,
    sessionStarted,
    allFilled,
    retakeSlot,
    countdownActive,
    manualCapture,
    startSession
  ])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-black/15 border-t-black/70"></div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">Memuat studio…</p>
        </div>
      </div>
    )
  }

  const handleStartSession = () => {
    setSettingsOpen(false)
    startSession(settings)

    // Mode manual: mulai sesi sekaligus jalankan jepretan pertama.
    // Mode gesture: sesi dimulai, pengambilan menunggu gesture.
    if (settings.mode === 'manual') {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = setTimeout(() => {
        startTimeoutRef.current = null
        if (settings.method === 'per-sesi') {
          manualCapture.capturePerSesi()
        } else {
          manualCapture.capturePerFoto()
        }
      }, 100)
    }
  }

  const handleCapturePhoto = () => {
    manualCapture.capturePerFoto()
  }

  const handleRetakePhoto = () => {
    manualCapture.capturePerFoto()
  }

  const handleCancel = () => {
    if (countdownActive) {
      manualCapture.countdown.cancel()
    }
    resetSession()
  }

  const handleBackToReview = () => {
    clearRetake()
    router.push('/review')
  }

  // Tentukan aksi utama pada dock
  let action
  if (isRetake) {
    action = {
      label: countdownActive ? 'Bersiap…' : `Ambil Foto Pengganti (${settings.countdown}s)`,
      onClick: handleRetakePhoto,
      disabled: countdownActive
    }
  } else if (!sessionStarted) {
    action = {
      label:
        settings.mode === 'gesture'
          ? 'Mulai Sesi'
          : settings.method === 'per-sesi'
            ? `Mulai Sesi (${settings.countdown}s)`
            : `Jepret Manual (${settings.countdown}s)`,
      onClick: handleStartSession,
      disabled: countdownActive || !stream
    }
  } else if (manualCapture.perSesiActive) {
    action = {
      label: 'Sesi berjalan…',
      onClick: undefined,
      disabled: true
    }
  } else if (allFilled) {
    action = {
      label: 'Lihat Hasil',
      onClick: () => router.push('/review'),
      disabled: false
    }
  } else {
    action = {
      label: `Jepret Manual (${settings.countdown}s)`,
      onClick: handleCapturePhoto,
      disabled: countdownActive || !stream
    }
  }

  // Tentukan teks hint pada dock
  let hintText = 'Posisikan diri, lalu klik untuk berfoto.'
  let hintStrong = false
  let hintNote = `Hitung mundur ${settings.countdown} detik dimulai setiap kali kamu menjepret.`

  if (isRetake) {
    hintText = `Ganti foto ${retakeSlot + 1} — foto lain tetap tersimpan.`
    hintStrong = true
    hintNote = null
  } else if (manualCapture.perSesiActive) {
    hintText = `Sesi berjalan — ${filledCount}/${totalSlots} foto diambil.`
    hintStrong = true
    hintNote = null
  } else if (allFilled) {
    hintText = 'Semua foto selesai.'
    hintStrong = true
    hintNote = 'Tinjau hasil jepretanmu sebelum lanjut ke studio hias.'
  } else if (settings.mode === 'gesture') {
    hintText = gestureDetection.statusMessage
    hintStrong = gestureDetection.gestureStatus === 'confirmed'
    hintNote = gestureDetection.currentGesture
      ? `Terbaca: ${GESTURE_LABEL[gestureDetection.currentGesture]}`
      : sessionStarted
        ? 'Tunjukkan gesture untuk foto berikutnya.'
        : 'Gesture akan memulai sesi otomatis.'
  } else if (sessionStarted) {
    hintNote = `${filledCount} dari ${totalSlots} foto diambil.`
  }

  const showCancel =
    sessionStarted &&
    settings.method === 'per-foto' &&
    !manualCapture.perSesiActive &&
    !isRetake &&
    !allFilled

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A]">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <StudioHeader onOpenSettings={() => setSettingsOpen(true)} />

        {/* Hero */}
        <section className="pb-6 pt-8 sm:pt-10">
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Satu sesi, banyak cerita.
          </h1>
          <p className="mt-2 text-sm text-black/50">
            Atur sesimu, temukan pose terbaik, lalu abadikan momennya.
          </p>
        </section>

        <main>
          {/* Retake indicator */}
          {isRetake && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-800">
              <span aria-hidden="true">↺</span>
              Mode retake · Foto {retakeSlot + 1}
            </div>
          )}

          <div className="grid items-start gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left: studio */}
            <div>
              {/* Studio label row */}
              <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em]">
                <span className="inline-flex items-center gap-2 text-black/50">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[cameraStatus]}`}
                    aria-hidden="true"
                  />
                  {STATUS_TEXT[cameraStatus]}
                </span>
                <span className="font-semibold text-black">
                  Shot {filledCount} / {totalSlots}
                </span>
              </div>

              {/* Camera stage */}
              <CameraPreview
                videoRef={videoRef}
                stream={stream}
                error={error}
                loading={loading}
                onRetry={retryCamera}
                countdown={manualCapture.countdown}
                allowCancelCountdown={settings.method === 'per-foto' || isRetake}
              />

              {/* Bottom dock */}
              <SlotDock
                slots={displaySlots}
                totalSlots={totalSlots}
                nextSlotIndex={nextSlotIndex}
                retakeSlot={retakeSlot}
                actionLabel={action.label}
                onAction={action.onClick}
                actionDisabled={action.disabled}
                hintText={hintText}
                hintStrong={hintStrong}
                note={hintNote}
                onCancel={showCancel ? handleCancel : undefined}
                cancelLabel="Batalkan sesi"
                onBack={isRetake ? handleBackToReview : undefined}
                backLabel="Kembali ke Review"
              />

              {/* Capture error */}
              {manualCapture.captureError && (
                <div className="mt-4 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-[11px] font-medium text-red-800">
                  {manualCapture.captureError}
                </div>
              )}

              {/* Camera error shortcut (juga tampil di stage) */}
              {error && !stream && (
                <p className="mt-4 text-[11px] text-black/45">
                  Kamera belum aktif. Buka pengaturan izin browser lalu tekan Coba Lagi di preview.
                </p>
              )}
            </div>

            {/* Right: settings (desktop) */}
            <aside className="hidden lg:block">
              <SettingsPanel
                settings={settings}
                sessionStarted={sessionStarted}
                onUpdate={updateSettings}
              />

              {settings.mode === 'gesture' && (
                <div className="mt-4">
                  <GestureStatus
                    isModelLoading={gestureDetection.isModelLoading}
                    isModelError={gestureDetection.isModelError}
                    gestureStatus={gestureDetection.gestureStatus}
                    gestureType={settings.gesture}
                    currentGesture={gestureDetection.currentGesture}
                    statusMessage={gestureDetection.statusMessage}
                    onRetry={gestureDetection.retryLoadModel}
                  />
                </div>
              )}
            </aside>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-5 text-[10px] text-black/35">
          <span>
            Foto tersimpan sementara di browser. Unduh hasilnya sebelum menutup halaman.
          </span>
          <span className="font-serif text-sm italic text-black/45">
            Momen kecil juga layak diingatkan.
          </span>
        </footer>
      </div>

      {/* Settings drawer (mobile) */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)}>
        <SettingsPanel
          settings={settings}
          sessionStarted={sessionStarted}
          onUpdate={updateSettings}
          showTitle={false}
        />

        {settings.mode === 'gesture' && (
          <GestureStatus
            isModelLoading={gestureDetection.isModelLoading}
            isModelError={gestureDetection.isModelError}
            gestureStatus={gestureDetection.gestureStatus}
            gestureType={settings.gesture}
            currentGesture={gestureDetection.currentGesture}
            statusMessage={gestureDetection.statusMessage}
            onRetry={gestureDetection.retryLoadModel}
          />
        )}
      </SettingsDrawer>
    </div>
  )
}
