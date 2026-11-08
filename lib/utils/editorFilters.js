/**
 * Filter foto Studio Hias.
 *
 * `css` dipakai sebagai `context.filter` di Canvas (hanya saat menggambar
 * foto) dan untuk mini-preview di panel. `overlay` adalah lapisan tint tipis
 * di atas foto untuk mengatur suhu warna secara natural (warm/cool).
 */

export const PHOTO_FILTERS = [
  {
    id: 'original',
    label: 'Original',
    description: 'Warna asli tanpa efek.',
    css: 'none',
    overlay: null
  },
  {
    id: 'bw',
    label: 'Black & White',
    description: 'Monokrom klasik.',
    css: 'grayscale(1) contrast(1.05)',
    overlay: null
  },
  {
    id: 'vintage',
    label: 'Vintage',
    description: 'Sepia hangat dan lembut.',
    css: 'sepia(0.62) saturate(0.88) contrast(1.05) brightness(0.98)',
    overlay: { color: 'rgba(120, 72, 32, 0.14)', blend: 'soft-light' }
  },
  {
    id: 'warm',
    label: 'Warm',
    description: 'Nuansa hangat keemasan.',
    css: 'brightness(1.03) contrast(1.02) saturate(1.08)',
    overlay: { color: 'rgba(255, 168, 82, 0.32)', blend: 'soft-light' }
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Nuansa dingin dan bersih.',
    css: 'brightness(1.03) contrast(1.03) saturate(0.95)',
    overlay: { color: 'rgba(82, 142, 224, 0.34)', blend: 'soft-light' }
  },
  {
    id: 'bright',
    label: 'Bright',
    description: 'Lebih terang dan jernih.',
    css: 'brightness(1.14) contrast(1.03) saturate(1.05)',
    overlay: null
  }
]

export const DEFAULT_FILTER = 'original'

/**
 * Mengembalikan metadata filter aktif.
 * Fallback ke Original agar hasil tidak pernah kosong.
 *
 * @param {string} filterId
 * @returns {(typeof PHOTO_FILTERS)[number]}
 */
export function getFilter(filterId) {
  return (
    PHOTO_FILTERS.find((item) => item.id === filterId) ?? PHOTO_FILTERS[0]
  )
}
