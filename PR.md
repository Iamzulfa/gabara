feat(homepage): buat homepage dengan hero, service, testimoni, mitra, faq, CTA penutup, dan footer -> Inputkan di field title

### 📌 Deskripsi

PR ini menambahkan **homepage** untuk website Gabara sesuai dengan kebutuhan pada issue:  
**[Feature] Buat Homepage untuk Website Gabara**

Homepage terdiri dari section utama berikut:

1. **Hero section** dengan tipografi, hero image, dan tombol CTA.
2. **Service section (Kenapa Gabara?)** menjelaskan keunggulan platform.
3. **Testimoni section** menampilkan carousel pengalaman positif dari pengguna.
4. **Mitra section** menampilkan daftar mitra yang bekerja sama.
5. **FAQ section** berisi pertanyaan dan jawaban umum.
6. **CTA Penutup** untuk mengarahkan pengunjung agar mendaftar/bergabung.
7. **Footer** dengan informasi kontak, navigasi link, galeri, dan hak cipta.

---

### ✅ Perubahan Utama

#### 🎨 Frontend (React + Inertia.js)
- Membuat halaman `Homepage.tsx` di folder `resources/js/Pages/Guest/`
- Membuat komponen untuk setiap section di folder `resources/js/Pages/Homepage/`:
  - `HeroSection.tsx`
  - `ServiceSection.tsx`
  - `TestimoniSection.tsx`
  - `MitraSection.tsx`
  - `FaqSection.tsx`
  - `ClosingCTA.tsx`
  - `Footer.tsx`
- Implementasi **Button** dengan import dari `@/Components/ui/button` (menggunakan `variant` bila diperlukan)

#### ⚙️ Backend (Laravel + Inertia)
- Routing homepage ditambahkan pada `web.php`
- Konten FAQ, Testimoni, dan Mitra dapat di-*seed* atau dikelola melalui Admin Panel (sementara menggunakan dummy data)

---

## ✅ To-Do List

- [x] Tambahkan Hero Section dengan judul, slogan, hero image, dan CTA button  
- [x] Buat Service Section (Kenapa Gabara?)  
- [x] Implementasi Testimoni Section dengan carousel minimal 4 testimoni  
- [x] Tambahkan Mitra Section dengan daftar partner/logo  
- [x] Buat FAQ Section expandable/collapsible  
- [x] Tambahkan CTA Penutup dengan tombol daftar/login  
- [x] Implementasi Footer dengan kontak, navigasi, galeri, copyright  
- [x] Pastikan halaman responsif di berbagai ukuran layar  
- [x] Gunakan struktur folder sesuai ketentuan (`Pages/Guest` dan `Components/[nama-folder-komponen]`)  

---

## 🎯 Tujuan

- Membuat homepage yang menarik, informatif, dan fungsional bagi pengguna Gabara.  
- Memberikan pengalaman awal yang jelas tentang layanan yang ditawarkan.  
- Menyediakan call-to-action yang mengarahkan pengunjung untuk mendaftar/login.  

---

### ✅ Checklist Sebelum Merge

- [x] Homepage tampil sesuai desain dan responsif  
- [x] Semua section berfungsi sesuai acceptance criteria  
- [x] Kode mengikuti best practice Laravel + React (Inertia.js)  
- [x] Tidak ada error/bug pada console browser maupun server  
- [x] Semua komponen tersusun di folder yang benar (`Pages/Guest`, `Components/`)

---

### 🔗 Related Issue

Closes #1 
