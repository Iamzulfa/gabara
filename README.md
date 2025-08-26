# Garasi Belajar Banjarnegara

Gabara adalah sebuah website Learning Management System (LMS) yang dirancang untuk memfasilitasi pendidikan bagi individu yang putus sekolah dari tingkat SD hingga SMA. Platform ini menyediakan lingkungan belajar yang interaktif dan terstruktur dengan tujuan membantu pengguna melanjutkan pendidikan mereka secara mandiri atau dengan bimbingan mentor.

## Tech Stack

Proyek Gabara dibangun menggunakan teknologi berikut:

-   **Laravel 12**: Framework PHP untuk backend development.
-   **React 19**: Library JavaScript untuk membangun antarmuka pengguna yang dinamis.
-   **Inertia.js**: Menghubungkan Laravel dan React untuk pengalaman pengembangan modern tanpa API penuh.
-   **MySQL**: Database relasional untuk menyimpan data pengguna, kursus, dan lainnya.
-   **Breeze**: Paket autentikasi Laravel untuk fitur login, register, verifikasi email, lupa kata sandi, dan ubah kata sandi.
-   **Spatie**: Paket Laravel untuk manajemen peran (role) dan izin (permission).
-   **Cloudinary**: Layanan penyimpanan cloud untuk mengelola aset media seperti gambar dan video.

## Fitur Utama

1. **Homepage**:
    - Halaman pengenalan proyek Gabara.
    - Tombol Call-to-Action (CTA) untuk mengarahkan pengguna ke proses pendaftaran atau login.
2. **Role Pengguna**:
    - **Student**: Pengguna yang belajar melalui platform, memiliki akses ke materi dan fitur pembelajaran.
    - **Mentor**: Pengguna yang membimbing siswa, memiliki akses ke alat pengajaran dan manajemen siswa.
    - **Admin**: Pengguna dengan akses penuh untuk mengelola platform, termasuk pengguna, konten, dan pengaturan sistem.
3. **Fitur Autentikasi**:
    - Login dan registrasi pengguna.
    - Verifikasi email untuk keamanan akun.
    - Fitur lupa kata sandi dan ubah kata sandi.
4. **Manajemen Role**:
    - Pengelolaan peran dan izin menggunakan paket Spatie.
5. **Dashboard**:
    - Layout dashboard untuk semua role (Student, Mentor, Admin).
    - Fitur pembaruan profil, termasuk ubah kata sandi untuk semua role.
6. **User Seeder**:
    - Data pengguna awal telah disiapkan untuk mempermudah pengujian autentikasi.

## Langkah-Langkah Fork Repository

Untuk berkontribusi pada proyek ini, Anda dapat melakukan fork repository terlebih dahulu. Berikut adalah langkah-langkahnya:

1. **Kunjungi Repository di GitHub**
    - Buka halaman repository Gabara di GitHub: `https://github.com/irsyamokta/gabara`.
2. **Fork Repository**
    - Klik tombol **Fork** di pojok kanan atas halaman repository.
    - Pilih akun atau organisasi tempat Anda ingin menyimpan fork.
3. **Clone Forked Repository**
    - Salin URL fork Anda dan clone ke lokal:
        ```bash
        git clone <URL_FORK_ANDA>
        cd gabara
        ```
4. **Tambahkan Upstream Repository**
    - Tambahkan repository asli sebagai upstream untuk tetap mendapatkan pembaruan:
        ```bash
        git remote add upstream <URL_REPOSITORY_ASLI>
        ```
5. **Buat Branch untuk Perubahan**
    - Buat branch baru untuk perubahan Anda:
        ```bash
        git checkout -b <NAMA_BRANCH_ANDA>
        ```
6. **Lakukan Perubahan dan Commit**
    - Lakukan perubahan pada kode, kemudian commit:
        ```bash
        git add .
        git commit -m "Deskripsi perubahan Anda"
        ```
7. **Push ke Fork Anda**
    - Push perubahan ke fork Anda di GitHub:
        ```bash
        git push origin <NAMA_BRANCH_ANDA>
        ```
8. **Buat Pull Request**
    - Buka fork Anda di GitHub, lalu klik **Compare & pull request**.
    - Isi deskripsi pull request dan kirim untuk ditinjau.

## Langkah-Langkah Instalasi

Berikut adalah panduan untuk mengatur dan menjalankan proyek Gabara di lingkungan lokal Anda:

### Prasyarat

-   PHP >= 8.3
-   Composer
-   Node.js >= 18.x
-   MySQL
-   Akun Cloudinary (untuk penyimpanan media)
-   Git

### Langkah Instalasi

1.  **Clone Repository**

    ```bash
    git clone <URL_FORK_ANDA>
    cd gabara
    ```

2.  **Instal Dependensi PHP**

    ```bash
    composer install
    ```

3.  **Instal Dependensi JavaScript**

    ```bash
    npm install
    ```

4.  **Konfigurasi Environment**

    -   Salin file `.env.example` menjadi `.env`:
        ```bash
        cp .env.example .env
        ```
    -   Sesuaikan konfigurasi database dan Cloudinary di file `.env`:
        ```env
        DB_CONNECTION=mysql
        DB_HOST=127.0.0.1
        DB_PORT=3306
        DB_DATABASE=db_gabara
        DB_USERNAME=root
        DB_PASSWORD=

        CLOUDINARY_KEY=
        CLOUDINARY_SECRET=
        CLOUDINARY_CLOUD_NAME=
        CLOUDINARY_URL=
        CLOUDINARY_UPLOAD_PRESET=
        CLOUDINARY_NOTIFICATION_URL=

        ```

5.  **Generate Application Key**

    ```bash
    php artisan key:generate
    ```

6.  **Migrasi Database dan Seed Data**

    ```bash
    php artisan migrate --seed
    ```

7.  **Kompilasi Aset Frontend**

    ```bash
    npm run dev
    ```

8.  **Jalankan Server Lokal**

    ```bash
    php artisan serve --host=localhost
    ```

9.  **Akses Aplikasi**
    - Buka browser dan kunjungi `http://localhost:8000`.

### Catatan Tambahan

-   Pastikan Anda memiliki koneksi internet untuk mengakses layanan Cloudinary.
-   Jika Anda ingin menggunakan data seeder untuk pengujian, pastikan untuk memeriksa file seeder di direktori `database/seeders`.
-   Untuk pengembangan lebih lanjut, pastikan untuk menjalankan `npm run dev` setiap kali ada perubahan pada file React.

## File yang Tidak Boleh Di-Push ke GitHub

Untuk menjaga keamanan dan integritas proyek, beberapa file tidak boleh di-push ke repository GitHub. Pastikan file-file berikut sudah ditambahkan ke `.gitignore`:

-   **File `.env`**: Berisi informasi sensitif seperti kunci API Cloudinary, kredensial database, dan kunci aplikasi Laravel.
-   **Direktori `vendor/`**: Berisi dependensi Composer yang dapat diinstal ulang dengan `composer install`.
-   **Direktori `node_modules/`**: Berisi dependensi Node.js yang dapat diinstal ulang dengan `npm install`.
-   **File Cache dan Log**:
    -   `storage/logs/*`: File log aplikasi.
    -   `storage/framework/cache/*`: File cache Laravel.
    -   `storage/framework/sessions/*`: File sesi pengguna.
    -   `storage/framework/views/*`: File tampilan yang di-cache.
-   **File Konfigurasi Sensitif**:
    -   File apa pun yang berisi kredensial atau informasi sensitif lainnya, seperti file konfigurasi khusus untuk lingkungan lokal.

Pastikan untuk memeriksa `.gitignore` sebelum melakukan commit untuk memastikan file-file di atas tidak di-push.

## Kontribusi

Jika Anda ingin berkontribusi pada proyek ini, silakan buat _pull request_ dengan perubahan yang diusulkan. Pastikan untuk mengikuti pedoman kode yang ada dan menjalankan pengujian sebelum mengirimkan perubahan.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
