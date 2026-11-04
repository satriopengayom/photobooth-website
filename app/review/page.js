'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePhotoSession } from '@/lib/context/PhotoSessionContext'

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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CheckIcon({ className = 'h-3 w-3' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function RetakeIcon({ className = 'h-3 w-3' }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4m0-7h.01" />
    </svg>
  )
}

/**
 * Menampilkan satu foto dari Blob lewat object URL.
 * URL dibuat sekali per Blob dan di-revoke saat komponen dilepas.
 */
function PhotoPreview({ blob, alt }) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  if (!url) return null

  return <img src={url} alt={alt} className="h-full w-full object-contain" />
}

export default function ReviewPage() {
  const router = useRouter()
  const { photos, isSessionComplete, setRetakeSlot, resetSession } = usePhotoSession()

  // Redirect di effect (bukan saat render) agar tidak error saat prerender.
  useEffect(() => {
    if (photos.length === 0) {
      router.push('/camera')
    }
  }, [photos.length, router])

  if (photos.length === 0) {
    return null
  }

  const total = photos.length
  const numberWord = NUMBER_WORDS[total] ?? total
  const isOdd = total === 3
  const complete = isSessionComplete()

  const handleRetake = (slotIndex) => {
    setRetakeSlot(slotIndex)
    router.push('/camera')
  }

  const handleContinueToEditor = () => {
    router.push('/editor')
  }

  const handleStartOver = () => {
    if (confirm('Yakin ingin mengulang dari awal? Semua foto akan dihapus.')) {
      resetSession()
      router.push('/camera')
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A]">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-black/10 py-5">
          <div className="flex min-w-0 items-center gap-2">
            <CameraMark />
            <span className="truncate font-serif text-lg tracking-tight">Photo Booth</span>
            <span className="hidden font-serif text-lg italic text-black/50 sm:inline">
              di browser
            </span>
          </div>
        </header>

        {/* Title */}
        <section className="pb-6 pt-8 sm:pt-10">
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            Review Hasil Fotomu
          </h1>
          <p className="mt-2 text-sm text-black/50">
            Cek {numberWord} fotomu sebelum masuk ke Studio Hias. Pose belum pas? Ulangi foto itu
            saja.
          </p>
        </section>

        {/* Meta row */}
        <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.18em]">
          <span className="inline-flex items-center gap-2 text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black/60" aria-hidden="true" />
            <span className="font-semibold text-black">{total} Foto Diambil</span>
          </span>
          <span className="text-black/35">Satu sesi, {numberWord} cerita.</span>
        </div>

        <div className="grid items-start gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Photo grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {photos.map((photo, index) => {
              const isLastOdd = isOdd && index === 2

              return (
                <div
                  key={index}
                  className={isLastOdd ? 'sm:col-span-2 sm:w-[calc(50%-0.75rem)] sm:justify-self-center' : ''}
                >
                  <div className="mb-2 text-[10px] uppercase tracking-[0.16em]">
                    <span className="font-semibold">Foto #{String(index + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="aspect-video w-full overflow-hidden border border-black/10 bg-[#E7E1D8]">
                    {photo.blob ? (
                      <PhotoPreview blob={photo.blob} alt={`Foto ${index + 1}`} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-black/35">
                        Foto belum diambil
                      </div>
                    )}
                  </div>

                  {photo.blob && (
                    <button
                      type="button"
                      onClick={() => handleRetake(index)}
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 border border-black/15 px-4 py-2 text-[10px] font-semibold transition hover:border-black/40 hover:bg-black/5"
                    >
                      <RetakeIcon />
                      Ulangi Foto Ini
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-6">
            <div className="bg-[#EFEAE3] p-5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-black/40">
                Selanjutnya / Studio Hias
              </p>
              <h2 className="mt-3 font-serif text-2xl leading-snug">
                Sudah dengan pose pilihanmu?
              </h2>
              <p className="mt-3 text-[11px] leading-relaxed text-black/50">
                Bawa {numberWord} foto ini ke Studio Hias. Tambahkan filter dan bingkai, lalu simpan
                jadi satu strip kenangan.
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-black/10 pt-4 text-[10px] text-black/55">
                <CheckIcon className="h-3 w-3 text-emerald-600" />
                {total} foto siap untuk dihias
              </div>

              <button
                type="button"
                onClick={handleContinueToEditor}
                disabled={!complete}
                className="group mt-4 inline-flex w-full items-center justify-between gap-2 bg-[#1E1C1A] px-4 py-3 text-[11px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Lanjut ke Studio Hias
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              onClick={handleStartOver}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 border border-black/15 bg-white/40 px-4 py-2.5 text-[10px] font-semibold transition hover:border-black/40 hover:bg-white"
            >
              <RetakeIcon />
              Ulangi Semua (Reset)
            </button>
            <p className="mt-2 text-center text-[9px] leading-relaxed text-black/35">
              Menghapus {numberWord} foto dan memulai sesi baru.
            </p>

            <div className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-black/40">
              <InfoIcon />
              <p>
                Cukup satu pose yang ingin diganti? Pilih &quot;Ulangi Foto Ini&quot; di bawah
                fotonya. Foto lainnya tetap tersimpan.
              </p>
            </div>

            {!complete && (
              <p className="mt-4 border-t border-black/10 pt-4 text-[10px] text-black/40">
                Selesaikan semua foto untuk melanjutkan ke Studio Hias.
              </p>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-5 text-[10px] text-black/35">
          <span>
            Foto tersimpan sementara di browser. Unduh hasilnya sebelum menutup halaman.
          </span>
          <span className="font-serif text-sm italic text-black/45">
            Momen kecil juga layak diingatkan.
          </span>
        </footer>
      </div>
    </div>
  )
}
