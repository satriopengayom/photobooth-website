'use client'

import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const handleStartSession = () => {
    router.push('/camera')
  }

  const handleSeeFeatures = () => {
    const target = document.getElementById('features')
    if (target) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1A1A1A]">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 py-5">
          <div className="flex items-center gap-2">
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
            <span className="font-serif text-lg tracking-tight">Photo Booth</span>
            <span className="font-serif text-lg italic text-black/50">di browser</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-black/55">
            <button
              type="button"
              onClick={handleSeeFeatures}
              className="underline decoration-black/25 underline-offset-4 transition hover:text-black"
            >
              Cara pakai
            </button>
            <span className="h-1 w-1 rounded-full bg-black/30" aria-hidden="true" />
            <span>Laptop atau ponsel. Tanpa instalasi.</span>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-2xl py-16 text-center sm:py-24">
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight sm:text-7xl">
            Photo Booth
            <br />
            di Browser
          </h1>

          <p className="mt-8 text-sm text-black/60 sm:text-base">
            Ambil foto dengan mudah langsung dari browser Anda.
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-black/45">
            Tidak perlu aplikasi khusus. Cukup gunakan kamera laptop atau HP Anda untuk
            mengambil foto bergaya photo booth profesional.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleStartSession}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-sm bg-[#1E1C1A] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-black sm:w-auto"
            >
              Mulai Sesi Foto
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

            <button
              type="button"
              onClick={handleSeeFeatures}
              className="inline-flex w-full items-center justify-center gap-3 rounded-sm border border-black/20 bg-white px-6 py-3.5 text-xs font-semibold text-black/80 transition hover:border-black/40 hover:text-black sm:w-auto"
            >
              Lihat Fitur
              <svg
                className="h-3.5 w-3.5"
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

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-black/45">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Kamera akan diminta izin setelah Anda memulai sesi.
          </p>

          <p className="mt-7 text-[10px] uppercase tracking-[0.18em] text-black/40">
            3 atau 4 foto &nbsp;·&nbsp; Filter &amp; bingkai &nbsp;·&nbsp; Satu strip, banyak cerita
          </p>
        </section>

        <hr className="border-black/10" />

        {/* Features */}
        <section id="features" className="scroll-mt-8 py-12">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
              Semua yang kamu butuhkan.
            </h2>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-black/35">
              Fitur Unggulan
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-sm bg-[#EDE7DE] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[#1E1C1A]">
                <svg
                  className="h-5 w-5 text-white"
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
              </div>
              <h3 className="mb-2 text-sm font-semibold">Ambil 3-4 Foto</h3>
              <p className="text-xs leading-relaxed text-black/55">
                Pilih untuk mengambil 3 atau 4 foto dalam satu sesi. Atur countdown dan mode
                pengambilan sesuai keinginan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-sm bg-[#EDE7DE] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[#1E1C1A]">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Mode Gesture</h3>
              <p className="text-xs leading-relaxed text-black/55">
                Gunakan gesture tangan (Peace ✌️ atau Open Palm ✋) untuk memicu pengambilan
                foto secara otomatis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-sm bg-[#EDE7DE] p-6">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-[#1E1C1A]">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Edit &amp; Download</h3>
              <p className="text-xs leading-relaxed text-black/55">
                Tinjau hasil foto, ulangi foto tertentu, tambahkan filter dan bingkai, lalu
                download sebagai satu gambar.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-black/10" />

        {/* How it works */}
        <section className="py-12">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">Cara Menggunakan.</h2>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-black/35">
              Empat Langkah Sederhana
            </span>
          </div>

          <div className="grid gap-8 sm:grid-cols-4 sm:gap-5">
            <div>
              <p className="mb-2 font-serif text-sm italic text-black/40">01</p>
              <h3 className="mb-1.5 text-sm font-semibold">Mulai Sesi</h3>
              <p className="text-xs leading-relaxed text-black/50">
                Klik tombol &quot;Mulai Sesi Foto&quot; dan izinkan akses kamera.
              </p>
            </div>

            <div>
              <p className="mb-2 font-serif text-sm italic text-black/40">02</p>
              <h3 className="mb-1.5 text-sm font-semibold">Atur Preferensi</h3>
              <p className="text-xs leading-relaxed text-black/50">
                Pilih jumlah foto, countdown, dan mode pengambilan.
              </p>
            </div>

            <div>
              <p className="mb-2 font-serif text-sm italic text-black/40">03</p>
              <h3 className="mb-1.5 text-sm font-semibold">Ambil Foto</h3>
              <p className="text-xs leading-relaxed text-black/50">
                Ambil 3-4 foto, tinjau hasil, dan ulangi jika perlu.
              </p>
            </div>

            <div>
              <p className="mb-2 font-serif text-sm italic text-black/40">04</p>
              <h3 className="mb-1.5 text-sm font-semibold">Edit &amp; Simpan</h3>
              <p className="text-xs leading-relaxed text-black/50">
                Tambahkan filter dan bingkai, lalu download hasilnya.
              </p>
            </div>
          </div>
        </section>

        {/* Note */}
        <div className="mb-12 flex items-start gap-4 rounded-sm bg-[#EDE7DE] p-5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/20">
            <svg
              className="h-3.5 w-3.5 text-black/50"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div>
            <h4 className="mb-1 text-xs font-semibold">Catatan Penting</h4>
            <p className="text-[11px] leading-relaxed text-black/50">
              Data foto Anda tersimpan sementara di browser dan akan hilang saat halaman ditutup
              atau di-refresh. Pastikan untuk mengunduh hasil foto sebelum meninggalkan halaman.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 py-5 text-[10px] uppercase tracking-[0.2em] text-black/35">
          <span>Photo Booth / di Browser</span>
          <span className="font-serif text-sm normal-case italic tracking-normal text-black/45">
            Momen kecil juga layak diingatkan.
          </span>
        </footer>
      </div>
    </div>
  )
}
