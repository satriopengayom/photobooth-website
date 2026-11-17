/**
 * Bingkai Studio Hias.
 *
 * Bingkai bawaan digambar dengan Canvas API pada lapisan paling atas.
 * Bingkai PNG transparan dapat didaftarkan lewat CUSTOM_FRAME_REGISTRY.
 * Registry mendukung dua pola:
 *
 * 1. Overlay biasa (`src`): PNG digambar menutupi seluruh kanvas.
 * 2. Slot foto (`variants`): PNG punya koordinat area transparan untuk tiap
 *    jumlah foto. Renderer menempatkan foto ke slot sesuai `fit` (default
 *    `contain`, bisa `cover`), lalu menggambar PNG sebagai lapisan paling atas.
 *
 * Setiap bingkai bawaan punya `margin` (px) yang menjadi lebar pita bingkai.
 * Margin ini juga dipakai untuk menghitung area konten (cover + foto),
 * sehingga hiasan bingkai tidak menimpa foto.
 */

export const BUILT_IN_FRAMES = [
  {
    id: 'none',
    label: 'None',
    description: 'Tanpa bingkai tambahan.',
    margin: 28
  },
  {
    id: 'classic-white',
    label: 'Classic White',
    description: 'Matte putih dengan garis tipis.',
    margin: 44
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Krem retro dengan aksen sudut.',
    margin: 46
  },
  {
    id: 'cute',
    label: 'Cute',
    description: 'Pastel dengan ornamen scallop.',
    margin: 44
  },
  {
    id: 'elegant-black',
    label: 'Elegant Black',
    description: 'Hitam elegan dengan garis champagne.',
    margin: 46
  }
]

/**
 * Registry bingkai PNG transparan buatan sendiri.
 *
 * Cara menambah overlay biasa:
 *
 *    {
 *      id: 'my-frame',
 *      label: 'My Frame',
 *      description: 'Bingkai buatan sendiri.',
 *      src: '/frames/my-frame.png',
 *      margin: 40
 *    }
 *
 * Cara menambah bingkai dengan slot foto (satu pilihan UI, aset berbeda
 * menurut jumlah foto):
 *
 *    {
 *      id: 'my-slot-frame',
 *      label: 'My Slot Frame',
 *      description: 'Bingkai untuk Layout Strip.',
 *      layout: 'strip',
 *      cover: false,
 *      variants: {
 *        3: { src: '/frames/my-frame-3.png', width: 213, height: 640,
 *             slots: [{ x: 10, y: 60, width: 194, height: 149 }] },
 *        4: { src: '/frames/my-frame-4.png', width: 852, height: 3208,
 *             slots: [{ x: 43, y: 238, width: 772, height: 596 }] }
 *      }
 *    }
 *
 * Koordinat slot memakai ukuran asli file PNG (width/height variant).
 * `fit: 'contain'` menjaga seluruh foto, sedangkan `fit: 'cover'` memenuhi
 * slot dan boleh memotong tepi foto. Default-nya `contain`.
 *
 * `slotBackdrop: 'blur'` mengisi sisa ruang slot dengan versi blur dari foto
 * yang sama. Foto utama tetap utuh (tidak di-crop dan tidak diregangkan),
 * tetapi tidak ada pita putih di sisi slot.
 */
// Lokasi aset mengikuti struktur folder yang benar-benar ada di public/frames.
// Nama folder dan file mengandung spasi, jadi path di-encode agar aman dipakai
// sebagai src gambar di browser.
const STRIP_3_DIR = '/frames/3 foto 1 kolom'
const STRIP_4_DIR = '/frames/4 foto 1 kolom'

const stripAsset = (directory, fileName) =>
  encodeURI(`${directory}/${fileName}`)

const SPIDER_STRIP_3_SRC = stripAsset(STRIP_3_DIR, '3 strip spiderman.png')
const SPIDER_STRIP_4_SRC = stripAsset(STRIP_4_DIR, '4 strip spiderman.png')
const ZOOTOPIA_STRIP_3_SRC = stripAsset(
  STRIP_3_DIR,
  '3 - strip zootopia.png'
)
const ZOOTOPIA_STRIP_4_SRC = stripAsset(
  STRIP_4_DIR,
  '4 - strip zootopia.png'
)
const RETRO_STRIP_3_SRC = stripAsset(STRIP_3_DIR, '3 strip retro.png')
const RETRO_STRIP_4_SRC = stripAsset(STRIP_4_DIR, '4 strip retro.png')
const VINTAGE_STRIP_3_SRC = stripAsset(STRIP_3_DIR, '3 strip vintage.png')
const VINTAGE_STRIP_4_SRC = stripAsset(STRIP_4_DIR, '4 strip vintage.png')

/**
 * Satu entri registry = satu desain bingkai yang bisa dipilih pengguna.
 *
 * - `layout` membatasi bingkai ke layout yang kompatibel. Saat ini seluruh
 *   aset custom adalah Strip 1 kolom, jadi tidak pernah muncul di Grid.
 * - `photoCounts` mencatat jumlah foto yang didukung.
 * - `variants[3]` dan `variants[4]` adalah pasangan aset dari desain yang
 *   sama. UI hanya menampilkan satu pilihan; renderer memilih file sesuai
 *   jumlah foto aktif.
 * - Koordinat `slots` diambil dari area transparan asli tiap file aset
 *   (ukuran file apa adanya, bukan hasil perkiraan).
 */
export const CUSTOM_FRAME_REGISTRY = [
  {
    id: 'spider-man-strip',
    label: 'Spider-Man Strip',
    description:
      'Bingkai Spider-Man 3/4 foto. Khusus Layout Strip, tanpa area cover.',
    layout: 'strip',
    photoCounts: [3, 4],
    cover: false,
    src: SPIDER_STRIP_3_SRC,
    fit: 'contain',
    slotBackdrop: 'blur',
    slotFill: '#1E1C1A',
    variants: {
      3: {
        src: SPIDER_STRIP_3_SRC,
        width: 213,
        height: 640,
        slots: [
          { x: 10, y: 59, width: 194, height: 150 },
          { x: 10, y: 221, width: 194, height: 149 },
          { x: 10, y: 383, width: 194, height: 149 }
        ]
      },
      4: {
        src: SPIDER_STRIP_4_SRC,
        width: 852,
        height: 3208,
        slots: [
          { x: 41, y: 237, width: 775, height: 597 },
          { x: 41, y: 882, width: 777, height: 597 },
          { x: 34, y: 1530, width: 777, height: 597 },
          { x: 41, y: 2181, width: 776, height: 595 }
        ]
      }
    }
  },
  {
    id: 'zootopia-strip',
    label: 'Zootopia Strip',
    description:
      'Bingkai Zootopia 3/4 foto. Khusus Layout Strip, tanpa area cover.',
    layout: 'strip',
    photoCounts: [3, 4],
    cover: false,
    src: ZOOTOPIA_STRIP_3_SRC,
    fit: 'contain',
    slotBackdrop: 'blur',
    slotFill: '#1E1C1A',
    variants: {
      3: {
        src: ZOOTOPIA_STRIP_3_SRC,
        width: 540,
        height: 1620,
        slots: [
          { x: 30, y: 172, width: 480, height: 307 },
          { x: 30, y: 573, width: 480, height: 307 },
          { x: 30, y: 974, width: 480, height: 307 }
        ]
      },
      4: {
        src: ZOOTOPIA_STRIP_4_SRC,
        width: 540,
        height: 2021,
        slots: [
          { x: 30, y: 172, width: 480, height: 307 },
          { x: 30, y: 573, width: 480, height: 307 },
          { x: 30, y: 974, width: 480, height: 307 },
          { x: 30, y: 1375, width: 480, height: 307 }
        ]
      }
    }
  },
  {
    id: 'retro-strip',
    label: 'Retro Strip',
    description:
      'Bingkai retro TV 3/4 foto. Khusus Layout Strip, tanpa area cover.',
    layout: 'strip',
    photoCounts: [3, 4],
    cover: false,
    src: RETRO_STRIP_3_SRC,
    fit: 'contain',
    slotBackdrop: 'blur',
    slotFill: '#1E1C1A',
    variants: {
      3: {
        src: RETRO_STRIP_3_SRC,
        width: 540,
        height: 1620,
        slots: [
          { x: 70, y: 156, width: 295, height: 227 },
          { x: 70, y: 578, width: 295, height: 227 },
          { x: 74, y: 999, width: 295, height: 227 }
        ]
      },
      4: {
        src: RETRO_STRIP_4_SRC,
        width: 540,
        height: 2058,
        slots: [
          { x: 70, y: 156, width: 295, height: 227 },
          { x: 70, y: 578, width: 295, height: 227 },
          { x: 74, y: 999, width: 295, height: 227 },
          { x: 74, y: 1437, width: 295, height: 227 }
        ]
      }
    }
  },
  {
    id: 'vintage-strip',
    label: 'Vintage Strip',
    description:
      'Bingkai vintage lace 3/4 foto. Khusus Layout Strip, tanpa area cover.',
    layout: 'strip',
    photoCounts: [3, 4],
    cover: false,
    src: VINTAGE_STRIP_3_SRC,
    fit: 'contain',
    slotBackdrop: 'blur',
    slotFill: '#1E1C1A',
    variants: {
      3: {
        src: VINTAGE_STRIP_3_SRC,
        width: 852,
        height: 1955,
        slots: [
          { x: 89, y: 214, width: 674, height: 431 },
          { x: 89, y: 777, width: 674, height: 430 },
          { x: 89, y: 1381, width: 673, height: 431 }
        ]
      },
      4: {
        src: VINTAGE_STRIP_4_SRC,
        width: 852,
        height: 2560,
        slots: [
          { x: 89, y: 214, width: 674, height: 431 },
          { x: 89, y: 777, width: 674, height: 430 },
          { x: 89, y: 1424, width: 674, height: 430 },
          { x: 89, y: 1986, width: 673, height: 431 }
        ]
      }
    }
  }
]

export const DEFAULT_FRAME = 'none'

export function getFrameOptions() {
  return [...BUILT_IN_FRAMES, ...CUSTOM_FRAME_REGISTRY]
}

export function getFrame(frameId) {
  return (
    getFrameOptions().find((frame) => frame.id === frameId) ??
    BUILT_IN_FRAMES[0]
  )
}

export function isCustomFrame(frameId) {
  return CUSTOM_FRAME_REGISTRY.some((frame) => frame.id === frameId)
}

/**
 * Mengambil aset varian bingkai sesuai jumlah foto.
 *
 * @param {string} frameId
 * @param {number} photoCount
 * @returns {Object | null}
 */
export function getFrameVariant(frameId, photoCount) {
  if (!isCustomFrame(frameId)) return null
  return getFrame(frameId).variants?.[photoCount] ?? null
}

/**
 * Sumber gambar untuk thumbnail di panel pengaturan.
 * Untuk bingkai bervarian, thumbnail mengikuti jumlah foto saat ini sehingga
 * pengguna tidak perlu memilih varian 3 foto dan 4 foto secara terpisah.
 *
 * @param {string} frameId
 * @param {number} photoCount
 * @returns {string | null}
 */
export function getFramePreviewSrc(frameId, photoCount) {
  if (!isCustomFrame(frameId)) return null
  const frame = getFrame(frameId)
  return frame.variants?.[photoCount]?.src ?? frame.src ?? null
}

/**
 * Daftar layout yang didukung. Bingkai tanpa `layout` mendukung semua layout.
 *
 * @param {Object} frame
 * @returns {string[] | null}
 */
function getFrameLayouts(frame) {
  if (!frame?.layout) return null
  return Array.isArray(frame.layout) ? frame.layout : [frame.layout]
}

/**
 * Apakah bingkai boleh dipakai pada layout aktif.
 * Bingkai tanpa `layout` mendukung semua layout.
 *
 * @param {string} frameId
 * @param {'strip' | 'grid'} layout
 * @returns {boolean}
 */
export function isFrameAvailableForLayout(frameId, layout) {
  const layouts = getFrameLayouts(getFrame(frameId))
  return !layouts || layouts.includes(layout)
}

/**
 * Apakah bingkai menyediakan aset untuk jumlah foto aktif.
 * Bingkai tanpa varian dianggap selalu tersedia.
 *
 * @param {string} frameId
 * @param {number} photoCount
 * @returns {boolean}
 */
export function isFrameAvailableForPhotoCount(frameId, photoCount) {
  const frame = getFrame(frameId)
  if (!frame.variants) return true
  const variant = frame.variants[photoCount]
  if (!variant) return false
  if (variant.slots) return variant.slots.length === photoCount
  return true
}

/**
 * Kombinasi lengkap layout + jumlah foto. Dipakai UI dan renderer agar daftar
 * dan hasil render memakai aturan yang persis sama.
 *
 * @param {string} frameId
 * @param {'strip' | 'grid'} layout
 * @param {number} photoCount
 * @returns {boolean}
 */
export function isFrameCompatible(frameId, layout, photoCount) {
  return (
    isFrameAvailableForLayout(frameId, layout) &&
    isFrameAvailableForPhotoCount(frameId, photoCount)
  )
}

/**
 * Pilihan bingkai yang boleh tampil pada layout + jumlah foto aktif.
 * Bingkai custom yang tidak kompatibel tidak ditampilkan sama sekali.
 *
 * @param {'strip' | 'grid'} layout
 * @param {number} [photoCount]
 * @returns {Array<Object>}
 */
export function getFrameOptionsForLayout(layout, photoCount) {
  return getFrameOptions().filter(
    (frame) =>
      isFrameAvailableForLayout(frame.id, layout) &&
      (photoCount == null ||
        isFrameAvailableForPhotoCount(frame.id, photoCount))
  )
}

/**
 * Menentukan bingkai yang benar-benar dipakai renderer. Bingkai yang tidak
 * kompatibel dengan layout/jumlah foto baru otomatis jatuh ke Tanpa Bingkai.
 *
 * @param {string} frameId
 * @param {'strip' | 'grid'} layout
 * @param {number} photoCount
 * @returns {string}
 */
export function resolveFrameForLayout(frameId, layout, photoCount) {
  return isFrameCompatible(frameId, layout, photoCount)
    ? frameId
    : DEFAULT_FRAME
}

/**
 * Sumber PNG aktif untuk bingkai kustom. Mengembalikan null bila bingkai
 * bukan kustom, layout tidak didukung, atau varian jumlah foto tidak ada.
 *
 * @param {string} frameId
 * @param {'strip' | 'grid'} layout
 * @param {number} photoCount
 * @returns {string | null}
 */
export function getFrameSource(frameId, layout, photoCount) {
  if (!isCustomFrame(frameId)) return null
  if (!isFrameCompatible(frameId, layout, photoCount)) return null

  const frame = getFrame(frameId)
  if (frame.variants) {
    return frame.variants[photoCount]?.src ?? null
  }

  return frame.src ?? null
}

/**
 * Apakah bingkai masih punya area cover. Slot frame penuh seperti aset
 * Spider-Man dan Zootopia tidak menyediakan area cover terpisah.
 *
 * @param {string} frameId
 * @returns {boolean}
 */
export function isFrameCoverEnabled(frameId) {
  return getFrame(frameId).cover !== false
}

export function getFrameMargin(frameId) {
  return getFrame(frameId).margin ?? 28
}

const HAIRLINE = 0.5

function fillBand(context, width, height, thickness, color) {
  context.fillStyle = color
  context.fillRect(0, 0, width, thickness)
  context.fillRect(0, height - thickness, width, thickness)
  context.fillRect(0, 0, thickness, height)
  context.fillRect(width - thickness, 0, thickness, height)
}

function drawDiamond(context, centerX, centerY, size, color) {
  context.save()
  context.translate(centerX, centerY)
  context.rotate(Math.PI / 4)
  context.fillStyle = color
  context.fillRect(-size / 2, -size / 2, size, size)
  context.restore()
}

function drawHeart(context, centerX, centerY, size, color) {
  context.save()
  context.translate(centerX, centerY)
  context.scale(size / 16, size / 16)
  context.beginPath()
  context.moveTo(0, 5)
  context.bezierCurveTo(-9, -4, -8, -12, 0, -6)
  context.bezierCurveTo(8, -12, 9, -4, 0, 5)
  context.closePath()
  context.fillStyle = color
  context.fill()
  context.restore()
}

function drawCornerBrackets(context, width, height, inset, length, color, lineWidth) {
  context.strokeStyle = color
  context.lineWidth = lineWidth
  context.lineCap = 'square'

  context.beginPath()
  // top-left
  context.moveTo(inset, inset + length)
  context.lineTo(inset, inset)
  context.lineTo(inset + length, inset)
  // top-right
  context.moveTo(width - inset - length, inset)
  context.lineTo(width - inset, inset)
  context.lineTo(width - inset, inset + length)
  // bottom-right
  context.moveTo(width - inset, height - inset - length)
  context.lineTo(width - inset, height - inset)
  context.lineTo(width - inset - length, height - inset)
  // bottom-left
  context.moveTo(inset + length, height - inset)
  context.lineTo(inset, height - inset)
  context.lineTo(inset, height - inset - length)
  context.stroke()
}

function drawClassicWhite(context, width, height, margin) {
  fillBand(context, width, height, margin, '#FCFAF6')

  context.strokeStyle = 'rgba(30, 28, 26, 0.18)'
  context.lineWidth = 1
  context.strokeRect(
    10 + HAIRLINE,
    10 + HAIRLINE,
    width - 20 - 1,
    height - 20 - 1
  )

  // Garis ganda di luar area konten, tetap di dalam pita bingkai.
  context.strokeStyle = 'rgba(30, 28, 26, 0.55)'
  context.lineWidth = 1
  const outerInset = margin - 8
  context.strokeRect(
    outerInset + HAIRLINE,
    outerInset + HAIRLINE,
    width - outerInset * 2 - 1,
    height - outerInset * 2 - 1
  )

  context.strokeStyle = 'rgba(30, 28, 26, 0.22)'
  const innerInset = margin - 4
  context.strokeRect(
    innerInset + HAIRLINE,
    innerInset + HAIRLINE,
    width - innerInset * 2 - 1,
    height - innerInset * 2 - 1
  )

  drawCornerBrackets(
    context,
    width,
    height,
    10,
    16,
    'rgba(30, 28, 26, 0.6)',
    2
  )
}

function drawVintage(context, width, height, margin) {
  fillBand(context, width, height, margin, '#EADDC7')

  context.strokeStyle = 'rgba(122, 90, 68, 0.32)'
  context.lineWidth = 1
  context.strokeRect(
    12 + HAIRLINE,
    12 + HAIRLINE,
    width - 24 - 1,
    height - 24 - 1
  )

  // Bingkai ganda cokelat di luar area konten.
  const outerInset = margin - 9
  context.strokeStyle = 'rgba(122, 90, 68, 0.8)'
  context.lineWidth = 2
  context.strokeRect(
    outerInset,
    outerInset,
    width - outerInset * 2,
    height - outerInset * 2
  )

  const innerInset = margin - 4
  context.strokeStyle = 'rgba(122, 90, 68, 0.42)'
  context.lineWidth = 1
  context.strokeRect(
    innerInset + HAIRLINE,
    innerInset + HAIRLINE,
    width - innerInset * 2 - 1,
    height - innerInset * 2 - 1
  )

  drawDiamond(context, outerInset, outerInset, 7, '#8A6A4F')
  drawDiamond(context, width - outerInset, outerInset, 7, '#8A6A4F')
  drawDiamond(context, outerInset, height - outerInset, 7, '#8A6A4F')
  drawDiamond(context, width - outerInset, height - outerInset, 7, '#8A6A4F')

  // Lengkung dekoratif di sudut luar.
  context.strokeStyle = 'rgba(122, 90, 68, 0.35)'
  context.lineWidth = 1
  const cornerRadius = 22

  context.beginPath()
  context.arc(12, 12, cornerRadius, 0, Math.PI / 2)
  context.stroke()

  context.beginPath()
  context.arc(width - 12, 12, cornerRadius, Math.PI / 2, Math.PI)
  context.stroke()

  context.beginPath()
  context.arc(
    width - 12,
    height - 12,
    cornerRadius,
    Math.PI,
    (Math.PI * 3) / 2
  )
  context.stroke()

  context.beginPath()
  context.arc(
    12,
    height - 12,
    cornerRadius,
    (Math.PI * 3) / 2,
    Math.PI * 2
  )
  context.stroke()
}

function drawCute(context, width, height, margin) {
  fillBand(context, width, height, margin, '#FCE7EE')

  // Garis putus-putus di luar area konten.
  const dashedInset = margin - 6
  context.strokeStyle = '#F2AFC6'
  context.lineWidth = 1
  context.setLineDash([5, 5])
  context.strokeRect(
    dashedInset + HAIRLINE,
    dashedInset + HAIRLINE,
    width - dashedInset * 2 - 1,
    height - dashedInset * 2 - 1
  )
  context.setLineDash([])

  // Scallop kecil di sepanjang tepi area konten.
  context.fillStyle = '#F2AFC6'
  const step = 18
  const radius = 3

  for (let x = margin; x <= width - margin; x += step) {
    context.beginPath()
    context.arc(x, margin - radius, radius, 0, Math.PI * 2)
    context.fill()

    context.beginPath()
    context.arc(x, height - margin + radius, radius, 0, Math.PI * 2)
    context.fill()
  }

  for (let y = margin; y <= height - margin; y += step) {
    context.beginPath()
    context.arc(margin - radius, y, radius, 0, Math.PI * 2)
    context.fill()

    context.beginPath()
    context.arc(width - margin + radius, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  drawHeart(context, margin / 2, margin / 2, 12, '#F2AFC6')
  drawHeart(context, width - margin / 2, margin / 2, 10, '#F6C453')
  drawHeart(context, margin / 2, height - margin / 2, 10, '#F6C453')
  drawHeart(context, width - margin / 2, height - margin / 2, 12, '#F2AFC6')
}

function drawElegantBlack(context, width, height, margin) {
  fillBand(context, width, height, margin, '#1E1C1A')

  context.strokeStyle = 'rgba(247, 244, 239, 0.16)'
  context.lineWidth = 1
  context.strokeRect(
    10 + HAIRLINE,
    10 + HAIRLINE,
    width - 20 - 1,
    height - 20 - 1
  )

  // Garis champagne di luar area konten.
  const inset = margin - 9
  context.strokeStyle = 'rgba(199, 176, 142, 0.9)'
  context.lineWidth = 1
  context.strokeRect(
    inset + HAIRLINE,
    inset + HAIRLINE,
    width - inset * 2 - 1,
    height - inset * 2 - 1
  )

  drawCornerBrackets(context, width, height, 10, 18, '#C7B08E', 2)
}

/**
 * Menggambar bingkai bawaan ke seluruh kanvas.
 * Hiasan hanya berada di pita margin agar tidak menutupi foto/cover.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} options
 * @param {number} options.width
 * @param {number} options.height
 * @param {number} options.margin
 * @param {string} options.frameId
 */
export function drawCanvasFrame(context, options) {
  const { width, height, margin, frameId } = options

  context.save()
  context.filter = 'none'
  context.globalCompositeOperation = 'source-over'

  switch (frameId) {
    case 'classic-white':
      drawClassicWhite(context, width, height, margin)
      break
    case 'vintage':
      drawVintage(context, width, height, margin)
      break
    case 'cute':
      drawCute(context, width, height, margin)
      break
    case 'elegant-black':
      drawElegantBlack(context, width, height, margin)
      break
    case 'none':
    default:
      break
  }

  context.restore()
}
