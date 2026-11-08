/**
 * Bingkai Studio Hias.
 *
 * Bingkai bawaan digambar dengan Canvas API pada lapisan paling atas.
 * Bingkai PNG transparan dapat didaftarkan lewat CUSTOM_FRAME_REGISTRY dan
 * akan digambar menutupi seluruh kanvas (lihat EditorPreview).
 *
 * Setiap bingkai punya `margin` (px) yang menjadi lebar pita bingkai.
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
 * Cara menambah:
 * 1. Simpan file PNG transparan di `public/frames/`.
 * 2. Tambahkan entri di bawah, misalnya:
 *
 *    {
 *      id: 'my-frame',
 *      label: 'My Frame',
 *      description: 'Bingkai buatan sendiri.',
 *      src: '/frames/my-frame.png',
 *      margin: 40
 *    }
 *
 * PNG akan diskalakan mengikuti ukuran kanvas hasil akhir. Bagian
 * transparan tetap transparan sehingga foto di bawahnya terlihat.
 *
 * Sengaja dibiarkan kosong karena tidak ada aset pengguna pada fase ini.
 */
export const CUSTOM_FRAME_REGISTRY = []

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
