'use client'

import { useEffect } from 'react'

export default function SettingsDrawer({ open, onClose, children }) {
  // Tutup dengan tombol Escape + kunci scroll body selama drawer terbuka
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Pengaturan sesi">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup pengaturan"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[#F7F4EF] shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <div>
            <h2 className="font-serif text-xl tracking-tight">Pengaturan sesi</h2>
            <p className="mt-0.5 text-[10px] text-black/45">Atur dulu. Jepret sesukamu.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-black/60 transition hover:border-black/40 hover:text-black active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-4">{children}</div>
        </div>

        <div className="border-t border-black/10 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-sm bg-[#1E1C1A] px-6 py-3 text-[11px] font-semibold text-white transition hover:bg-black active:scale-[0.99]"
          >
            Selesai
          </button>
        </div>
      </aside>
    </div>
  )
}
