'use client'

import { useEffect, useState } from 'react'

/**
 * Membuat Object URL untuk setiap Blob foto sesi.
 *
 * - URL dibuat ulang saat daftar foto berubah, lalu di-revoke saat berubah
 *   atau komponen dilepas -> mencegah memory leak.
 * - Pembuatan dilakukan di effect (bukan useMemo) supaya aman terhadap
 *   StrictMode di dev: effect dijalankan ulang dan menghasilkan URL baru.
 * - Dipakai bersama oleh preview canvas dan daftar foto agar tidak membuat
 *   URL ganda untuk Blob yang sama.
 *
 * @param {Array<{ blob: Blob | null }>} photos
 * @returns {Array<string | null>} URL sejajar dengan indeks foto
 */
export function usePhotoUrls(photos = []) {
  const [urls, setUrls] = useState([])

  useEffect(() => {
    const created = photos.map((photo) =>
      photo?.blob ? URL.createObjectURL(photo.blob) : null
    )

    // Object URL adalah resource eksternal; menyinkronkannya ke state
    // diperlukan agar render memakai URL yang valid. Lint React menyarankan
    // menghindari setState di effect, tetapi pola ini justru yang aman untuk
    // lifecycle object URL (cleanup me-revoke URL lama).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrls(created)

    return () => {
      created.forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [photos])

  return urls
}
