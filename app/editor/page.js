'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePhotoSession } from '@/lib/context/PhotoSessionContext'
import { usePhotoUrls } from '@/lib/hooks/usePhotoUrls'
import { DEFAULT_COVER } from '@/lib/utils/editorCover'
import { DEFAULT_FILTER } from '@/lib/utils/editorFilters'
import { DEFAULT_FRAME } from '@/lib/utils/editorFrames'
import EditorPreview from '@/components/editor/EditorPreview'
import EditorDownloadButton from '@/components/editor/EditorDownloadButton'
import PhotoList from '@/components/editor/PhotoList'
import EditorTabs from '@/components/editor/EditorTabs'
import EditorSettingsPanel from '@/components/editor/EditorSettingsPanel'

const NUMBER_WORDS = {
  3: 'tiga',
  4: 'empat'
}

function CameraMark() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

function EmptyState() {
  return (
    <section className="flex flex-col items-center py-16 text-center sm:py-24">
      <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
        Studio Hias
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        Belum ada foto untuk diedit.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-black/50">
        Selesaikan sesi foto terlebih dahulu. Setelah semua slot terisi, kamu
        bisa masuk ke Studio Hias dari halaman Review.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/camera"
          className="inline-flex items-center gap-2 bg-[#1E1C1A] px-5 py-3 text-[11px] font-semibold text-white transition hover:bg-black"
        >
          Mulai Sesi Foto
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-black/15 bg-white/40 px-5 py-3 text-[11px] font-semibold transition hover:border-black/40 hover:bg-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </section>
  )
}

export default function EditorPage() {
  const { photos } = usePhotoSession()
  const [activeTab, setActiveTab] = useState('layout')
  const [layout, setLayout] = useState('strip')
  const [cover, setCover] = useState(DEFAULT_COVER)
  const [photoFilter, setPhotoFilter] = useState(DEFAULT_FILTER)
  const [frame, setFrame] = useState(DEFAULT_FRAME)
  const urls = usePhotoUrls(photos)

  const hasPhotos = photos.length > 0
  const total = photos.length
  const numberWord = NUMBER_WORDS[total] ?? total

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A]">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-black/10 py-5">
          <Link href="/" className="flex min-w-0 items-center gap-2">
            <CameraMark />
            <span className="truncate font-serif text-lg tracking-tight">
              Photo Booth
            </span>
            <span className="hidden font-serif text-lg italic text-black/50 sm:inline">
              di browser
            </span>
          </Link>

          <Link
            href="/review"
            className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/50 transition hover:text-black"
          >
            ← Review Foto
          </Link>
        </header>

        {!hasPhotos ? (
          <EmptyState />
        ) : (
          <>
            {/* Title */}
            <section className="pb-6 pt-8 sm:pt-10">
              <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
                Studio Hias.
              </h1>
              <p className="mt-2 text-sm text-black/50">
                Susun dan percantik {numberWord} fotomu, lalu simpan jadi satu
                strip kenangan.
              </p>
            </section>

            {/* Meta row */}
            <div className="mb-4 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em]">
              <span className="inline-flex items-center gap-2 text-black/60">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-black/60"
                  aria-hidden="true"
                />
                <span className="font-semibold text-black">
                  {total} Foto Siap Dihias
                </span>
              </span>
              <span className="text-black/35">
                {layout === 'grid' ? 'Grid 2 kolom' : 'Strip 1 kolom'}
              </span>
            </div>

            <div className="grid items-start gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_150px_300px] xl:grid-cols-[minmax(0,1fr)_160px_320px]">
              {/* Preview */}
              <div className="lg:order-1">
                <EditorPreview
                  urls={urls}
                  layout={layout}
                  cover={cover}
                  photoFilter={photoFilter}
                  frame={frame}
                />

                <div className="mt-4">
                  <EditorDownloadButton
                    urls={urls}
                    layout={layout}
                    cover={cover}
                    photoFilter={photoFilter}
                    frame={frame}
                  />
                </div>
              </div>

              {/* Daftar foto */}
              <div className="lg:order-2">
                <PhotoList photos={photos} urls={urls} />
              </div>

              {/* Panel pengaturan (tabs + konten) */}
              <div className="lg:order-3">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="font-semibold">Pengaturan</span>
                  <span className="text-black/35">Tahap 01</span>
                </div>

                <EditorTabs activeTab={activeTab} onChange={setActiveTab} />
                <div className="mt-4">
                  <EditorSettingsPanel
                    activeTab={activeTab}
                    layout={layout}
                    onLayoutChange={setLayout}
                    photoCount={total}
                    cover={cover}
                    onCoverChange={setCover}
                    photoFilter={photoFilter}
                    onFilterChange={setPhotoFilter}
                    frame={frame}
                    onFrameChange={setFrame}
                    previewUrl={urls[0] ?? null}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-5 text-[10px] text-black/35">
              <span>
                Foto tersimpan sementara di browser. Unduh hasilnya sebelum
                menutup halaman.
              </span>
              <span className="font-serif text-sm italic text-black/45">
                Momen kecil juga layak diingatkan.
              </span>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
