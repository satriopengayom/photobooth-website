# Website Photo Booth

Website Photo Booth berbasis web yang memungkinkan pengguna mengambil beberapa foto menggunakan kamera perangkat, melihat dan mengulang foto tertentu, mengedit hasil foto, kemudian mengunduh seluruh hasilnya sebagai satu gambar gabungan.

## Status Development

**FASE 1 SELESAI** ✓

- [x] Project initialization
- [x] Context & State Management
- [x] Landing Page
- [ ] Camera System (Fase 2)
- [ ] Review & Retake (Fase 3)
- [ ] Photo Editor (Fase 4)
- [ ] Polish & Finalization (Fase 5)

## Tech Stack

- **Next.js 16.4.3** (App Router, JavaScript)
- **React 19.3.0**
- **Tailwind CSS 4**
- **MediaPipe Tasks Vision** (untuk gesture detection - akan digunakan di Fase 2)
- **Camera API** (getUserMedia)
- **Canvas API** (untuk rendering foto)

## Setup & Installation

### Prerequisites
- Node.js 18+ atau 20+
- Browser modern dengan support Camera API (Chrome, Firefox, Edge, Safari)
- HTTPS atau localhost (Camera API requirement)

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Website akan berjalan di [http://localhost:3000](http://localhost:3000)

### Build Production
```bash
npm run build
npm run start
```

## Folder Structure

```
/photobooth
├── /app                      # Next.js App Router pages
│   ├── layout.js            # Root layout dengan PhotoSessionProvider
│   ├── page.js              # Landing Page ✓
│   ├── /camera              # Camera Studio (Fase 2)
│   ├── /review              # Review Page (Fase 3)
│   ├── /editor              # Photo Editor (Fase 4)
│   └── /test-context        # Context testing page
│
├── /components
│   ├── /camera              # Camera components (Fase 2)
│   ├── /review              # Review components (Fase 3)
│   ├── /editor              # Editor components (Fase 4)
│   └── /ui                  # Reusable UI components
│       ├── Button.js        ✓
│       └── LoadingIndicator.js ✓
│
├── /lib
│   ├── /context
│   │   └── PhotoSessionContext.js  ✓ State management
│   ├── /hooks               # Custom hooks (Fase 2+)
│   ├── /utils               # Utility functions (Fase 2+)
│   └── /config              # Configuration files (Fase 4)
│
├── /docs
│   └── PRD.md               # Product Requirements Document
│
└── /public                  # Static assets
```

## Architecture

### State Management

**PhotoSessionContext** mengelola state global untuk:
- **Settings**: photoCount, countdown, mode, method, gesture
- **Photos**: Array dengan fixed-length berdasarkan photoCount
- **Retake**: Slot yang sedang di-retake
- **Session Status**: sessionStarted flag

### Photo Slot Structure
```javascript
photos: [
  { slot: 0, blob: Blob | null, timestamp: number | null },
  { slot: 1, blob: Blob | null, timestamp: number | null },
  { slot: 2, blob: Blob | null, timestamp: number | null },
  { slot: 3, blob: Blob | null, timestamp: number | null }
]
```

- Blob disimpan in-memory di Context (bukan Object URL)
- Empty slot: `blob: null`
- Retake: update slot specific, slot lain tidak berubah

### Context Methods

| Method | Description |
|--------|-------------|
| `startSession(settings)` | Initialize session dengan fixed-length photo array |
| `addPhoto(slotIndex, blob)` | Add foto ke slot tertentu |
| `getPhoto(slotIndex)` | Get foto dari slot |
| `getAllPhotos()` | Get semua foto |
| `isSessionComplete()` | Check apakah semua slot terisi |
| `getNextEmptySlot()` | Get index slot kosong berikutnya |
| `setRetakeSlot(index)` | Set slot untuk retake |
| `clearRetake()` | Clear retake flag |
| `resetSession()` | Reset seluruh state |

## Testing

### Manual Testing

1. **Landing Page**: http://localhost:3000
   - Check responsive layout (desktop & mobile)
   - Click "Mulai Sesi Foto" → navigate ke /camera

2. **Context Test Page**: http://localhost:3000/test-context
   - Test initialization dengan 3 dan 4 foto
   - Test addPhoto ke slot tertentu
   - Test isSessionComplete
   - Test getNextEmptySlot
   - Test retake flow

3. **Routing**:
   - `/` - Landing Page
   - `/camera` - Camera Studio (placeholder)
   - `/review` - Review Page (placeholder)
   - `/editor` - Photo Editor (placeholder)

## Known Limitations (MVP)

- Data foto tersimpan in-memory, hilang saat refresh (expected behavior)
- No backend atau database
- No authentication
- No persistent storage (IndexedDB untuk future)
- Platform ini menggunakan WASM bindings karena native bindings tidak tersedia (warning bisa diabaikan)

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (dengan HTTPS)
- **Mobile browsers**: Support dengan kamera depan

### Camera API Requirements
- HTTPS atau localhost untuk development
- User permission required untuk camera access

## Environment

- Development: `npm run dev` (webpack mode)
- Production: `npm run build` → `npm run start`

## Future Improvements (Post-MVP)

Dari PRD Section 2.2:
- Login dan registrasi akun
- Dashboard admin
- Penyimpanan foto permanen (cloud)
- Galeri online
- Sharing via link
- Payment/subscription system

## Notes

- Project menggunakan JavaScript, bukan TypeScript
- Tailwind CSS untuk styling dan responsive
- Next.js App Router (bukan Pages Router)
- MediaPipe untuk gesture detection (diload lazy di Fase 2)

## PRD Reference

Lihat `docs/PRD.md` untuk spesifikasi lengkap product requirements.

## Development Status

### Fase 1: Foundation ✓ COMPLETE
- [x] Project setup dengan Next.js, Tailwind, dependencies
- [x] Folder structure modular
- [x] PhotoSessionContext dengan slot management
- [x] Landing Page dengan hero dan CTA
- [x] Routing untuk semua pages
- [x] Build dan dev server berfungsi

### Next: Fase 2 - Camera System
- Camera utilities & hooks (useCamera, useCountdown)
- Camera UI layout (preview, settings, thumbnails)
- Manual capture (Per Foto & Per Sesi)
- Gesture detection dengan MediaPipe
- Gesture capture (Per Foto & Per Sesi)

---

**Last Updated**: Fase 1 Complete - 2 Nov 2026
