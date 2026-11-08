'use client'

import { useEffect, useRef, useState } from 'react'
import { DEFAULT_COVER } from '@/lib/utils/editorCover'
import { DEFAULT_FILTER } from '@/lib/utils/editorFilters'
import { DEFAULT_FRAME, getFrame, isCustomFrame } from '@/lib/utils/editorFrames'
import {
  PREVIEW_LAYOUTS,
  loadCompositionFrame,
  loadCompositionImages,
  renderComposition
} from '@/lib/utils/editorRenderer'

export { PREVIEW_LAYOUTS }

/**
 * Area preview utama editor.
 *
 * Merender cover, foto, filter, dan bingkai ke <canvas> memakai pipeline
 * yang sama dengan tombol download (lib/utils/editorRenderer.js). Object URL
 * tidak dibuat di sini — komponen menerima URL dari usePhotoUrls agar tidak
 * ada URL ganda.
 *
 * @param {Object} props
 * @param {Array<string | null>} props.urls - Object URL foto (urut sesuai slot)
 * @param {'strip' | 'grid'} [props.layout='strip'] - Layout aktif
 * @param {string} [props.cover=DEFAULT_COVER] - Template cover aktif
 * @param {string} [props.photoFilter=DEFAULT_FILTER] - Filter foto aktif
 * @param {string} [props.frame=DEFAULT_FRAME] - Bingkai aktif
 */
export default function EditorPreview({
  urls = [],
  layout = 'strip',
  cover = DEFAULT_COVER,
  photoFilter = DEFAULT_FILTER,
  frame = DEFAULT_FRAME
}) {
  const canvasRef = useRef(null)
  const imageCacheRef = useRef({ key: null, images: [] })
  const frameImageCacheRef = useRef({ src: null, image: null, error: null })
  const [isRendering, setIsRendering] = useState(true)
  const [renderError, setRenderError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const validUrls = urls.filter(Boolean)
    const cacheKey = validUrls.join('|')

    const render = async () => {
      if (validUrls.length === 0) {
        setRenderError(null)
        setIsRendering(false)
        return
      }

      setIsRendering(true)
      setRenderError(null)

      try {
        // Muat ulang gambar hanya saat daftar foto berubah. Saat layout,
        // cover, filter, atau bingkai berganti, gambar yang sudah dimuat
        // dipakai kembali.
        let images = imageCacheRef.current.images
        if (
          imageCacheRef.current.key !== cacheKey ||
          images.length !== validUrls.length
        ) {
          images = await loadCompositionImages(validUrls)
          if (cancelled) return
          imageCacheRef.current = { key: cacheKey, images }
        }

        if (cancelled) return

        const canvas = canvasRef.current
        if (!canvas) return

        // Muat PNG bingkai kustom sekali per sumber. Hasil (termasuk error)
        // di-cache agar pergantian pengaturan tidak memicu request berulang.
        let frameImage = null
        let frameError = null

        if (isCustomFrame(frame)) {
          const src = getFrame(frame).src

          if (frameImageCacheRef.current.src !== src) {
            const result = await loadCompositionFrame(frame)
            if (cancelled) return
            frameImageCacheRef.current = {
              src,
              image: result.image,
              error: result.error
            }
          }

          frameImage = frameImageCacheRef.current.image
          frameError = frameImageCacheRef.current.error
        }

        if (cancelled) return

        renderComposition(canvas, {
          images,
          layout,
          cover,
          photoFilter,
          frame,
          frameImage
        })

        if (frameError) {
          console.warn('Bingkai PNG tidak dapat dimuat:', frameError)
          setRenderError(
            'Bingkai PNG tidak dapat dimuat. Preview tampil tanpa bingkai kustom.'
          )
        }
      } catch (error) {
        if (!cancelled) {
          // Jangan meninggalkan hasil lama ketika render terbaru gagal.
          const canvas = canvasRef.current
          const context = canvas?.getContext('2d')
          if (canvas && context) {
            canvas.width = canvas.width
            context.fillStyle = '#FFFFFF'
            context.fillRect(0, 0, canvas.width, canvas.height)
          }
          setRenderError(error.message || 'Preview gagal diperbarui.')
        }
      } finally {
        if (!cancelled) setIsRendering(false)
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [urls, layout, cover, photoFilter, frame])

  const isEmpty = urls.filter(Boolean).length === 0
  const layoutLabel =
    layout === PREVIEW_LAYOUTS.grid ? 'Grid 2 kolom' : 'Strip 1 kolom'

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
        <span className="font-semibold">Preview</span>
        <span className="text-black/35">{layoutLabel}</span>
      </div>

      <div className="relative border border-black/10 bg-[#EFEAE3] p-3 sm:p-5">
        {isEmpty ? (
          <div className="flex aspect-[3/4] w-full items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.16em] text-black/35">
              Belum ada foto untuk ditampilkan
            </p>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            aria-label={`Preview komposisi foto ${layoutLabel}`}
            aria-busy={isRendering}
            className="mx-auto block h-auto w-auto max-w-full"
            style={{ maxHeight: '68vh' }}
          />
        )}

        {isRendering && !isEmpty && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            <span className="inline-flex items-center gap-2 bg-[#1E1C1A]/85 px-3 py-1.5 text-[10px] font-medium text-white">
              <span
                className="h-2.5 w-2.5 animate-spin rounded-full border border-white/40 border-t-white"
                aria-hidden="true"
              />
              Memperbarui tampilan…
            </span>
          </div>
        )}
      </div>

      {renderError && (
        <p className="mt-2 text-[10px] text-red-600" role="alert">
          {renderError}
        </p>
      )}
    </div>
  )
}
