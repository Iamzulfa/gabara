[Feature] Buat Homepage untuk Website Gabara -> Inputkan di field title

### 🔍 Deskripsi

Kita perlu mengembangkan homepage untuk website Gabara yang akan menjadi halaman utama untuk memperkenalkan platform. Homepage ini bertujuan untuk menarik perhatian pengunjung dan memberikan informasi penting secara ringkas.

Homepage akan terdiri dari beberapa section utama, yaitu:

1. **Hero section** dengan tipografi, hero image, dan tombol CTA.
2. **Service section (Kenapa Gabara?)** yang menjelaskan keunggulan platform.
3. **Testimoni section** menampilkan carousel pengalaman positif dari pengguna.
4. **Mitra section** menampilkan daftar mitra yang bekerja sama.
5. **FAQ section** berisi pertanyaan dan jawaban umum.
6. **CTA Penutup** untuk mengarahkan pengunjung agar mendaftar/bergabung.
7. **Footer** dengan informasi kontak, navigasi link, galeri, dan hak cipta.

---

### ✅ Tujuan

- Mendesain dan mengimplementasikan layout homepage yang responsif.
- Menyediakan informasi yang mudah dipahami untuk calon pengguna.
- Mengarahkan pengunjung agar melakukan aksi (daftar atau login).
- Menerapkan styling konsisten sesuai brand identity Gabara.

---

### 📍 Acceptance Criteria

- [ ] Hero section menampilkan judul, slogan, hero imahe, dan tombol CTA.
- [ ] Service section berisi daftar alasan/keunggulan menggunakan Gabara.
- [ ] Testimoni section menampilkan carousel minimal 4 testimoni pengguna.
- [ ] Mitra section menampilkan partner dengan rapi.
- [ ] FAQ section menampilkan daftar pertanyaan dan jawaban yang dapat di-expand/collapse.
- [ ] CTA Penutup berisi pesan ajakan dengan tombol daftar/login.
- [ ] Footer memuat informasi kontak, link navigasi, galeri, dan copyright.
- [ ] Tampilan sepenuhnya responsif di berbagai ukuran layar.
- [ ] Kode mengikuti best practice Laravel + React + Typescript (Inertia.js).

---

### 💬 Catatan

- Semua halaman **Guest** diletakkan di folder:  
  `resources/js/Pages/Guest/`
- Jika membuat komponen baru, tempatkan di:  
  `resources/js/Components/[nama-folder-komponen]/`
- Untuk tombol utama, gunakan komponen **Button** yang sudah ada.  
  - Import dari `@/Components/ui/button`  
  - Sesuaikan dengan `props` seperti `variant` bila diperlukan.
- Gunakan library React Icon untuk import icon yang dibutuhkan: https://react-icons.github.io/react-icons/

---

### 🏷 Nama Branch

`feature/homepage`

---

### 📦 Commit Message

`feat(homepage): buat homepage dengan hero, service, testimoni, mitra, faq, CTA penutup, dan footer`
