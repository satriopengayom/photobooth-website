'use client'

import { COVER_TEMPLATES, DEFAULT_COVER } from '@/lib/utils/editorCover'
import {
  DEFAULT_FILTER,
  PHOTO_FILTERS,
  getFilter
} from '@/lib/utils/editorFilters'
import {
  DEFAULT_FRAME,
  getFrameOptionsForLayout,
  getFramePreviewSrc,
  isFrameCoverEnabled
} from '@/lib/utils/editorFrames'
import PhotoList from './PhotoList'

const LAYOUT_OPTIONS = [
  {
    id: 'strip',
    label: 'Strip 1 kolom'
  },
  {
    id: 'grid',
    label: 'Grid 2 kolom'
  }
]

function getLayoutHint(layoutId, photoCount) {
  if (layoutId === 'grid') {
    if (photoCount === 3) return '2 foto di atas, 1 di tengah'
    if (photoCount === 4) return 'Susunan 2×2'
    return '2 kolom per baris'
  }

  return photoCount > 0
    ? `${photoCount} foto tersusun vertikal`
    : 'Foto tersusun vertikal'
}

const TAB_META = {
  layout: {
    title: 'Susun komposisi foto',
    description:
      'Pilih susunan foto pada hasil akhir. Preview langsung berubah tanpa tombol Apply.'
  },
  cover: {
    title: 'Pilih desain cover',
    description:
      'Cover tampil di atas susunan foto. Pilih template, preview langsung berubah tanpa tombol Apply.'
  },
  filter: {
    title: 'Filter warna',
    description:
      'Filter diterapkan ke seluruh foto saja — cover dan teks tetap bersih. Preview langsung berubah tanpa tombol Apply.'
  },
  bingkai: {
    title: 'Bingkai foto',
    description:
      'Bingkai tampil paling atas mengikuti ukuran komposisi. Pilih desain, preview langsung berubah tanpa tombol Apply.'
  }
}

function ActiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-emerald-700">
      <span className="h-1 w-1 rounded-full bg-emerald-600" aria-hidden="true" />
      Aktif
    </span>
  )
}

function buildGridRows(count) {
  const rows = []

  for (let index = 0; index < count; index += 2) {
    rows.push(Math.min(2, count - index))
  }

  return rows
}

function LayoutGlyph({ variant, active, count = 3 }) {
  const bar = active ? 'bg-black/70' : 'bg-black/25'
  const total = count > 0 ? count : 3

  return (
    <div className="flex h-16 w-full items-stretch border border-black/10 bg-white/50 p-2">
      {variant === 'grid' ? (
        <div className="flex h-full w-full flex-col gap-1">
          {buildGridRows(total).map((cellCount, rowIndex) => (
            <div
              key={rowIndex}
              className="flex min-h-0 flex-1 justify-center gap-1"
            >
              {Array.from({ length: cellCount }).map((_, cellIndex) => (
                <span
                  key={cellIndex}
                  className={`h-full ${
                    cellCount === 1
                      ? 'w-[calc(50%-0.125rem)]'
                      : 'flex-1'
                  } ${bar}`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-1">
          {Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={`min-h-0 w-full flex-1 ${bar}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function LayoutOptions({ layout, onLayoutChange, photoCount }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {LAYOUT_OPTIONS.map((option) => {
        const isActive = layout === option.id

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onLayoutChange(option.id)}
            aria-pressed={isActive}
            className={`relative flex flex-col border p-2.5 text-left transition ${
              isActive
                ? 'border-black bg-white'
                : 'border-black/10 bg-white/30 hover:border-black/30 hover:bg-white/60'
            }`}
          >
            <LayoutGlyph
              variant={option.id}
              active={isActive}
              count={photoCount}
            />

            <span className="mt-2.5 flex items-center justify-between gap-1">
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-black' : 'text-black/60'
                }`}
              >
                {option.label}
              </span>
              {isActive && <ActiveBadge />}
            </span>
            <span className="mt-0.5 text-[9px] leading-relaxed text-black/35">
              {getLayoutHint(option.id, photoCount)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function CoverGlyph({ template, photoCount = 4 }) {
  if (template === 'vintage') {
    return (
      <div className="flex h-16 w-full items-center justify-center border border-[#8A6A4F]/50 bg-[#EADDC7] p-1">
        <div className="flex h-full w-full flex-col items-center justify-center border border-[#8A6A4F]/60">
          <span className="font-serif text-[10px] italic text-[#5B3A29]">
            Memories
          </span>
          <span className="mt-0.5 text-[5px] tracking-[0.16em] text-[#7A5A44]">
            PHOTO BOOTH
          </span>
        </div>
      </div>
    )
  }

  if (template === 'cute') {
    return (
      <div className="relative flex h-16 w-full flex-col items-center justify-center overflow-hidden rounded-md border border-[#F2AFC6] bg-[#FCE7EE]">
        <span className="text-[7px] font-bold text-[#A84666]">
          TODAY&apos;S MOMENT
        </span>
        <span className="mt-0.5 text-[5px] text-[#B96C84]">
          {photoCount} little memories
        </span>
        <span className="absolute left-1.5 top-1.5 h-1 w-1 rounded-full bg-[#F6C453]" />
        <span className="absolute right-1.5 top-2 h-1 w-1 rounded-full bg-[#9AD1C3]" />
        <span className="absolute bottom-1.5 right-2 h-1 w-1 rounded-full bg-[#F6C453]" />
      </div>
    )
  }

  if (template === 'modern') {
    return (
      <div className="relative flex h-16 w-full flex-col justify-center overflow-hidden bg-[#1E1C1A] px-2">
        <span className="text-[7px] font-semibold tracking-[0.2em] text-[#F7F4EF]">
          PHOTO BOOTH
        </span>
        <span className="mt-0.5 text-[5px] tracking-[0.14em] text-white/50">
          MEMORIES · TODAY
        </span>
        <span className="absolute bottom-0.5 right-1.5 text-[20px] font-light leading-none text-white/15">
          {String(photoCount).padStart(2, '0')}
        </span>
      </div>
    )
  }

  return (
    <div className="relative flex h-16 w-full flex-col justify-center border border-black/15 bg-[#F2EEE7] px-2 pl-3">
      <span className="absolute left-2 top-2 h-[calc(100%-1rem)] w-px bg-black/25" />
      <span className="font-serif text-[10px] font-semibold text-[#1E1C1A]">
        Photo Booth
      </span>
      <span className="mt-0.5 text-[5px] tracking-[0.18em] text-black/45">
        MEMORIES
      </span>
    </div>
  )
}

function CoverOptions({ cover, onCoverChange, photoCount }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {COVER_TEMPLATES.map((template) => {
        const isActive = cover === template.id

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onCoverChange(template.id)}
            aria-pressed={isActive}
            className={`flex flex-col border p-2.5 text-left transition ${
              isActive
                ? 'border-black bg-white'
                : 'border-black/10 bg-white/30 hover:border-black/30 hover:bg-white/60'
            }`}
          >
            <CoverGlyph template={template.id} photoCount={photoCount} />

            <span className="mt-2.5 flex items-center justify-between gap-1">
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? 'text-black' : 'text-black/60'
                }`}
              >
                {template.label}
              </span>
              {isActive && <ActiveBadge />}
            </span>
            <span className="mt-0.5 text-[9px] leading-relaxed text-black/35">
              {template.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FilterOptions({ photoFilter, onFilterChange, previewUrl }) {
  const activeFilter = getFilter(photoFilter)

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2 border border-black/10 bg-white/50 px-3 py-2">
        <span className="text-[9px] uppercase tracking-[0.14em] text-black/40">
          Filter aktif
        </span>
        <span className="text-[10px] font-semibold">
          {activeFilter.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PHOTO_FILTERS.map((filter) => {
          const isActive = filter.id === photoFilter

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange(filter.id)}
              aria-pressed={isActive}
              className={`border p-1.5 text-left transition ${
                isActive
                  ? 'border-black bg-white'
                  : 'border-black/10 bg-white/30 hover:border-black/30 hover:bg-white/60'
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden border border-black/10 bg-[#E7E1D8]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: filter.css }}
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      filter: filter.css,
                      background:
                        'linear-gradient(135deg, #F0C9A0 0%, #DDA0A0 45%, #8FB4CE 100%)'
                    }}
                  />
                )}

                {filter.overlay && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      backgroundColor: filter.overlay.color,
                      mixBlendMode: filter.overlay.blend || 'soft-light'
                    }}
                  />
                )}
              </div>

              <span className="mt-1.5 flex items-center justify-between gap-1">
                <span
                  className={`text-[9px] font-semibold ${
                    isActive ? 'text-black' : 'text-black/60'
                  }`}
                >
                  {filter.label}
                </span>
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-600"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-black/40">
        <svg
          className="h-3 w-3 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Preview berubah otomatis saat filter dipilih.
      </p>
    </>
  )
}

const FRAME_GLYPH_STYLES = {
  none: {
    band: 'border border-black/10 bg-white',
    matte: 'm-2 border border-dashed border-black/20 bg-[#E7E1D8]'
  },
  'classic-white': {
    band: 'border border-black/15 bg-[#FCFAF6]',
    matte: 'm-2.5 border border-black/45 bg-[#E7E1D8]'
  },
  vintage: {
    band: 'border border-[#8A6A4F]/40 bg-[#EADDC7]',
    matte: 'm-2.5 border border-[#8A6A4F]/70 bg-[#E7E1D8]'
  },
  cute: {
    band: 'border border-[#F2AFC6] bg-[#FCE7EE]',
    matte: 'm-2.5 border border-dashed border-[#F2AFC6] bg-[#F4E7EC]'
  },
  'elegant-black': {
    band: 'border border-black bg-[#1E1C1A]',
    matte: 'm-2.5 border border-[#C7B08E]/80 bg-[#E7E1D8]'
  }
}

function FrameGlyph({ frameId, src }) {
  if (src) {
    return (
      <div className="flex h-16 w-full items-center justify-center border border-black/10 bg-white/50 p-1">
        <img src={src} alt="" className="h-full w-full object-contain" />
      </div>
    )
  }

  const style = FRAME_GLYPH_STYLES[frameId] ?? FRAME_GLYPH_STYLES.none

  return (
    <div className={`relative h-16 w-full overflow-hidden ${style.band}`}>
      <div className={`absolute inset-0 ${style.matte}`} />

      {frameId === 'classic-white' && (
        <>
          <span className="absolute left-1 top-1 h-2 w-2 border-l border-t border-black/60" />
          <span className="absolute right-1 top-1 h-2 w-2 border-r border-t border-black/60" />
          <span className="absolute bottom-1 left-1 h-2 w-2 border-b border-l border-black/60" />
          <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-black/60" />
        </>
      )}

      {frameId === 'vintage' && (
        <>
          <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rotate-45 bg-[#8A6A4F]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rotate-45 bg-[#8A6A4F]" />
          <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rotate-45 bg-[#8A6A4F]" />
          <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rotate-45 bg-[#8A6A4F]" />
        </>
      )}

      {frameId === 'cute' && (
        <>
          <span className="absolute left-1 top-0.5 text-[7px] leading-none text-[#F2AFC6]">
            ♥
          </span>
          <span className="absolute right-1 top-0.5 text-[7px] leading-none text-[#F6C453]">
            ♥
          </span>
          <span className="absolute bottom-0.5 left-1 text-[7px] leading-none text-[#F6C453]">
            ♥
          </span>
          <span className="absolute bottom-0.5 right-1 text-[7px] leading-none text-[#F2AFC6]">
            ♥
          </span>
        </>
      )}

      {frameId === 'elegant-black' && (
        <>
          <span className="absolute inset-[3px] border border-white/15" />
          <span className="absolute left-1 top-1 h-2 w-2 border-l border-t border-[#C7B08E]" />
          <span className="absolute right-1 top-1 h-2 w-2 border-r border-t border-[#C7B08E]" />
          <span className="absolute bottom-1 left-1 h-2 w-2 border-b border-l border-[#C7B08E]" />
          <span className="absolute bottom-1 right-1 h-2 w-2 border-b border-r border-[#C7B08E]" />
        </>
      )}
    </div>
  )
}

function FrameOptions({ frame, onFrameChange, layout = 'strip', photoCount = 0 }) {
  // Hanya bingkai yang kompatibel dengan layout + jumlah foto aktif yang
  // dirender. Bingkai Strip tidak muncul sama sekali saat Layout Grid aktif.
  const options = getFrameOptionsForLayout(layout, photoCount)

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isActive = frame === option.id
          const previewSrc = getFramePreviewSrc(option.id, photoCount)

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onFrameChange(option.id)}
              aria-pressed={isActive}
              className={`flex flex-col border p-2.5 text-left transition ${
                isActive
                  ? 'border-black bg-white'
                  : 'border-black/10 bg-white/30 hover:border-black/30 hover:bg-white/60'
              }`}
            >
              <FrameGlyph frameId={option.id} src={previewSrc} />

              <span className="mt-2.5 flex items-center justify-between gap-1">
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? 'text-black' : 'text-black/60'
                  }`}
                >
                  {option.label}
                </span>
                {isActive && <ActiveBadge />}
              </span>
              <span className="mt-0.5 text-[9px] leading-relaxed text-black/35">
                {option.description}
              </span>
              {option.variants && photoCount > 0 && (
                <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-700/80">
                  Aset {photoCount} foto otomatis
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-black/40">
        <svg
          className="h-3 w-3 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Preview berubah otomatis saat bingkai dipilih.
      </p>
    </>
  )
}

/**
 * Panel pengaturan editor.
 *
 * Tab Layout, Cover, Filter, dan Bingkai sudah aktif dan mengubah preview
 * secara langsung.
 *
 * @param {Object} props
 * @param {string} props.activeTab
 * @param {'strip' | 'grid'} [props.layout='strip']
 * @param {(layoutId: string) => void} [props.onLayoutChange]
 * @param {number} [props.photoCount=0]
 * @param {string} [props.cover=DEFAULT_COVER]
 * @param {(coverId: string) => void} [props.onCoverChange]
 * @param {string} [props.photoFilter=DEFAULT_FILTER]
 * @param {(filterId: string) => void} [props.onFilterChange]
 * @param {string} [props.frame=DEFAULT_FRAME]
 * @param {(frameId: string) => void} [props.onFrameChange]
 * @param {string | null} [props.previewUrl]
 * @param {Array<{ slot: number, blob: Blob | null }>} [props.photos]
 * @param {Array<string | null>} [props.photoUrls]
 * @param {number[]} [props.photoOrder]
 * @param {(position: number, direction: -1 | 1) => void} [props.onMovePhoto]
 */
export default function EditorSettingsPanel({
  activeTab,
  layout = 'strip',
  onLayoutChange = () => {},
  photoCount = 0,
  cover = DEFAULT_COVER,
  onCoverChange = () => {},
  photoFilter = DEFAULT_FILTER,
  onFilterChange = () => {},
  frame = DEFAULT_FRAME,
  onFrameChange = () => {},
  previewUrl = null,
  photos = [],
  photoUrls = [],
  photoOrder = [],
  onMovePhoto = () => {}
}) {
  const meta = TAB_META[activeTab] ?? TAB_META.layout

  return (
    <div
      className="bg-[#EFEAE3] p-5"
      role="tabpanel"
      id={`editor-panel-${activeTab}`}
      aria-labelledby={`editor-tab-${activeTab}`}
    >
      <p className="text-[9px] uppercase tracking-[0.18em] text-black/40">
        Tab / {activeTab}
      </p>
      <h2 className="mt-2 font-serif text-xl leading-snug">{meta.title}</h2>
      <p className="mt-2 text-[11px] leading-relaxed text-black/50">
        {meta.description}
      </p>

      <div className="mt-4 border-t border-black/10 pt-4">
        {activeTab === 'layout' ? (
          <>
            <LayoutOptions
              layout={layout}
              onLayoutChange={onLayoutChange}
              photoCount={photoCount}
            />

            <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-black/40">
              <svg
                className="h-3 w-3 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Preview berubah otomatis saat layout dipilih.
            </p>

            <div className="mt-5 border-t border-black/10 pt-4">
              <PhotoList
                photos={photos}
                urls={photoUrls}
                order={photoOrder}
                onMove={onMovePhoto}
              />
            </div>
          </>
        ) : activeTab === 'cover' ? (
          <>
            <CoverOptions
              cover={cover}
              onCoverChange={onCoverChange}
              photoCount={photoCount}
            />

            {!isFrameCoverEnabled(frame) && (
              <p className="mt-3 border border-amber-700/20 bg-amber-50 px-3 py-2 text-[10px] leading-relaxed text-amber-800">
                Bingkai aktif tidak memiliki area cover. Cover tetap tersimpan
                sebagai pengaturan, tetapi tidak ditampilkan pada bingkai ini.
              </p>
            )}

            <p className="mt-4 inline-flex items-center gap-1.5 text-[10px] text-black/40">
              <svg
                className="h-3 w-3 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Preview berubah otomatis saat cover dipilih.
            </p>
          </>
        ) : activeTab === 'filter' ? (
          <FilterOptions
            photoFilter={photoFilter}
            onFilterChange={onFilterChange}
            previewUrl={previewUrl}
          />
        ) : (
          <FrameOptions
            frame={frame}
            onFrameChange={onFrameChange}
            layout={layout}
            photoCount={photoCount}
          />
        )}
      </div>
    </div>
  )
}
