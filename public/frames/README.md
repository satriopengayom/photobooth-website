# Bingkai Studio Hias

Folder ini menyimpan aset bingkai kustom untuk Studio Hias.

## Lokasi aset

Aset dipisahkan menurut jumlah foto:

- `3 foto 1 kolom/` — bingkai untuk Layout Strip dengan 3 foto.
- `4 foto 1 kolom/` — bingkai untuk Layout Strip dengan 4 foto.

Bingkai yang terintegrasi:

| Desain | Aset 3 foto | Aset 4 foto |
| --- | --- | --- |
| Spider-Man Strip | `3 foto 1 kolom/3 strip spiderman.png` | `4 foto 1 kolom/4 strip spiderman.png` |
| Zootopia Strip | `3 foto 1 kolom/3 - strip zootopia.png` | `4 foto 1 kolom/4 - strip zootopia.png` |
| Retro Strip | `3 foto 1 kolom/3 strip retro.png` | `4 foto 1 kolom/4 strip retro.png` |
| Vintage Strip | `3 foto 1 kolom/3 strip vintage.png` | `4 foto 1 kolom/4 strip vintage.png` |

Setiap pasangan file merupakan satu pilihan UI di tab **Bingkai**:
`Spider-Man Strip`, `Zootopia Strip`, `Retro Strip`, dan `Vintage Strip`.
Sistem memilih file berdasarkan jumlah foto; pengguna tidak memilih varian
3 foto dan 4 foto secara terpisah.

Bingkai-bingkai ini hanya tersedia pada Layout Strip. Saat Layout Grid
aktif, bingkai custom tersebut tidak ditampilkan sama sekali; yang tampil
hanya bingkai bawaan yang kompatibel dan pilihan **None** (Tanpa Bingkai).
Jika bingkai Strip sedang dipilih lalu pengguna berpindah ke Grid, pilihan
otomatis kembali ke Tanpa Bingkai.

Bingkai tidak memiliki area cover. Foto ditempatkan dengan `fit: 'contain'`
agar seluruh foto terlihat tanpa terpotong dan rasionya tidak berubah. Sisa
ruang slot diisi versi blur dari foto yang sama (`slotBackdrop: 'blur'`),
jadi tidak ada pita putih di dalam slot. Versi blur hanya menjadi latar;
foto utama tetap utuh.

## Menambahkan bingkai baru

### Overlay PNG biasa

```js
{
  id: 'my-frame',
  label: 'My Frame',
  description: 'Bingkai buatan sendiri.',
  src: '/frames/my-frame.png',
  margin: 40
}
```

PNG overlay digambar menutupi seluruh kanvas hasil akhir. `margin` adalah
lebar pita bingkai dalam piksel dan dipakai untuk menghitung area konten.

### Bingkai dengan slot foto

Gunakan `variants` agar satu pilihan UI memakai aset berbeda menurut jumlah
foto. Koordinat slot memakai ukuran asli file aset.

```js
{
  id: 'my-slot-frame',
  label: 'My Slot Frame',
  description: 'Bingkai untuk Layout Strip.',
  layout: 'strip',
  photoCounts: [3, 4],
  cover: false,
  fit: 'contain',
  slotBackdrop: 'blur',
  slotFill: '#1E1C1A',
  variants: {
    3: {
      src: '/frames/my-frame-3.png',
      width: 213,
      height: 640,
      slots: [{ x: 10, y: 60, width: 194, height: 149 }]
    },
    4: {
      src: '/frames/my-frame-4.png',
      width: 852,
      height: 3208,
      slots: [{ x: 43, y: 238, width: 772, height: 596 }]
    }
  }
}
```

Renderer memakai ukuran asli `width`/`height` varian sebagai ukuran kanvas,
menempatkan foto sesuai `fit`, lalu menggambar aset sebagai lapisan paling
atas. Gunakan `fit: 'contain'` agar seluruh foto terlihat tanpa terpotong;
tambahkan `slotBackdrop: 'blur'` agar sisa slot diisi blur foto dan tidak
menyisakan pita putih. `fit: 'cover'` tetap tersedia bila ingin foto
memenuhi slot dengan konsekuensi tepi foto terpotong.

`layout` membatasi bingkai ke layout yang didukung. `photoCounts` mencatat
jumlah foto yang tersedia. Nama folder dan file yang mengandung spasi
di-encode otomatis oleh registry.

## Ketentuan aset

- Gunakan PNG transparan dengan area slot yang benar-benar transparan.
- Jangan mengubah ukuran atau memaksakan aset 3 foto menjadi layout 4 foto.
- `layout: 'strip'` membatasi bingkai hanya untuk Layout Strip. Pada Layout
  Grid, bingkai custom tersebut tidak ditampilkan dan bingkai bawaan tetap
  berfungsi.
- `cover: false` menandai bingkai yang tidak menyediakan area cover.
- `fit: 'contain'` + `slotBackdrop: 'blur'` menjaga foto tetap utuh dan
  mengisi sisa slot tanpa pita putih.
- Hasil download dirender minimal 1200 px lebar. Ketajaman detail bingkai
  tetap dibatasi resolusi file aset; aset 3 foto Spider-Man saat ini
  213×640, jadi versi resolusi lebih tinggi akan memberi hasil maksimal.
- Catatan: `3 strip spiderman.png` saat ini berisi data WebP meskipun
  ekstensinya `.png`. Browser modern tetap dapat men-decode file tersebut.
  Nama file tidak diubah agar sesuai aset yang tersedia.

Bingkai bawaan tetap berfungsi normal.
