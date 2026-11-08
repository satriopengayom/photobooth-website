import { drawCover, getCoverHeight } from '@/lib/utils/editorCover'
import { getFilter } from '@/lib/utils/editorFilters'
import {
  drawCanvasFrame,
  getFrame,
  getFrameMargin,
  isCustomFrame
} from '@/lib/utils/editorFrames'

/** Lebar kanvas komposisi (px). Tinggi dihitung otomatis dari layout & rasio foto. */
export const COMPOSITION_WIDTH = 720
const GAP = 16
const BORDER_COLOR = 'rgba(0, 0, 0, 0.16)'
const BORDER_WIDTH = 1.5

/** Pilihan layout yang didukung pipeline render. */
export const PREVIEW_LAYOUTS = {
  strip: 'strip',
  grid: 'grid'
}

/**
 * Memuat satu gambar. Dipakai untuk foto maupun PNG bingkai kustom.
 *
 * @param {string} url
 * @param {string} [label='gambar'] - Dipakai pada pesan kesalahan.
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(url, label = 'gambar') {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error(`Sumber ${label} tidak tersedia.`))
      return
    }

    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Gagal memuat ${label}.`))
    image.src = url
  })
}

/**
 * Memuat semua foto dari Object URL yang sudah dikelola usePhotoUrls.
 * Tidak membuat Object URL baru.
 *
 * @param {Array<string | null>} urls
 * @returns {Promise<HTMLImageElement[]>}
 */
export function loadCompositionImages(urls = []) {
  return Promise.all(
    urls.filter(Boolean).map((url) => loadImage(url, 'salah satu foto'))
  )
}

/**
 * Memuat PNG bingkai kustom bila bingkai aktif adalah bingkai registry.
 * Kesalahan tidak dilempar agar preview bisa tetap tampil tanpa overlay;
 * pemanggil dapat memeriksa `error` untuk menampilkan pesan.
 *
 * @param {string} frameId
 * @returns {Promise<{ image: HTMLImageElement | null, error: Error | null }>}
 */
export async function loadCompositionFrame(frameId) {
  if (!isCustomFrame(frameId)) {
    return { image: null, error: null }
  }

  const frame = getFrame(frameId)
  if (!frame?.src) {
    return {
      image: null,
      error: new Error('Bingkai PNG tidak memiliki sumber file.')
    }
  }

  try {
    const image = await loadImage(frame.src, 'bingkai PNG')
    return { image, error: null }
  } catch (error) {
    return { image: null, error }
  }
}

/**
 * Memuat seluruh aset untuk ekspor: foto asli dan PNG bingkai (jika ada).
 * Dipakai oleh tombol download agar hasilnya memakai sumber yang sama
 * dengan preview.
 *
 * @param {Object} options
 * @param {Array<string | null>} options.urls
 * @param {string} options.frame
 */
export async function loadCompositionAssets({ urls = [], frame }) {
  const images = await loadCompositionImages(urls)
  const { image: frameImage, error: frameError } = await loadCompositionFrame(
    frame
  )

  return { images, frameImage, frameError }
}

/**
 * Menghitung posisi seluruh elemen komposisi.
 *
 * @param {Object} options
 * @param {HTMLImageElement[]} options.images
 * @param {'strip' | 'grid'} options.layout
 * @param {string} options.frame
 */
export function getCompositionMetrics({ images = [], layout, frame }) {
  const margin = getFrameMargin(frame)
  const coverHeight = getCoverHeight(layout)
  const photosStartY = margin + coverHeight + GAP

  const { frames, bottom } =
    layout === PREVIEW_LAYOUTS.grid
      ? buildGridFrames(images, photosStartY, margin)
      : buildStripFrames(images, photosStartY, margin)

  const height = Math.max(
    Math.round(bottom + margin),
    margin * 2 + coverHeight
  )

  return {
    width: COMPOSITION_WIDTH,
    height,
    margin,
    coverHeight,
    photosStartY,
    frames
  }
}

function drawPhoto(context, image, frame, photoFilter = null) {
  const filterCss = photoFilter?.css
  const overlay = photoFilter?.overlay

  // Filter hanya dibungkus untuk drawImage foto. save/restore memastikan
  // filter tidak bocor ke border, cover, atau elemen lain.
  context.save()
  if (filterCss && filterCss !== 'none') {
    context.filter = filterCss
  }
  context.drawImage(image, frame.x, frame.y, frame.width, frame.height)
  context.restore()

  // Tint suhu warna (warm/cool) hanya di area foto.
  if (overlay) {
    context.save()
    context.globalCompositeOperation = overlay.blend || 'soft-light'
    context.fillStyle = overlay.color
    context.fillRect(frame.x, frame.y, frame.width, frame.height)
    context.restore()
  }

  // Border tipis di dalam tepi foto, konsisten untuk semua layout.
  context.strokeStyle = BORDER_COLOR
  context.lineWidth = BORDER_WIDTH
  context.strokeRect(
    frame.x + BORDER_WIDTH / 2,
    frame.y + BORDER_WIDTH / 2,
    frame.width - BORDER_WIDTH,
    frame.height - BORDER_WIDTH
  )
}

/**
 * Strip 1 kolom: setiap foto memenuhi lebar dalam, tinggi mengikuti rasio asli.
 * Urutan mengikuti urutan foto pada sesi.
 *
 * @param {HTMLImageElement[]} images
 * @param {number} startY - Posisi atas area foto (setelah cover)
 * @param {number} margin - Lebar pita bingkai di kiri/kanan
 */
function buildStripFrames(images, startY, margin) {
  const innerWidth = COMPOSITION_WIDTH - margin * 2
  const frames = []
  let y = startY

  images.forEach((image) => {
    const height = Math.round(
      (innerWidth * image.naturalHeight) / image.naturalWidth
    )
    frames.push({ image, x: margin, y, width: innerWidth, height })
    y += height + GAP
  })

  return {
    frames,
    bottom: images.length > 0 ? y - GAP : startY
  }
}

/**
 * Grid 2 kolom: 4 foto menjadi 2x2; 3 foto menjadi 2 foto di baris pertama
 * dan 1 foto di tengah baris kedua. Rasio tiap foto tetap dipertahankan
 * (tidak di-crop), dan tinggi baris mengikuti foto tertinggi pada baris itu.
 *
 * @param {HTMLImageElement[]} images
 * @param {number} startY - Posisi atas area foto (setelah cover)
 * @param {number} margin - Lebar pita bingkai di kiri/kanan
 */
function buildGridFrames(images, startY, margin) {
  const innerWidth = COMPOSITION_WIDTH - margin * 2
  const columnWidth = Math.floor((innerWidth - GAP) / 2)
  const frames = []
  let y = startY

  for (let index = 0; index < images.length; index += 2) {
    const row = images.slice(index, index + 2)

    const rowFrames = row.map((image, columnIndex) => {
      const height = Math.round(
        (columnWidth * image.naturalHeight) / image.naturalWidth
      )
      const x =
        row.length === 1
          ? margin + (innerWidth - columnWidth) / 2
          : margin + columnIndex * (columnWidth + GAP)

      return { image, x, width: columnWidth, height }
    })

    const rowHeight = Math.max(...rowFrames.map((frame) => frame.height))

    rowFrames.forEach((frame) => {
      frames.push({
        image: frame.image,
        x: frame.x,
        y: y + (rowHeight - frame.height) / 2,
        width: frame.width,
        height: frame.height
      })
    })

    y += rowHeight + GAP
  }

  return {
    frames,
    bottom: images.length > 0 ? y - GAP : startY
  }
}

/**
 * Satu-satunya pipeline penggambaran komposisi Studio Hias.
 *
 * Dipakai oleh preview dan ekspor PNG. Hasil visual identik karena ukuran
 * kanvas, posisi foto, cover, filter, border, dan bingkai dihitung di sini.
 *
 * @param {HTMLCanvasElement} canvas - Canvas preview atau canvas ekspor.
 * @param {Object} options
 * @param {HTMLImageElement[]} options.images
 * @param {'strip' | 'grid'} options.layout
 * @param {string} options.cover
 * @param {string} options.photoFilter
 * @param {string} options.frame
 * @param {HTMLImageElement | null} [options.frameImage]
 * @returns {{width: number, height: number}}
 */
export function renderComposition(canvas, options) {
  if (!canvas) {
    throw new Error('Canvas komposisi tidak tersedia.')
  }

  const {
    images = [],
    layout,
    cover,
    photoFilter,
    frame,
    frameImage = null
  } = options

  if (images.length === 0) {
    throw new Error('Tidak ada foto untuk dirender.')
  }

  const metrics = getCompositionMetrics({ images, layout, frame })

  // Mengatur ukuran juga membersihkan kanvas dari hasil render sebelumnya.
  canvas.width = metrics.width
  canvas.height = metrics.height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Canvas 2D tidak tersedia di browser ini.')
  }

  context.filter = 'none'
  context.globalCompositeOperation = 'source-over'
  context.fillStyle = '#FFFFFF'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'

  // Cover di atas susunan foto, menyatu dalam satu komposisi.
  // Filter foto tidak boleh memengaruhi cover.
  drawCover(context, {
    x: metrics.margin,
    y: metrics.margin,
    width: metrics.width - metrics.margin * 2,
    height: metrics.coverHeight,
    template: cover,
    layout,
    photoCount: images.length
  })

  const activeFilter = getFilter(photoFilter)
  metrics.frames.forEach((photoFrame) => {
    drawPhoto(context, photoFrame.image, photoFrame, activeFilter)
  })

  // Bingkai adalah lapisan paling atas. Bingkai bawaan hanya menggambar
  // di pita margin sehingga foto dan cover tetap utuh.
  if (isCustomFrame(frame)) {
    if (frameImage) {
      context.save()
      context.filter = 'none'
      context.globalCompositeOperation = 'source-over'
      context.drawImage(frameImage, 0, 0, canvas.width, canvas.height)
      context.restore()
    }
  } else {
    drawCanvasFrame(context, {
      width: canvas.width,
      height: canvas.height,
      margin: metrics.margin,
      frameId: frame
    })
  }

  return { width: metrics.width, height: metrics.height }
}
