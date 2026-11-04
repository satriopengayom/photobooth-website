# FASE 2 REPORT – CAMERA SYSTEM

## 1. Overview

Fase 2 merupakan tahap pengembangan sistem kamera pada website Photo Booth. Pada tahap ini, website mulai memiliki kemampuan untuk mengakses kamera, mengambil foto secara manual, serta mendeteksi gesture tangan menggunakan MediaPipe.

## 2. Development Details

### 2.1 Camera Foundation & UI
- Implementasi akses kamera menggunakan Browser Camera API (`getUserMedia`).
- Menggunakan kamera depan (`facingMode: 'user'`).
- Menampilkan live camera preview.
- Implementasi panel pengaturan kamera.
- Menampilkan thumbnail hasil foto.

### 2.2 Manual Capture
- Implementasi pengambilan foto secara manual.
- Pilihan jumlah foto sebanyak 3 atau 4 foto.
- Pilihan countdown 3, 5, dan 10 detik.
- Mode Per Foto dan Per Sesi.
- Pengambilan gambar menggunakan Canvas API.

### 2.3 MediaPipe Gesture Detection
- Integrasi MediaPipe Gesture Recognizer.
- Deteksi gesture Peace dan Open Palm.
- Implementasi stabilisasi deteksi gesture.
- Pengaturan confidence dan interval deteksi.

### 2.4 Gesture Capture
- Integrasi deteksi gesture dengan sistem pengambilan foto.
- Gesture dapat digunakan untuk memulai pengambilan foto.
- Implementasi countdown sebelum pengambilan gambar.
- Mode Gesture Per Foto dan Per Sesi.
- Integrasi hasil foto dengan sistem penyimpanan slot foto.

## 3. Technologies Used

- Next.js
- JavaScript
- React Hooks
- Browser Camera API
- MediaPipe Tasks Vision
- Canvas API
- Tailwind CSS

## 4. Testing

Pengujian yang dilakukan meliputi:
- Akses kamera dan live preview.
- Pengambilan foto manual.
- Mode Manual Per Foto dan Per Sesi.
- Countdown pengambilan foto.
- Deteksi gesture tangan.
- Pengambilan foto menggunakan gesture.

## 5. Development Status

Implementasi utama Camera System telah dikerjakan pada subfase 2.1 sampai 2.4. Pengujian integrasi akhir dilakukan pada subfase 2.5.

