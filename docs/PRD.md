# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# Website Photo Booth

**Versi:** 1.1\
**Status:** Draft\
**Dokumen:** Spesifikasi produk dan kebutuhan sistem\
**Platform:** Website responsif (Laptop/Desktop dan HP)

------------------------------------------------------------------------

## 1. Deskripsi Produk

### 1.1 Gambaran Umum

Website Photo Booth adalah aplikasi berbasis web yang memungkinkan
pengguna mengambil beberapa foto menggunakan kamera perangkat, melihat
dan mengulang foto tertentu, mengedit hasil foto, kemudian mengunduh
seluruh hasilnya sebagai satu gambar gabungan.

Website dirancang agar dapat digunakan melalui laptop maupun HP. Pada
perangkat HP, kamera yang digunakan adalah kamera depan.

### 1.2 Tujuan

-   Menyediakan pengalaman photo booth yang mudah digunakan langsung
    melalui browser.
-   Memungkinkan pengguna mengambil 3 atau 4 foto dalam satu sesi.
-   Menyediakan pengambilan foto secara manual maupun otomatis
    menggunakan deteksi gesture tangan.
-   Memungkinkan pengguna memeriksa dan mengulang foto tertentu tanpa
    mengulang seluruh sesi.
-   Menyediakan editor untuk mengatur layout, cover, filter, dan
    bingkai.
-   Memungkinkan hasil akhir diunduh ke perangkat pengguna.

### 1.3 Target Pengguna

Pengguna umum yang ingin mengambil foto bergaya photo booth melalui
laptop atau HP tanpa harus memasang aplikasi khusus.

### 1.4 Platform

-   Laptop/Desktop: mendukung kamera yang tersedia pada perangkat.
-   HP: menggunakan kamera depan.
-   Browser: browser modern yang mendukung akses kamera dan fitur
    JavaScript yang dibutuhkan.

------------------------------------------------------------------------

## 2. Ruang Lingkup Produk

### 2.1 Fitur yang Termasuk

1.  Landing Page.
2.  Camera Studio.
3.  Pemilihan jumlah foto.
4.  Pengaturan countdown.
5.  Mode Manual.
6.  Mode Gesture Auto Capture.
7.  Metode Per Foto dan Per Sesi pada kedua mode.
8.  Deteksi gesture Peace dan Open Palm.
9.  Thumbnail dan indikator progres pengambilan foto.
10. Review hasil foto.
11. Retake foto tertentu.
12. Photo Editor dengan tab Layout, Cover, Filter, dan Bingkai.
13. Preview hasil edit secara langsung.
14. Download hasil akhir sebagai satu gambar gabungan.

### 2.2 Di Luar Ruang Lingkup MVP

-   Login dan registrasi akun.
-   Dashboard admin.
-   Penyimpanan foto permanen di server atau cloud.
-   Galeri online yang dapat dibuka dari perangkat lain.
-   Berbagi foto melalui tautan online.
-   Pembayaran atau sistem berlangganan.

Fitur di luar ruang lingkup tersebut dapat dipertimbangkan untuk
pengembangan berikutnya.

------------------------------------------------------------------------

## 3. Struktur Halaman Website

Website memiliki empat halaman utama:

1.  Landing Page
2.  Camera Studio
3.  Review Hasil Foto
4.  Photo Editor

Alur utama pengguna:

**Landing Page → Camera Studio → Review Hasil Foto → Photo Editor →
Download**

Pengguna tidak langsung diarahkan ke kamera ketika membuka website.
Pengguna harus menekan tombol untuk memulai sesi terlebih dahulu.

------------------------------------------------------------------------

## 4. Kebutuhan Fungsional

## 4.1 Landing Page

### Tujuan

Menjadi halaman pembuka yang memperkenalkan website dan mengarahkan
pengguna untuk memulai sesi foto.

### Elemen dan fitur

-   Menampilkan identitas atau nama website Photo Booth.
-   Menampilkan bagian hero yang menjelaskan fungsi utama website.
-   Menyediakan tombol **Mulai Sesi Foto**.
-   Tombol tersebut mengarahkan pengguna ke halaman Camera Studio.
-   Kamera tidak langsung diaktifkan hanya karena pengguna membuka
    Landing Page.

### Perilaku sistem

-   Halaman dapat dibuka tanpa meminta izin kamera.
-   Permintaan izin kamera dilakukan ketika pengguna memasuki Camera
    Studio dan mengaktifkan kamera.
-   Jika pengguna menolak izin kamera, website menampilkan informasi
    bahwa akses kamera diperlukan untuk mengambil foto serta cara
    mencoba kembali.

------------------------------------------------------------------------

## 4.2 Camera Studio

### Tujuan

Menjadi halaman utama untuk mengatur sesi, melihat preview kamera,
mengambil foto, dan memantau progres sesi.

### 4.2.1 Akses Kamera

-   Website meminta izin pengguna untuk mengakses kamera.
-   Preview kamera ditampilkan setelah akses diberikan.
-   Pada laptop/desktop, sistem menggunakan kamera perangkat yang
    tersedia.
-   Pada HP, sistem menggunakan kamera depan.
-   Jika kamera tidak tersedia atau gagal diakses, tampilkan pesan yang
    mudah dipahami dan opsi untuk mencoba kembali.
-   Kamera harus tetap aktif selama diperlukan untuk proses pengambilan
    foto dan deteksi gesture.

### 4.2.2 Tata Letak Camera Studio

**Laptop/Desktop:** - Preview kamera berada di sisi kiri atau area
utama. - Panel pengaturan berada di sisi kanan. - Thumbnail foto yang
telah diambil ditampilkan di bawah preview kamera. - Informasi progres
sesi ditampilkan dengan jelas.

**HP:** - Tampilan menyesuaikan ukuran layar. - Preview kamera menjadi
area utama. - Pengaturan dan tombol kontrol disusun agar mudah digunakan
pada layar sentuh. - Thumbnail foto tetap dapat dilihat tanpa mengganggu
preview kamera dan kontrol utama.

### 4.2.3 Pengaturan Jumlah Foto

Pengguna dapat memilih jumlah foto dalam satu sesi:

-   3 foto.
-   4 foto.

Ketentuan: - Jumlah foto harus dipilih sebelum sesi dimulai. - Setelah
sesi pengambilan foto dimulai, jumlah foto dikunci sampai sesi tersebut
selesai. - Pilihan jumlah foto tidak dapat diubah di tengah sesi. -
Pengaturan ini menentukan jumlah slot foto pada halaman Review.

### 4.2.4 Pengaturan Countdown

Pengguna dapat memilih durasi countdown:

-   3 detik.
-   5 detik.
-   10 detik.

Ketentuan: - Countdown berjalan sebelum setiap foto diambil. - Pada
metode Per Sesi, setiap foto tetap memiliki countdown sendiri. -
Countdown ditampilkan secara jelas di atas atau di dekat preview
kamera. - Foto diambil setelah countdown mencapai nol. - Perubahan
countdown ketika sesi sedang berlangsung mengikuti ketentuan perubahan
pengaturan sesi yang ditetapkan pada bagian 7. Hal yang belum diputuskan
tidak boleh diasumsikan sebagai perilaku final.

### 4.2.5 Mode Pengambilan Foto

Terdapat dua mode utama:

**A. Manual**

Pengambilan foto dilakukan melalui tombol kontrol pengguna. Pada mode
ini, pengaturan gesture tidak ditampilkan atau tidak dapat digunakan.

**B. Gesture Auto Capture**

Pengambilan foto dimulai melalui deteksi gesture tangan menggunakan
MediaPipe.

Gesture yang tersedia: - Peace (✌️). - Open Palm (✋).

Pengguna memilih salah satu gesture sebagai pemicu. Sistem mendeteksi
gesture melalui kamera, kemudian menjalankan countdown dan mengambil
foto sesuai metode yang dipilih.

### 4.2.6 Metode Pengambilan Foto

Kedua mode, Manual maupun Gesture Auto Capture, memiliki dua metode:

#### A. Per Foto

**Manual -- Per Foto** 1. Pengguna menekan tombol ambil foto. 2.
Countdown berjalan. 3. Sistem mengambil satu foto. 4. Foto masuk ke slot
berikutnya dan thumbnail diperbarui. 5. Pengguna menekan tombol lagi
untuk mengambil foto selanjutnya. 6. Proses diulang sampai jumlah foto
yang dipilih terpenuhi.

**Gesture -- Per Foto** 1. Sistem menunggu gesture pilihan pengguna. 2.
Pengguna menunjukkan gesture di depan kamera. 3. Setelah gesture
terdeteksi, countdown berjalan. 4. Sistem mengambil satu foto. 5. Foto
masuk ke slot berikutnya dan thumbnail diperbarui. 6. Sistem kembali
menunggu gesture untuk foto berikutnya. 7. Proses diulang sampai jumlah
foto terpenuhi.

#### B. Per Sesi

**Manual -- Per Sesi** 1. Pengguna menekan tombol mulai sesi satu kali.
2. Sistem menjalankan countdown untuk foto pertama. 3. Sistem mengambil
foto pertama. 4. Sistem melanjutkan countdown untuk foto berikutnya
secara otomatis. 5. Proses berulang sampai seluruh jumlah foto
terpenuhi. 6. Pengguna tidak perlu menekan tombol ambil foto untuk
setiap foto.

**Gesture -- Per Sesi** 1. Sistem menunggu gesture pilihan pengguna. 2.
Pengguna menunjukkan gesture satu kali. 3. Setelah gesture terdeteksi,
sistem memulai rangkaian sesi. 4. Sistem menjalankan countdown dan
mengambil foto pertama. 5. Sistem melanjutkan countdown dan pengambilan
foto berikutnya secara otomatis. 6. Proses berulang sampai seluruh
jumlah foto terpenuhi. 7. Pengguna tidak perlu menunjukkan gesture lagi
untuk setiap foto dalam rangkaian tersebut.

### 4.2.7 Deteksi Gesture

-   Deteksi gesture menggunakan MediaPipe.
-   Pilihan gesture hanya Peace dan Open Palm.
-   Sistem hanya memulai pemicu ketika gesture pilihan berhasil
    dikenali.
-   Status deteksi ditampilkan kepada pengguna, misalnya menunggu
    gesture atau gesture terdeteksi.
-   Ketika mode Manual dipilih, pengaturan dan status gesture tidak
    ditampilkan sebagai kontrol aktif.
-   Deteksi gesture harus mempertimbangkan kestabilan pengenalan agar
    satu gesture yang sama tidak memicu beberapa sesi secara tidak
    sengaja.

### 4.2.8 Thumbnail dan Progres

-   Setiap foto yang berhasil diambil ditampilkan sebagai thumbnail.
-   Thumbnail berada di bawah preview kamera pada tampilan
    laptop/desktop.
-   Sistem menampilkan progres, misalnya **Foto 2 dari 4**.
-   Slot foto yang belum terisi ditampilkan sebagai placeholder.
-   Foto yang diambil harus masuk ke urutan slot yang benar.
-   Setelah seluruh slot foto terisi, sistem otomatis mengarahkan
    pengguna ke halaman Review Hasil Foto.

### 4.2.9 Ketentuan Sesi

-   Tidak tersedia fitur Pause/Resume.
-   Rangkaian pengambilan foto dengan metode Per Sesi harus berjalan
    sampai seluruh foto yang ditentukan selesai diambil.
-   Pengambilan foto tidak boleh terhenti di tengah rangkaian hanya
    karena pengguna tidak melakukan pemicu berikutnya; pada Per Sesi,
    pemicu hanya dilakukan satu kali di awal.
-   Jumlah foto tetap terkunci setelah sesi dimulai.
-   Ketentuan mengenai pembatalan seluruh sesi dan perubahan
    mode/pengaturan ketika sesi berjalan perlu mengikuti keputusan pada
    bagian 7.

------------------------------------------------------------------------

## 4.3 Review Hasil Foto

### Tujuan

Memberikan kesempatan kepada pengguna untuk memeriksa semua foto sebelum
masuk ke Photo Editor.

### 4.3.1 Tampilan Foto

-   Semua foto hasil sesi ditampilkan pada halaman Review.
-   Jika pengguna mengambil 4 foto, tampilkan dalam grid 2 kolom × 2
    baris.
-   Jika pengguna mengambil 3 foto, tampilkan dalam grid 2 kolom dengan
    foto ketiga berada di kiri baris kedua dan area kanan bawah kosong.
-   Setiap foto ditampilkan dalam slot yang terpisah.
-   Setiap slot memiliki tombol **Ulangi Foto Ini** di bawah foto.

### 4.3.2 Retake Foto

-   Pengguna dapat mengulang satu foto tertentu tanpa mengambil ulang
    seluruh foto.
-   Ketika tombol Ulangi Foto Ini dipilih, pengguna diarahkan kembali ke
    Camera Studio.
-   Foto lain yang sudah berhasil diambil harus tetap dipertahankan.
-   Sistem menandai slot foto yang sedang diulang.
-   Thumbnail foto lain tetap ditampilkan.
-   Setelah foto pengganti berhasil diambil, foto lama pada slot
    tersebut diganti.
-   Foto pada slot lain tidak boleh berubah atau terhapus.
-   Setelah pengambilan foto pengganti selesai, pengguna otomatis
    kembali ke halaman Review.

### 4.3.3 Lanjut ke Editor

-   Halaman Review menyediakan tombol **Lanjut ke Photo Editor**.
-   Tombol mengarahkan pengguna ke halaman Photo Editor.
-   Foto yang diteruskan adalah foto terbaru untuk setiap slot, termasuk
    foto hasil retake.
-   Pengguna dapat masuk ke editor setelah seluruh slot foto terisi.

------------------------------------------------------------------------

## 4.4 Photo Editor

### Tujuan

Memungkinkan pengguna menyusun dan mempercantik hasil foto sebelum
mengunduhnya.

### 4.4.1 Tata Letak Editor

**Laptop/Desktop:** - Area preview hasil foto berada di sisi kiri atau
area utama. - Panel pengaturan editor berada di sisi kanan. - Perubahan
pengaturan ditampilkan pada preview.

**HP:** - Editor menyesuaikan ukuran layar. - Preview dan panel
pengaturan disusun agar tetap nyaman digunakan melalui layar sentuh. -
Kontrol editor tidak boleh menutupi preview secara permanen.

### 4.4.2 Susunan Hasil Foto

-   Hasil foto pada editor disusun secara vertikal sebagai strip atau
    rangkaian foto photo booth.
-   Susunan ini berbeda dari halaman Review yang menggunakan grid.
-   Hasil akhir merupakan satu komposisi gambar gabungan.
-   Perubahan layout harus memperbarui komposisi preview.

### 4.4.3 Tab Editor

Editor memiliki empat tab awal:

1.  **Layout**
2.  **Cover**
3.  **Filter**
4.  **Bingkai**

Setiap tab memiliki panel pengaturan tersendiri.

**Layout** - Mengatur susunan atau komposisi foto pada hasil akhir. -
Pilihan layout dapat dikembangkan kemudian.

**Cover** - Menyediakan pengaturan atau pilihan cover untuk hasil
foto. - Detail pilihan cover dapat ditentukan pada pengembangan
berikutnya.

**Filter** - Menyediakan pilihan filter untuk mengubah tampilan visual
foto. - Filter diterapkan pada preview dan hasil akhir.

**Bingkai** - Menyediakan pilihan bingkai untuk komposisi foto. -
Bingkai diterapkan pada preview dan hasil akhir.

Struktur editor harus memungkinkan penambahan tab atau fitur baru tanpa
mengharuskan seluruh halaman editor dibuat ulang.

### 4.4.4 Preview Langsung

-   Perubahan pada Layout, Cover, Filter, dan Bingkai langsung
    memperbarui preview.
-   Tidak diperlukan tombol Apply untuk menerapkan setiap perubahan.
-   Ketika preview sedang diproses, tampilkan indikator seperti
    **Memperbarui tampilan...**.
-   Indikator menghilang setelah preview selesai diperbarui.
-   Hasil yang diunduh harus sesuai dengan pengaturan terakhir yang
    terlihat pada preview.

### 4.4.5 Download Hasil Foto

-   Tombol download tersedia pada halaman Photo Editor.
-   Pengguna mengunduh seluruh foto sebagai satu gambar gabungan, bukan
    sebagai file terpisah untuk setiap foto.
-   File disimpan melalui mekanisme download browser ke perangkat
    pengguna.
-   Hasil download harus mencerminkan layout, cover, filter, dan bingkai
    yang sedang dipilih.
-   Proses download harus memberikan respons yang jelas kepada pengguna.
-   Format dan kualitas file final masih perlu ditetapkan pada bagian 7.

------------------------------------------------------------------------

## 5. Alur Penggunaan Website

### 5.1 Alur Utama

1.  Pengguna membuka Landing Page.
2.  Pengguna menekan tombol Mulai Sesi Foto.
3.  Website membuka Camera Studio.
4.  Pengguna memberikan izin akses kamera.
5.  Preview kamera ditampilkan.
6.  Pengguna memilih jumlah foto: 3 atau 4.
7.  Pengguna memilih countdown: 3, 5, atau 10 detik.
8.  Pengguna memilih mode Manual atau Gesture Auto Capture.
9.  Pengguna memilih metode Per Foto atau Per Sesi.
10. Jika menggunakan Gesture Auto Capture, pengguna memilih Peace atau
    Open Palm.
11. Pengguna memulai pengambilan foto sesuai mode dan metode.
12. Sistem mengambil foto sampai seluruh slot terisi.
13. Sistem otomatis membuka Review Hasil Foto.
14. Pengguna memeriksa hasil foto.
15. Jika ada foto yang kurang sesuai, pengguna memilih Ulangi Foto Ini
    pada slot terkait.
16. Setelah puas, pengguna menekan Lanjut ke Photo Editor.
17. Pengguna mengatur Layout, Cover, Filter, dan Bingkai.
18. Preview diperbarui mengikuti perubahan.
19. Pengguna menekan tombol Download.
20. Website menghasilkan satu gambar gabungan dan mengunduhnya ke
    perangkat.

### 5.2 Alur Retake

1.  Pengguna berada di halaman Review.
2.  Pengguna memilih Ulangi Foto Ini pada foto tertentu.
3.  Website membuka Camera Studio dalam kondisi retake.
4.  Sistem mempertahankan foto lain dan menandai slot yang akan diganti.
5.  Pengguna mengambil foto pengganti.
6.  Sistem mengganti foto pada slot yang dipilih.
7.  Website otomatis kembali ke Review.
8.  Pengguna dapat melanjutkan ke Photo Editor.

------------------------------------------------------------------------

## 6. Aturan dan Perilaku Sistem

### 6.1 Pengelolaan Foto

-   Foto dikelola berdasarkan urutan slot dalam satu sesi.
-   Jumlah slot mengikuti pilihan 3 atau 4 foto.
-   Foto yang berhasil diambil disimpan sementara selama sesi
    berlangsung.
-   Retake hanya mengganti foto pada slot yang dipilih.
-   Foto pada slot lain harus tetap terjaga.
-   Foto yang diteruskan ke editor adalah foto terbaru dari setiap slot.

### 6.2 Pengelolaan Sesi

-   Satu sesi memiliki jumlah foto yang sudah ditentukan sejak awal.
-   Jumlah foto tidak dapat diubah setelah sesi dimulai.
-   Metode Per Foto membutuhkan pemicu untuk setiap foto.
-   Metode Per Sesi hanya membutuhkan satu pemicu awal, lalu pengambilan
    foto berlangsung otomatis sampai selesai.
-   Tidak ada Pause/Resume.
-   Rincian perubahan pengaturan ketika sesi sedang berlangsung
    mengikuti keputusan yang masih terbuka pada bagian 7.

### 6.3 Pemrosesan Foto

-   Untuk MVP, pengambilan, pemrosesan, pengeditan, dan penyusunan hasil
    foto dilakukan di browser.
-   Foto tidak perlu dikirim ke backend untuk menjalankan alur utama.
-   Hasil akhir dibuat sebagai satu gambar gabungan melalui proses
    rendering di browser.
-   Aplikasi perlu menangani kondisi ketika perangkat atau browser tidak
    mampu memproses foto dengan baik, misalnya dengan menampilkan pesan
    kesalahan yang jelas.

### 6.4 Kondisi Kesalahan

Website perlu menyediakan pesan atau status yang jelas untuk kondisi
berikut:

-   Pengguna menolak izin kamera.
-   Kamera tidak ditemukan.
-   Kamera gagal diaktifkan atau terputus.
-   MediaPipe atau model deteksi gesture gagal dimuat.
-   Gesture belum terdeteksi.
-   Pengambilan foto gagal.
-   Preview editor gagal diperbarui.
-   Proses pembuatan file download gagal.

Pesan kesalahan harus mudah dipahami dan, jika memungkinkan, menyediakan
tindakan untuk mencoba kembali.

------------------------------------------------------------------------

## 7. Ketentuan yang Masih Perlu Diputuskan

Bagian ini mencatat hal yang belum ditetapkan sebagai keputusan final.
Implementasi tidak boleh menganggap salah satu pilihan sebagai keputusan
pengguna sebelum ditentukan.

1.  **Pembatalan sesi Per Sesi:** apakah pengguna boleh membatalkan
    seluruh sesi sebelum rangkaian foto selesai, atau sesi harus selalu
    berjalan sampai selesai tanpa opsi pembatalan?
2.  **Perubahan pengaturan ketika sesi berjalan:** apakah mode
    Manual/Gesture, pilihan gesture, dan countdown dapat diubah di
    antara pengambilan foto? Jika dapat, perubahan hanya berlaku untuk
    foto berikutnya dan tidak boleh menghentikan countdown atau proses
    pengambilan foto yang sedang berlangsung.
3.  **Reset seluruh foto:** apakah halaman Review perlu menyediakan
    tombol untuk mengulang seluruh sesi?
4.  **Pilihan Layout:** jumlah dan variasi layout yang akan disediakan.
5.  **Pilihan Cover:** desain dan variasi cover yang akan disediakan.
6.  **Pilihan Filter:** jenis dan jumlah filter yang akan disediakan.
7.  **Pilihan Bingkai:** desain dan variasi bingkai yang akan
    disediakan.
8.  **Kontrol editor:** apakah Undo, Redo, dan Reset Edit diperlukan?
9.  **Format dan kualitas download:** misalnya PNG atau JPEG serta
    resolusi hasil akhir.
10. **Tata letak editor pada HP:** apakah panel pengaturan ditampilkan
    di bawah preview, melalui tab, atau pola lain.
11. **Penyimpanan sementara:** mekanisme penyimpanan foto selama sesi
    dan perilaku jika pengguna me-refresh halaman atau menutup tab.
12. **Bahasa antarmuka:** apakah seluruh teks website menggunakan Bahasa
    Indonesia atau Bahasa Inggris.

------------------------------------------------------------------------

## 8. Kebutuhan Nonfungsional

### 8.1 Responsivitas

-   Website harus dapat digunakan pada laptop/desktop dan HP.
-   Komponen harus menyesuaikan ukuran layar.
-   Tombol dan kontrol harus nyaman digunakan dengan mouse maupun layar
    sentuh.
-   Preview kamera dan hasil foto harus tetap terlihat dengan proporsi
    yang wajar.

### 8.2 Performa

-   Perpindahan antarhalaman harus terasa responsif.
-   Preview kamera harus berjalan dengan lancar pada perangkat yang
    mendukung.
-   Deteksi gesture tidak boleh membuat antarmuka utama menjadi tidak
    responsif.
-   Proses rendering editor dan download perlu dikelola agar tidak
    membebani perangkat secara berlebihan.
-   Tampilkan indikator saat proses membutuhkan waktu.

### 8.3 Kompatibilitas

-   Menggunakan browser modern yang mendukung Camera API.
-   Akses kamera melalui `getUserMedia` memerlukan secure context,
    seperti HTTPS atau localhost.
-   Fitur kamera harus menangani izin browser dan perangkat yang tidak
    kompatibel.

### 8.4 Privasi

-   Kamera hanya diakses setelah pengguna memberikan izin.
-   Kamera tidak diaktifkan dari Landing Page.
-   Untuk MVP, foto diproses secara lokal di browser dan tidak diunggah
    ke server.
-   Pengguna perlu diberi informasi bahwa hasil foto sementara dapat
    hilang ketika halaman ditutup atau dimuat ulang, sesuai mekanisme
    penyimpanan yang dipilih.

### 8.5 Kemudahan Pengembangan

-   Fitur setiap halaman perlu memiliki tanggung jawab yang jelas.
-   Pengaturan kamera, sesi foto, deteksi gesture, dan editor perlu
    dipisahkan secara logis.
-   Penambahan variasi Layout, Cover, Filter, Bingkai, maupun tab editor
    baru harus dapat dilakukan tanpa mengubah keseluruhan alur aplikasi.
-   Perubahan kebutuhan di masa depan harus dapat diterapkan secara
    bertahap.

------------------------------------------------------------------------

## 9. Teknologi Produk

Teknologi yang direncanakan untuk MVP:

  -----------------------------------------------------------------------
  Teknologi                           Peran
  ----------------------------------- -----------------------------------
  Next.js (App Router)                Framework aplikasi dan pengelolaan
                                      halaman

  JavaScript                          Logika aplikasi

  Tailwind CSS                        Styling dan responsivitas

  MediaPipe                           Deteksi gesture tangan

  Camera API (`getUserMedia`)         Mengakses kamera perangkat

  Canvas API                          Mengolah, menyusun, dan merender
                                      hasil foto

  Browser Blob / Object URL           Mengelola data foto sementara dan
                                      file hasil
  -----------------------------------------------------------------------

### 9.1 Backend

Backend dan database tidak menjadi kebutuhan MVP karena alur utama dapat
dijalankan di browser pengguna.

Backend dapat dipertimbangkan pada pengembangan selanjutnya apabila
website membutuhkan akun, penyimpanan cloud, galeri online, atau
sinkronisasi foto antarperangkat.

------------------------------------------------------------------------

## 10. Kriteria Penerimaan Produk

MVP dianggap memenuhi kebutuhan utama apabila:

1.  Pengguna dapat membuka Landing Page dan masuk ke Camera Studio
    melalui tombol Mulai Sesi Foto.
2.  Kamera baru diminta ketika pengguna memasuki proses Camera Studio.
3.  Website dapat menampilkan preview kamera pada laptop dan kamera
    depan pada HP yang didukung.
4.  Pengguna dapat memilih 3 atau 4 foto sebelum sesi dimulai.
5.  Pengguna dapat memilih countdown 3, 5, atau 10 detik.
6.  Mode Manual menyediakan metode Per Foto dan Per Sesi.
7.  Mode Gesture Auto Capture menyediakan metode Per Foto dan Per Sesi.
8.  Gesture Peace dan Open Palm dapat dipilih sebagai pemicu.
9.  Pada Per Foto, setiap foto membutuhkan pemicu masing-masing.
10. Pada Per Sesi, satu pemicu awal menjalankan rangkaian pengambilan
    seluruh foto secara otomatis.
11. Thumbnail dan progres diperbarui setiap kali foto berhasil diambil.
12. Setelah semua foto selesai, website otomatis membuka halaman Review.
13. Pengguna dapat mengulang satu foto tertentu tanpa mengubah foto
    lain.
14. Foto pengganti otomatis menggantikan slot yang dipilih.
15. Pengguna dapat membuka Photo Editor setelah seluruh foto diperiksa.
16. Photo Editor menyediakan tab Layout, Cover, Filter, dan Bingkai.
17. Perubahan editor memperbarui preview tanpa tombol Apply.
18. Hasil foto editor disusun sebagai satu komposisi vertikal photo
    booth.
19. Pengguna dapat mengunduh seluruh hasil sebagai satu gambar gabungan.
20. Website dapat digunakan pada laptop dan HP dengan tampilan
    responsif.

------------------------------------------------------------------------

## 11. Catatan Pengembangan Produk

Dokumen ini merupakan acuan kebutuhan produk untuk MVP website Photo
Booth. Detail yang masih terbuka pada Bagian 7 dapat ditetapkan dan
ditambahkan melalui revisi PRD.

Penambahan fitur di kemudian hari tidak harus mengubah alur utama yang
sudah ada. Struktur produk diharapkan tetap modular sehingga fitur baru
dapat ditambahkan secara bertahap.

**Akhir dokumen PRD.**
