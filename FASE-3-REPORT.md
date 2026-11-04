# FASE 3 REPORT – REVIEW & RETAKE

## 1. Overview

Fase 3 merupakan tahap pengembangan halaman Review Hasil Foto. Fitur ini memungkinkan pengguna memeriksa hasil foto yang telah diambil dan mengganti foto tertentu apabila hasilnya kurang sesuai.

## 2. Development Details

### 3.1 Review Hasil Foto
- Implementasi halaman Review Hasil Foto.
- Menampilkan hasil foto dalam bentuk grid.
- Mendukung tampilan 3 dan 4 foto.
- Setiap foto ditampilkan pada slot masing-masing.

### 3.2 Retake Foto
- Implementasi tombol Retake Foto pada setiap slot.
- Pengguna dapat mengambil ulang foto tertentu.
- Foto lainnya tetap dipertahankan.
- Hasil foto pengganti ditempatkan pada slot sebelumnya.

### 3.3 Navigation
- Integrasi navigasi dari Camera Studio menuju Review.
- Navigasi kembali ke Camera Studio ketika melakukan retake.
- Kembali ke halaman Review setelah foto pengganti berhasil diambil.
- Tombol Lanjut untuk menuju Photo Editor.

## 3. Technologies Used

- Next.js
- JavaScript
- React Context API
- React Hooks
- Browser Camera API
- Canvas API
- Tailwind CSS

## 4. Testing

Pengujian yang dilakukan meliputi:
- Menampilkan hasil foto setelah sesi selesai.
- Memeriksa susunan 3 dan 4 foto.
- Menggunakan tombol Retake Foto.
- Mengganti salah satu foto tanpa menghapus foto lainnya.
- Memastikan hasil foto pengganti tampil pada slot yang benar.
- Navigasi antara Camera Studio dan Review.

## 5. Development Status

Fitur Review Hasil Foto dan Retake telah diimplementasikan dan diuji.

