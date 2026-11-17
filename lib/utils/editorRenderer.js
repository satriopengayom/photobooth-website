import { drawCover, getCoverHeight } from '@/lib/utils/editorCover'
import { getFilter } from '@/lib/utils/editorFilters'
import {
  drawCanvasFrame,
  getFrame,
  getFrameMargin,
  getFrameSource,
  getFrameVariant,
  isCustomFrame,
  isFrameCompatible,
  resolveFrameForLayout
} from '@/lib/utils/editorFrames'

/** Lebar kanvas komposisi (px). Tinggi dihitung otomatis dari layout & rasio foto. */
export const COMPOSITION_WIDTH = 720
const GAP = 16
const BORDER_COLOR = 'rgba(0, 0, 0, 0.16)'
const BORDER_WIDTH = 1.5
// Tepi slot pada aset PNG punya gradasi transparansi beberapa piksel. Foto
// diperluas sedikit di bawah tepi itu agar latar kanvas putih tidak terlihat
// sebagai garis tipis di sekeliling foto.
const SLOT_CLIP_PADDING = 6

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
 * Untuk bingkai bervarian, file dipilih dari jumlah foto dan layout aktif.
 * Kesalahan tidak dilempar agar preview bisa tetap tampil tanpa overlay;
 * pemanggil dapat memeriksa `error` untuk menampilkan pesan.
 *
 * @param {string} frameId
 * @param {'strip' | 'grid'} [layout='strip']
 * @param {number} [photoCount=0]
 * @returns {Promise<{ image: HTMLImageElement | null, src: string | null, error: Error | null }>}
 */
export async function loadCompositionFrame(
  frameId,
  layout = 'strip',
  photoCount = 0
) {
  if (!isCustomFrame(frameId)) {
    return { image: null, src: null, error: null }
  }

  // Bingkai yang tidak kompatibel dengan layout/jumlah foto tidak dimuat.
  // Renderer juga mengabaikannya sebagai lapisan aman.
  if (!isFrameCompatible(frameId, layout, photoCount)) {
    return { image: null, src: null, error: null }
  }

  const src = getFrameSource(frameId, layout, photoCount)
  if (!src) {
    return {
      image: null,
      src: null,
      error: new Error(
        `Bingkai tidak memiliki aset untuk ${photoCount} foto.`
      )
    }
  }

  try {
    const image = await loadImage(src, 'bingkai PNG')
    const variant = getFrameVariant(frameId, photoCount)

    // Pastikan aset yang termuat benar-benar varian yang tercatat. Ini
    // mencegah aset 3 foto terpakai untuk 4 foto bila path registry salah.
    if (
      variant &&
      (image.naturalWidth !== variant.width ||
        image.naturalHeight !== variant.height)
    ) {
      return {
        image: null,
        src,
        error: new Error(
          `Ukuran aset bingkai tidak sesuai registry (${image.naturalWidth}×${image.naturalHeight}).`
        )
      }
    }

    return { image, src, error: null }
  } catch (error) {
    return { image: null, src, error }
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
 * @param {'strip' | 'grid'} [options.layout='strip']
 */
export async function loadCompositionAssets({
  urls = [],
  frame,
  layout = 'strip'
}) {
  const validUrls = urls.filter(Boolean)
  const images = await loadCompositionImages(validUrls)
  const { image: frameImage, error: frameError } = await loadCompositionFrame(
    frame,
    layout,
    validUrls.length
  )

  return { images, frameImage, frameError }
}

/**
 * Bingkai kustom yang tidak kompatibel dengan layout atau jumlah foto aktif
 * diabaikan, sehingga aset Strip tidak pernah dipaksa masuk ke Grid serta
 * varian 3/4 foto tidak pernah tertukar.
 */
function getEffectiveFrame(frame, layout, photoCount = 0) {
  if (!isCustomFrame(frame)) return frame
  return resolveFrameForLayout(frame, layout, photoCount)
}

/**
 * Menempatkan foto ke area transparan aset bingkai.
 * `fit: 'contain'` menjaga seluruh foto; `fit: 'cover'` memenuhi seluruh
 * slot sehingga tidak ada sisa putih, dengan konsekuensi tepi foto terpotong
 * sedikit bila rasionya berbeda. `slotBackdrop: 'blur'` hanya dipakai pada
 * mode contain untuk mengisi sisa ruang slot dengan blur foto yang sama.
 */
function buildSlotFrames(images, variant, frameDefinition) {
  const matte = frameDefinition.slotFill ?? '#FFFFFF'
  const fit = frameDefinition.fit === 'cover' ? 'cover' : 'contain'
  const useBlurBackdrop =
    fit === 'contain' && frameDefinition.slotBackdrop === 'blur'

  return images.map((image, index) => {
    const slot = variant.slots[index]
    const naturalWidth = image.naturalWidth || slot.width
    const naturalHeight = image.naturalHeight || slot.height
    const widthScale = slot.width / naturalWidth
    const heightScale = slot.height / naturalHeight
    const scale =
      fit === 'cover'
        ? Math.max(widthScale, heightScale)
        : Math.min(widthScale, heightScale)
    const width = naturalWidth * scale
    const height = naturalHeight * scale

    return {
      image,
      x: slot.x + (slot.width - width) / 2,
      y: slot.y + (slot.height - height) / 2,
      width,
      height,
      slot,
      matte,
      fit,
      backdrop: useBlurBackdrop,
      showBorder: false
    }
  })
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
  const effectiveFrame = getEffectiveFrame(frame, layout, images.length)
  const variant = getFrameVariant(effectiveFrame, images.length)

  // Jalur khusus bingkai slot: kanvas memakai ukuran asli aset, cover tidak
  // dipakai, dan foto ditempatkan tepat di area transparan.
  if (variant && variant.slots?.length === images.length) {
    return {
      width: variant.width,
      height: variant.height,
      margin: 0,
      coverHeight: 0,
      photosStartY: 0,
      frames: buildSlotFrames(images, variant, getFrame(effectiveFrame)),
      mode: 'slots',
      frame: effectiveFrame
    }
  }

  const margin = getFrameMargin(effectiveFrame)
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
    frames,
    mode: 'standard',
    frame: effectiveFrame
  }
}

/**
 * Mengisi sisa area slot dengan foto yang sama dalam mode cover + blur.
 * Hanya berfungsi sebagai latar; foto utama tetap digambar dengan contain
 * sehingga tidak ada bagian foto yang terpotong.
 */
function drawSlotBackdrop(context, frame, filterCss) {
  const { image, slot } = frame
  if (!image || !slot) return

  const naturalWidth = image.naturalWidth || slot.width
  const naturalHeight = image.naturalHeight || slot.height
  if (!naturalWidth || !naturalHeight) return

  // Overscan mencegah tepi blur terlihat sebagai garis di pinggir slot.
  const scale =
    Math.max(slot.width / naturalWidth, slot.height / naturalHeight) * 1.12
  const width = naturalWidth * scale
  const height = naturalHeight * scale

  const baseFilter =
    filterCss && filterCss !== 'none' ? `${filterCss} ` : ''

  context.save()
  context.filter = `${baseFilter}blur(18px) brightness(0.72) saturate(0.9)`
  context.drawImage(
    image,
    slot.x + (slot.width - width) / 2,
    slot.y + (slot.height - height) / 2,
    width,
    height
  )
  context.restore()
}

function drawPhoto(context, image, frame, photoFilter = null) {
  const filterCss = photoFilter?.css
  const overlay = photoFilter?.overlay
  const hasSlotClip = Boolean(frame.slot)

  // Foto `cover` bisa lebih besar dari slot. Clip ke kotak slot mencegah
  // gambar meluber ke area transparan dekorasi di luar slot. Padding kecil
  // menutup gradasi transparansi tepi aset agar tidak ada garis putih.
  if (hasSlotClip) {
    context.save()
    context.beginPath()
    context.rect(
      frame.slot.x - SLOT_CLIP_PADDING,
      frame.slot.y - SLOT_CLIP_PADDING,
      frame.slot.width + SLOT_CLIP_PADDING * 2,
      frame.slot.height + SLOT_CLIP_PADDING * 2
    )
    context.clip()
  }

  // Slot bingkai kustom diisi warna matte agar sisa ruang tetap rapi.
  if (frame.matte && frame.slot) {
    context.save()
    context.fillStyle = frame.matte
    context.fillRect(
      frame.slot.x,
      frame.slot.y,
      frame.slot.width,
      frame.slot.height
    )
    context.restore()
  }

  // Mode contain: isi sisa slot dengan blur foto yang sama. Foto utama tetap
  // utuh, tetapi tidak ada pita putih di sisi slot.
  if (frame.backdrop) {
    drawSlotBackdrop(context, frame, filterCss)
  }

  // Filter hanya dibungkus untuk drawImage foto. save/restore memastikan
  // filter tidak bocor ke border, cover, atau elemen lain.
  context.save()
  if (filterCss && filterCss !== 'none') {
    context.filter = filterCss
  }
  context.drawImage(image, frame.x, frame.y, frame.width, frame.height)
  context.restore()

  // Tint suhu warna (warm/cool) di area foto. Saat memakai backdrop blur,
  // tint juga menutup sisa slot agar warna foto dan latar tetap konsisten.
  if (overlay) {
    const overlayArea = frame.backdrop ? frame.slot : frame
    context.save()
    context.globalCompositeOperation = overlay.blend || 'soft-light'
    context.fillStyle = overlay.color
    context.fillRect(
      overlayArea.x,
      overlayArea.y,
      overlayArea.width,
      overlayArea.height
    )
    context.restore()
  }

  if (hasSlotClip) {
    context.restore()
  }

  // Border tipis di dalam tepi foto, konsisten untuk layout standar.
  // Bingkai slot tidak memakai border agar foto menyatu dengan aset.
  if (frame.showBorder !== false) {
    context.strokeStyle = BORDER_COLOR
    context.lineWidth = BORDER_WIDTH
    context.strokeRect(
      frame.x + BORDER_WIDTH / 2,
      frame.y + BORDER_WIDTH / 2,
      frame.width - BORDER_WIDTH,
      frame.height - BORDER_WIDTH
    )
  }
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
 * Dipakai oleh preview dan ekspor PNG. Komposisi, posisi foto, cover, filter,
 * border, dan bingkai dihitung di sini. Ekspor dapat memakai kanvas lebih
 * besar lewat `minWidth` tanpa mengubah tata letak.
 *
 * @param {HTMLCanvasElement} canvas - Canvas preview atau canvas ekspor.
 * @param {Object} options
 * @param {HTMLImageElement[]} options.images
 * @param {'strip' | 'grid'} options.layout
 * @param {string} options.cover
 * @param {string} options.photoFilter
 * @param {string} options.frame
 * @param {HTMLImageElement | null} [options.frameImage]
 * @param {number} [options.minWidth=0] - Lebar minimum hasil render (px).
 *   Dipakai ekspor agar download tetap tajam meski aset bingkai kecil.
 * @returns {{width: number, height: number, scale: number}}
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
    frameImage = null,
    minWidth = 0
  } = options

  if (images.length === 0) {
    throw new Error('Tidak ada foto untuk dirender.')
  }

  const effectiveFrame = getEffectiveFrame(frame, layout, images.length)
  const metrics = getCompositionMetrics({
    images,
    layout,
    frame: effectiveFrame
  })

  // Preview memakai ukuran asli. Ekspor boleh memakai kanvas lebih besar
  // supaya foto dan teks tidak ikut pecah saat diunduh/dicetak.
  const scale = minWidth > 0 ? Math.max(1, minWidth / metrics.width) : 1
  const outputWidth = Math.ceil(metrics.width * scale)
  const outputHeight = Math.ceil(metrics.height * scale)

  // Mengatur ukuran juga membersihkan kanvas dari hasil render sebelumnya.
  canvas.width = outputWidth
  canvas.height = outputHeight

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

  // Semua koordinat renderer tetap memakai ukuran logis metrics. Transform
  // ini yang menaikkan resolusi akhir tanpa mengubah posisi elemen.
  if (scale !== 1) {
    context.scale(scale, scale)
  }

  // Cover di atas susunan foto, menyatu dalam satu komposisi.
  // Filter foto tidak boleh memengaruhi cover.
  if (metrics.coverHeight > 0) {
    drawCover(context, {
      x: metrics.margin,
      y: metrics.margin,
      width: metrics.width - metrics.margin * 2,
      height: metrics.coverHeight,
      template: cover,
      layout,
      photoCount: images.length
    })
  }

  const activeFilter = getFilter(photoFilter)
  metrics.frames.forEach((photoFrame) => {
    drawPhoto(context, photoFrame.image, photoFrame, activeFilter)
  })

  // Bingkai adalah lapisan paling atas. Bingkai bawaan hanya menggambar
  // di pita margin sehingga foto dan cover tetap utuh.
  if (isCustomFrame(effectiveFrame)) {
    if (frameImage) {
      context.save()
      context.filter = 'none'
      context.globalCompositeOperation = 'source-over'
      context.drawImage(frameImage, 0, 0, metrics.width, metrics.height)
      context.restore()
    }
  } else {
    drawCanvasFrame(context, {
      width: metrics.width,
      height: metrics.height,
      margin: metrics.margin,
      frameId: effectiveFrame
    })
  }

  return { width: outputWidth, height: outputHeight, scale }
}
