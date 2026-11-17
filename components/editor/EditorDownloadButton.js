'use client'

import { useRef, useState } from 'react'
import { DEFAULT_COVER } from '@/lib/utils/editorCover'
import { DEFAULT_FILTER } from '@/lib/utils/editorFilters'
import { DEFAULT_FRAME } from '@/lib/utils/editorFrames'
import {
  loadCompositionAssets,
  renderComposition
} from '@/lib/utils/editorRenderer'

// Hasil download minimal 1200 px lebar. Aset bingkai 3 foto hanya 213 px,
// jadi ekspor dinaikkan resolusinya agar foto, teks, dan garis tidak pecah.
const EXPORT_MIN_WIDTH = 1200

function pad(value) {
  return String(value).padStart(2, '0')
}

/**
 * Nama file aman untuk Windows maupun sistem operasi lain.
 * Contoh: photobooth-20261107-184530.png
 */
function buildDownloadFilename(date = new Date()) {
  const day = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}`
  const time = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(
    date.getSeconds()
  )}`

  return `photobooth-${day}-${time}.png`
}

/** Mengubah canvas menjadi Blob PNG tanpa mengubah ukuran internal canvas. */
function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Browser tidak menghasilkan file PNG.'))
          return
        }
        resolve(blob)
      }, 'image/png')
    } catch (error) {
      reject(error)
    }
  })
}

function startBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()
  link.remove()

  // Beri waktu browser memulai unduhan sebelum URL dilepas.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function DownloadIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
      />
    </svg>
  )
}

/**
 * Tombol download hasil Studio Hias.
 *
 * Ekspor memakai objek canvas terpisah tetapi pipeline render yang sama
 * dengan preview, sehingga posisi, cover, filter, dan bingkai konsisten.
 *
 * @param {Object} props
 * @param {Array<string | null>} props.urls
 * @param {'strip' | 'grid'} [props.layout='strip']
 * @param {string} [props.cover=DEFAULT_COVER]
 * @param {string} [props.photoFilter=DEFAULT_FILTER]
 * @param {string} [props.frame=DEFAULT_FRAME]
 */
export default function EditorDownloadButton({
  urls = [],
  layout = 'strip',
  cover = DEFAULT_COVER,
  photoFilter = DEFAULT_FILTER,
  frame = DEFAULT_FRAME
}) {
  const busyRef = useRef(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState(null)

  const hasPhotos = urls.some(Boolean)

  const handleDownload = async () => {
    // Ref mencegah klik ganda sebelum React sempat menonaktifkan tombol.
    if (busyRef.current || !hasPhotos) return

    busyRef.current = true
    setIsDownloading(true)
    setError(null)

    try {
      const { images, frameImage, frameError } = await loadCompositionAssets({
        urls,
        frame,
        layout
      })

      if (frameError) {
        throw new Error('Bingkai PNG yang dipilih tidak dapat dimuat.')
      }

      const canvas = document.createElement('canvas')
      renderComposition(canvas, {
        images,
        layout,
        cover,
        photoFilter,
        frame,
        frameImage,
        minWidth: EXPORT_MIN_WIDTH
      })

      const blob = await canvasToPngBlob(canvas)

      // Lepas memori canvas segera setelah Blob selesai dibuat.
      canvas.width = 0
      canvas.height = 0

      startBrowserDownload(blob, buildDownloadFilename())
    } catch (downloadError) {
      console.error('Gagal membuat hasil foto:', downloadError)
      setError('Hasil foto gagal dibuat. Coba lagi beberapa saat lagi.')
    } finally {
      busyRef.current = false
      setIsDownloading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        id="download-hasil"
        onClick={handleDownload}
        disabled={!hasPhotos || isDownloading}
        aria-busy={isDownloading}
        title={!hasPhotos ? 'Belum ada foto untuk diunduh' : undefined}
        className="flex w-full items-center justify-between gap-3 bg-[#1E1C1A] px-5 py-3.5 text-left text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.12em]">
          {isDownloading ? (
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border border-white/40 border-t-white"
              aria-hidden="true"
            />
          ) : (
            <DownloadIcon />
          )}
          {isDownloading ? 'Menyiapkan Foto...' : 'Download Hasil Foto'}
        </span>
        <span className="text-[9px] uppercase tracking-[0.16em] text-white/45">
          PNG
        </span>
      </button>

      <div className="mt-2 flex items-start justify-between gap-3 text-[10px] leading-relaxed text-black/35">
        <span>Satu gambar gabungan, sesuai pengaturan terakhir.</span>
        <span className="shrink-0 uppercase tracking-[0.12em]">
          Resolusi tinggi
        </span>
      </div>

      {error && (
        <p className="mt-2 text-[10px] text-red-600" role="alert">
          {error}
        </p>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {isDownloading ? 'Menyiapkan foto untuk diunduh.' : ''}
      </span>
    </div>
  )
}
