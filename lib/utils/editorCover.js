/**
 * Template cover Studio Hias.
 *
 * Semua cover digambar langsung ke Canvas oleh drawCover(), memakai area
 * di atas susunan foto. Tidak ada gambar eksternal / dependency baru.
 */

export const COVER_TEMPLATES = [
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Bersih, serif, banyak ruang kosong.'
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Retro dengan bingkai ganda dan warna hangat.'
  },
  {
    id: 'cute',
    label: 'Cute',
    description: 'Pastel dengan ornamen playful.'
  },
  {
    id: 'modern',
    label: 'Modern',
    description: 'Kontras gelap dengan tipografi tegas.'
  }
]

export const DEFAULT_COVER = 'minimalist'

/** Tinggi area cover menyesuaikan layout agar komposisi tetap seimbang. */
export function getCoverHeight(layout) {
  return layout === 'grid' ? 148 : 168
}

function roundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  context.beginPath()

  if (typeof context.roundRect === 'function') {
    context.roundRect(x, y, width, height, r)
    return
  }

  context.moveTo(x + r, y)
  context.lineTo(x + width - r, y)
  context.quadraticCurveTo(x + width, y, x + width, y + r)
  context.lineTo(x + width, y + height - r)
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  )
  context.lineTo(x + r, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - r)
  context.lineTo(x, y + r)
  context.quadraticCurveTo(x, y, x + r, y)
  context.closePath()
}

/**
 * Menggambar teks dengan jarak antarhuruf manual, karena letterSpacing
 * Canvas belum didukung merata di semua browser.
 */
function drawTracking(context, text, x, y, tracking, align = 'left') {
  const characters = Array.from(text)
  const widths = characters.map((character) =>
    context.measureText(character).width
  )
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    tracking * Math.max(characters.length - 1, 0)

  let cursor =
    align === 'center' ? x - totalWidth / 2 : align === 'right' ? x - totalWidth : x

  characters.forEach((character, index) => {
    context.fillText(character, cursor, y)
    cursor += widths[index] + tracking
  })

  return totalWidth
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

function drawMinimalist(context, box, { layout, photoCount }) {
  const centered = layout === 'grid'
  const textX = centered ? box.x + box.width / 2 : box.x + 40
  const align = centered ? 'center' : 'left'
  const titleY = box.y + (centered ? 66 : 80)

  context.fillStyle = '#F2EEE7'
  context.fillRect(box.x, box.y, box.width, box.height)

  context.strokeStyle = 'rgba(30, 28, 26, 0.16)'
  context.lineWidth = 1.5
  context.strokeRect(
    box.x + 0.75,
    box.y + 0.75,
    box.width - 1.5,
    box.height - 1.5
  )

  context.fillStyle = '#1E1C1A'
  if (centered) {
    context.fillRect(box.x + box.width / 2 - 22, box.y + 28, 44, 2)
  } else {
    context.fillRect(box.x + 40, box.y + 32, 2, box.height - 64)
  }

  context.textAlign = centered ? 'center' : 'left'
  context.fillStyle = '#1E1C1A'
  context.font = '600 38px Georgia, "Times New Roman", serif'
  context.fillText('Photo Booth', centered ? textX : textX + 22, titleY)

  context.fillStyle = 'rgba(30, 28, 26, 0.55)'
  context.font = '600 10px "Helvetica Neue", Arial, sans-serif'
  drawTracking(
    context,
    'MEMORIES',
    centered ? textX : textX + 22,
    titleY + 24,
    5,
    align
  )

  context.fillStyle = 'rgba(30, 28, 26, 0.38)'
  context.font = '500 9px "Helvetica Neue", Arial, sans-serif'
  drawTracking(
    context,
    `${photoCount} FRAMES · TODAY`,
    centered ? textX : textX + 22,
    box.y + box.height - 24,
    3,
    align
  )
}

function drawVintage(context, box, { layout, photoCount }) {
  const centered = layout === 'grid'
  const textX = centered ? box.x + box.width / 2 : box.x + 48
  const align = centered ? 'center' : 'left'
  const titleY = box.y + (centered ? 72 : 86)

  context.fillStyle = '#EADDC7'
  context.fillRect(box.x, box.y, box.width, box.height)

  context.strokeStyle = 'rgba(122, 90, 68, 0.75)'
  context.lineWidth = 1.5
  context.strokeRect(box.x + 12, box.y + 12, box.width - 24, box.height - 24)

  context.strokeStyle = 'rgba(122, 90, 68, 0.35)'
  context.lineWidth = 1
  context.strokeRect(box.x + 18, box.y + 18, box.width - 36, box.height - 36)

  context.fillStyle = '#8A6A4F'
  const cornerDots = [
    [box.x + 12, box.y + 12],
    [box.x + box.width - 12, box.y + 12],
    [box.x + 12, box.y + box.height - 12],
    [box.x + box.width - 12, box.y + box.height - 12]
  ]
  cornerDots.forEach(([dotX, dotY]) => {
    context.beginPath()
    context.arc(dotX, dotY, 2.5, 0, Math.PI * 2)
    context.fill()
  })

  context.textAlign = centered ? 'center' : 'left'
  context.fillStyle = '#5B3A29'
  context.font = 'italic 600 40px Georgia, "Times New Roman", serif'
  context.fillText('Memories', textX, titleY)

  const lineY = titleY + 14
  context.strokeStyle = 'rgba(122, 90, 68, 0.55)'
  context.lineWidth = 1
  context.beginPath()
  if (centered) {
    context.moveTo(textX - 64, lineY)
    context.lineTo(textX + 64, lineY)
  } else {
    context.moveTo(textX, lineY)
    context.lineTo(textX + 128, lineY)
  }
  context.stroke()

  const diamondX = centered ? textX : textX + 64
  context.save()
  context.translate(diamondX, lineY)
  context.rotate(Math.PI / 4)
  context.fillStyle = '#8A6A4F'
  context.fillRect(-2.5, -2.5, 5, 5)
  context.restore()

  context.fillStyle = 'rgba(91, 58, 41, 0.7)'
  context.font = '600 9px "Helvetica Neue", Arial, sans-serif'
  drawTracking(
    context,
    `PHOTO BOOTH · ${photoCount} SHOTS`,
    textX,
    lineY + 22,
    3,
    align
  )
}

function drawCute(context, box, { layout, photoCount }) {
  const centered = layout === 'grid'
  const textX = centered ? box.x + box.width / 2 : box.x + 46
  const align = centered ? 'center' : 'left'
  const titleY = box.y + (centered ? 74 : 86)

  roundedRect(context, box.x, box.y, box.width, box.height, 18)
  context.fillStyle = '#FCE7EE'
  context.fill()
  context.strokeStyle = '#F2AFC6'
  context.lineWidth = 2
  context.stroke()

  const dots = [
    [0.07, 0.26, '#F6C453', 3.5],
    [0.13, 0.72, '#9AD1C3', 2.5],
    [0.9, 0.3, '#F6C453', 3],
    [0.85, 0.74, '#9AD1C3', 3.5],
    [0.5, 0.14, '#F3B8CB', 2.5]
  ]
  dots.forEach(([fractionX, fractionY, color, radius]) => {
    context.beginPath()
    context.arc(
      box.x + box.width * fractionX,
      box.y + box.height * fractionY,
      radius,
      0,
      Math.PI * 2
    )
    context.fillStyle = color
    context.fill()
  })

  if (centered) {
    drawHeart(context, box.x + 70, box.y + box.height / 2, 14, '#F2AFC6')
    drawHeart(
      context,
      box.x + box.width - 70,
      box.y + box.height / 2,
      14,
      '#F2AFC6'
    )
  } else {
    drawHeart(
      context,
      box.x + box.width - 64,
      box.y + 42,
      16,
      '#F2AFC6'
    )
    drawHeart(
      context,
      box.x + box.width - 96,
      box.y + 66,
      10,
      '#F6C453'
    )
  }

  context.textAlign = centered ? 'center' : 'left'
  context.fillStyle = '#A84666'
  context.font = '700 24px "Trebuchet MS", "Segoe UI", sans-serif'
  context.fillText("TODAY'S MOMENT", textX, titleY)

  context.fillStyle = '#B96C84'
  context.font = 'italic 13px Georgia, "Times New Roman", serif'
  context.fillText(`${photoCount} little memories`, textX, titleY + 24)
}

function drawModern(context, box, { layout, photoCount }) {
  const centered = layout === 'grid'
  const textX = centered ? box.x + box.width / 2 : box.x + 44
  const align = centered ? 'center' : 'left'
  const titleY = box.y + (centered ? 72 : 82)

  context.fillStyle = '#1E1C1A'
  context.fillRect(box.x, box.y, box.width, box.height)

  context.strokeStyle = 'rgba(247, 244, 239, 0.07)'
  context.lineWidth = 1
  for (let index = 1; index < 4; index += 1) {
    const lineY = box.y + (box.height / 4) * index
    context.beginPath()
    context.moveTo(box.x + 16, lineY)
    context.lineTo(box.x + box.width - 16, lineY)
    context.stroke()
  }

  context.save()
  context.font = '200 62px "Helvetica Neue", Arial, sans-serif'
  context.textAlign = 'right'
  context.strokeStyle = 'rgba(247, 244, 239, 0.22)'
  context.lineWidth = 1
  context.strokeText(
    String(photoCount).padStart(2, '0'),
    box.x + box.width - 30,
    box.y + box.height - 22
  )
  context.restore()

  context.fillStyle = '#F7F4EF'
  context.font = '600 28px "Helvetica Neue", Arial, sans-serif'
  drawTracking(context, 'PHOTO BOOTH', textX, titleY, 8, align)

  context.fillStyle = 'rgba(247, 244, 239, 0.5)'
  context.font = '500 9px "Helvetica Neue", Arial, sans-serif'
  drawTracking(
    context,
    "MEMORIES · TODAY'S MOMENT",
    textX,
    titleY + 24,
    3,
    align
  )

  context.fillStyle = '#C7B08E'
  if (centered) {
    context.fillRect(textX - 26, box.y + 26, 52, 2)
  } else {
    context.fillRect(textX, box.y + 30, 52, 2)
  }
}

/**
 * Menggambar cover ke Canvas.
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.width
 * @param {number} options.height
 * @param {'minimalist' | 'vintage' | 'cute' | 'modern'} options.template
 * @param {'strip' | 'grid'} [options.layout='strip']
 * @param {number} [options.photoCount=4]
 */
export function drawCover(context, options) {
  const {
    x,
    y,
    width,
    height,
    template,
    layout = 'strip',
    photoCount = 4
  } = options

  const box = { x, y, width, height }
  const meta = { layout, photoCount }

  context.save()
  context.textBaseline = 'alphabetic'

  switch (template) {
    case 'vintage':
      drawVintage(context, box, meta)
      break
    case 'cute':
      drawCute(context, box, meta)
      break
    case 'modern':
      drawModern(context, box, meta)
      break
    case 'minimalist':
    default:
      drawMinimalist(context, box, meta)
      break
  }

  context.restore()
}
