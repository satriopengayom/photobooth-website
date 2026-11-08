# Bingkai PNG Studio Hias

Folder ini disediakan untuk bingkai PNG transparan buatan sendiri.

## Cara menambahkan bingkai

1. Simpan file PNG transparan di folder ini, misalnya `my-frame.png`.
2. Daftarkan file tersebut pada `CUSTOM_FRAME_REGISTRY` di
   `lib/utils/editorFrames.js`:

   ```js
   export const CUSTOM_FRAME_REGISTRY = [
     {
       id: 'my-frame',
       label: 'My Frame',
       description: 'Bingkai buatan sendiri.',
       src: '/frames/my-frame.png',
       margin: 40
     }
   ]
   ```

3. Buka tab **Bingkai** di Studio Hias. Entri baru otomatis muncul bersama
   bingkai bawaan dan dapat dipilih.

## Ketentuan aset

- Gunakan PNG dengan area tengah transparan agar foto tetap terlihat.
- PNG digambar menutupi seluruh kanvas hasil akhir dan diskalakan mengikuti
  ukuran komposisi (bukan ukuran tetap).
- `margin` adalah lebar pita bingkai dalam piksel. Nilai ini dipakai untuk
  menghitung area konten (cover + foto) agar tidak tertutup hiasan bingkai.
  Jika tidak diisi, nilai bawaan 28 px digunakan.
- Rasio gambar sebaiknya mengikuti rasio komposisi akhir. Jika berbeda, PNG
  akan diregangkan mengikuti kanvas.

Bingkai bawaan tetap berfungsi normal meskipun registry ini kosong.
