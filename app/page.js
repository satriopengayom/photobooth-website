'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  const router = useRouter()

  const handleStartSession = () => {
    router.push('/camera')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                ✨ Tanpa Install Aplikasi
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Photo Booth
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                di Browser
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Ambil foto dengan mudah langsung dari browser Anda
            </p>
            
            <p className="text-base md:text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Tidak perlu aplikasi khusus. Cukup gunakan kamera laptop atau HP Anda untuk mengambil foto bergaya photo booth profesional.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                onClick={handleStartSession}
                className="text-lg px-10 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 w-full md:w-auto"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Mulai Sesi Foto
                </span>
              </Button>
              
              <button 
                onClick={() => {
                  const target = document.getElementById('features')
                  if (target) {
                    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
                  }
                }}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors py-3 px-4 w-full md:w-auto"
              >
                Lihat Fitur →
              </button>
            </div>

            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Kamera akan diminta izin setelah Anda memulai sesi
            </p>
          </div>

          {/* Features Section */}
          <div id="features" className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Ambil 3-4 Foto</h3>
              <p className="text-gray-600 leading-relaxed">
                Pilih untuk mengambil 3 atau 4 foto dalam satu sesi. Atur countdown dan mode pengambilan sesuai keinginan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mode Gesture</h3>
              <p className="text-gray-600 leading-relaxed">
                Gunakan gesture tangan (Peace ✌️ atau Open Palm ✋) untuk memicu pengambilan foto secara otomatis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Edit & Download</h3>
              <p className="text-gray-600 leading-relaxed">
                Tinjau hasil foto, ulangi foto tertentu, tambahkan filter dan bingkai, lalu download sebagai satu gambar.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Cara Menggunakan</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  <span aria-hidden="true">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Mulai Sesi</h4>
                <p className="text-sm text-gray-600">Klik tombol "Mulai Sesi Foto" dan izinkan akses kamera</p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  <span aria-hidden="true">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Atur Preferensi</h4>
                <p className="text-sm text-gray-600">Pilih jumlah foto, countdown, dan mode pengambilan</p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  <span aria-hidden="true">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Ambil Foto</h4>
                <p className="text-sm text-gray-600">Ambil 3-4 foto, tinjau hasil, dan ulangi jika perlu</p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  <span aria-hidden="true">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Edit & Simpan</h4>
                <p className="text-sm text-gray-600">Tambahkan filter dan bingkai, lalu download hasilnya</p>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Catatan Penting</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Data foto Anda tersimpan sementara di browser dan akan hilang saat halaman ditutup atau di-refresh. 
                  Pastikan untuk mengunduh hasil foto sebelum meninggalkan halaman.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2026 Photo Booth. Website photo booth berbasis web yang mudah digunakan.</p>
            <p className="mt-2">Kompatibel dengan browser modern: Chrome, Firefox, Safari, Edge</p>
          </div>
        </div>
      </div>
    </div>
  )
}
