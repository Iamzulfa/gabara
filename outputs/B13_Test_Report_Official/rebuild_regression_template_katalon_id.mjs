import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "Gabara_LMS_Template_Pengujian_Regresi_Katalon_ID.xlsx");
const previewPath = path.join(__dirname, "preview_ringkasan_regression_template.png");

const branch = "testcase/pengujian-pl";
const commit = "7976574";
const preparedDate = "2026-06-07";
const environment = "Windows lokal; Laravel 12; React/Inertia; MySQL dbs_gabara_testing";

const workbook = Workbook.create();
const panduan = workbook.worksheets.add("Panduan");
const ringkasan = workbook.worksheets.add("Ringkasan");
const scope = workbook.worksheets.add("Ruang Lingkup");
const casesSheet = workbook.worksheets.add("Kasus Uji Regresi");
const trace = workbook.worksheets.add("Matriks Ketertelusuran");
const execLog = workbook.worksheets.add("Log Eksekusi");
const defectLog = workbook.worksheets.add("Log Cacat");
const lists = workbook.worksheets.add("Daftar Nilai");

const colors = {
  navy: "#17324D",
  blue: "#2563EB",
  teal: "#0F766E",
  green: "#16A34A",
  red: "#DC2626",
  amber: "#D97706",
  yellow: "#FACC15",
  gray: "#6B7280",
  lightBlue: "#EAF3FF",
  lightGreen: "#EAF7EF",
  lightRed: "#FDECEC",
  lightAmber: "#FFF7E6",
  header: "#1F4E79",
  border: "#D9E2EC",
};

function title(sheet, range, text, subtitle = "") {
  const [start, end] = range.split(":");
  const startCol = start.match(/[A-Z]+/)[0];
  const endCol = end.match(/[A-Z]+/)[0];
  const startRow = Number(start.match(/\d+/)[0]);
  const colCount = colToNumber(endCol) - colToNumber(startCol) + 1;
  const r = sheet.getRange(range);
  r.values = [Array.from({ length: colCount }, (_, index) => (index === 0 ? text : ""))];
  r.merge();
  r.format.fill = colors.navy;
  r.format.font = { color: "#FFFFFF", bold: true, size: 16 };
  r.format.wrapText = true;
  r.format.rowHeightPx = subtitle ? 52 : 38;
  if (subtitle) {
    const row = startRow + 1;
    const colRange = `${startCol}${row}:${endCol}${row}`;
    const s = sheet.getRange(colRange);
    s.values = [Array.from({ length: colCount }, (_, index) => (index === 0 ? subtitle : ""))];
    s.merge();
    s.format.fill = colors.lightBlue;
    s.format.font = { color: colors.navy, italic: true, size: 10 };
    s.format.wrapText = true;
  }
}

function styleTable(sheet, range, headerFill = colors.header) {
  const [start, end] = range.split(":");
  const startCol = start.match(/[A-Z]+/)[0];
  const startRow = Number(start.match(/\d+/)[0]);
  const endCol = end.match(/[A-Z]+/)[0];
  const used = sheet.getRange(range);
  used.format.borders = { preset: "all", style: "thin", color: colors.border };
  used.format.wrapText = true;
  const header = sheet.getRange(`${startCol}${startRow}:${endCol}${startRow}`);
  header.format.fill = headerFill;
  header.format.font = { color: "#FFFFFF", bold: true };
  header.format.rowHeightPx = 34;
}

function colToNumber(col) {
  return col.split("").reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
}

function setWidths(sheet, widths) {
  widths.forEach(([col, width]) => {
    sheet.getRange(`${col}:${col}`).format.columnWidth = width;
  });
}

function setFrozen(sheet, rows = 1, cols = 0) {
  if (rows) sheet.freezePanes.freezeRows(rows);
  if (cols) sheet.freezePanes.freezeColumns(cols);
}

const testCases = [
  [
    "REG-ENROLL-001",
    "Enrollment dengan token valid",
    "Memastikan siswa dapat enroll ke kelas publik/valid sesuai testcase lama.",
    "P1 Smoke Regression",
    "Enrollment Kelas",
    "Functionality / Regression",
    "Tinggi",
    "User siswa aktif; token kelas valid tersedia.",
    "Login sebagai siswa. Buka halaman enroll. Masukkan token valid. Kirim form enrollment.",
    "Token kelas valid",
    "Sistem mendaftarkan siswa ke kelas dan menampilkan pesan berhasil.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Selaras dengan testcase lama enrollment positif.",
  ],
  [
    "REG-ENROLL-002",
    "Enrollment dengan token tidak valid",
    "Memastikan token salah tidak dapat digunakan.",
    "P1 Smoke Regression",
    "Enrollment Kelas",
    "Negative Regression",
    "Tinggi",
    "User siswa aktif.",
    "Login sebagai siswa. Masukkan token acak/tidak terdaftar. Kirim form.",
    "Token tidak valid",
    "Sistem menolak enrollment dan menampilkan pesan token tidak valid.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Negative scenario dari testcase lama.",
  ],
  [
    "REG-ENROLL-003",
    "Enrollment kelas privat",
    "Memastikan kelas privat tidak dapat dimasuki melalui token publik.",
    "P1 Smoke Regression",
    "Enrollment Kelas",
    "Negative Regression",
    "Tinggi",
    "Kelas privat tersedia.",
    "Login sebagai siswa. Masukkan token kelas privat. Kirim form.",
    "Token kelas privat",
    "Sistem menolak enrollment kelas privat.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Melindungi aturan akses kelas privat.",
  ],
  [
    "REG-ENROLL-004",
    "Enrollment duplikat",
    "Memastikan siswa yang sudah terdaftar tidak terdaftar dua kali.",
    "P1 Smoke Regression",
    "Enrollment Kelas",
    "Negative Regression",
    "Tinggi",
    "Siswa sudah terdaftar pada kelas target.",
    "Login sebagai siswa yang sudah enroll. Masukkan token kelas yang sama. Kirim form.",
    "Token kelas yang sama",
    "Sistem menolak enrollment duplikat dengan pesan yang sesuai.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Menjaga integritas data enrollment.",
  ],
  [
    "REG-ENROLL-005",
    "Enrollment tanpa token",
    "Memastikan token wajib diisi.",
    "P1 Smoke Regression",
    "Enrollment Kelas",
    "Validation Regression",
    "Tinggi",
    "User siswa aktif.",
    "Login sebagai siswa. Kosongkan field token. Kirim form.",
    "Token kosong",
    "Validasi menolak input kosong.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Validasi input dasar.",
  ],
  [
    "REG-ASSIGN-001",
    "Submission tugas wajib file",
    "Memastikan submission tanpa file ditolak.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Validation Regression",
    "Tinggi",
    "Assignment aktif tersedia; siswa terdaftar.",
    "Login sebagai siswa. Buka detail tugas. Submit tanpa memilih file.",
    "File kosong",
    "Sistem mengembalikan error validasi file wajib.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Menguji validasi required pada upload tugas.",
  ],
  [
    "REG-ASSIGN-002",
    "Submission file 0 KB",
    "Memastikan file kosong tidak diterima.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Validation Regression",
    "Tinggi",
    "Assignment aktif tersedia.",
    "Upload file berukuran 0 KB pada form submission.",
    "File 0 KB",
    "Sistem menolak file kosong.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary file upload.",
  ],
  [
    "REG-ASSIGN-003",
    "Submission mime type tidak valid",
    "Memastikan tipe file yang tidak diizinkan ditolak.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Validation Regression",
    "Tinggi",
    "Assignment aktif tersedia.",
    "Upload file dengan ekstensi/tau MIME yang tidak diizinkan.",
    "File .exe atau file non dokumen",
    "Sistem menolak tipe file tersebut.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Negative scenario upload.",
  ],
  [
    "REG-ASSIGN-004",
    "Submission melewati batas ukuran",
    "Memastikan file di atas batas maksimum ditolak.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Validation Regression",
    "Tinggi",
    "Assignment aktif tersedia.",
    "Upload file berukuran lebih dari batas maksimum yang ditetapkan sistem.",
    "File > 15 MB",
    "Sistem menolak file karena ukuran melebihi batas.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary file size.",
  ],
  [
    "REG-ASSIGN-005",
    "Submission setelah deadline",
    "Memastikan tugas tidak dapat dikumpulkan setelah batas waktu.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Time Boundary Regression",
    "Tinggi",
    "Assignment memiliki due date yang sudah lewat.",
    "Login sebagai siswa. Buka tugas yang sudah lewat deadline. Coba submit file valid.",
    "File valid; deadline lampau",
    "Sistem menolak submission karena deadline berakhir.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Perbaikan parsing deadline MySQL ikut tercakup.",
  ],
  [
    "REG-ASSIGN-006",
    "Submission file valid",
    "Memastikan file valid dapat dikumpulkan.",
    "P1 Assignment Regression",
    "Assignment Submission",
    "Functionality / Regression",
    "Tinggi",
    "Assignment aktif dan belum deadline.",
    "Login sebagai siswa. Upload file PDF/DOCX valid. Submit.",
    "File valid",
    "Sistem menyimpan submission dan menampilkan pesan berhasil.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Positive scenario tugas.",
  ],
  [
    "REG-ASSIGN-007",
    "Update submission sebelum deadline",
    "Memastikan siswa dapat mengganti file sebelum deadline.",
    "P2 Assignment Regression",
    "Assignment Submission",
    "Functionality / Regression",
    "Sedang",
    "Submission awal sudah ada; deadline belum lewat.",
    "Login sebagai siswa. Buka submission. Upload file pengganti. Simpan.",
    "File pengganti valid",
    "Sistem mengganti file submission dan tetap menjaga histori data yang relevan.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Regression update data tugas.",
  ],
  [
    "REG-ASSIGN-008",
    "Nilai tugas kurang dari minimum",
    "Memastikan nilai negatif ditolak.",
    "P1 Assignment Regression",
    "Grading Assignment",
    "Validation Regression",
    "Tinggi",
    "Mentor/admin memiliki akses penilaian.",
    "Input nilai -1 pada submission siswa. Simpan penilaian.",
    "Nilai -1",
    "Sistem menolak nilai di bawah 0.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary scoring bawah.",
  ],
  [
    "REG-ASSIGN-009",
    "Nilai tugas lebih dari maksimum",
    "Memastikan nilai di atas 100 ditolak.",
    "P1 Assignment Regression",
    "Grading Assignment",
    "Validation Regression",
    "Tinggi",
    "Mentor/admin memiliki akses penilaian.",
    "Input nilai 101 pada submission siswa. Simpan penilaian.",
    "Nilai 101",
    "Sistem menolak nilai di atas 100.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary scoring atas.",
  ],
  [
    "REG-ASSIGN-010",
    "Nilai tugas valid 0",
    "Memastikan nilai 0 diterima sebagai nilai valid.",
    "P2 Assignment Regression",
    "Grading Assignment",
    "Boundary Regression",
    "Sedang",
    "Submission siswa tersedia.",
    "Input nilai 0 pada submission siswa. Simpan penilaian.",
    "Nilai 0",
    "Sistem menyimpan nilai 0 tanpa menganggapnya kosong.",
    "Belum dijalankan manual pada sesi ini.",
    environment,
    "Belum Dijalankan",
    "",
    "",
    "Kandidat Manual",
    "QA Gabara",
    "",
    "Direkomendasikan untuk manual confirmation bila UI membedakan 0 dan empty.",
  ],
  [
    "REG-ASSIGN-011",
    "Nilai tugas valid 100",
    "Memastikan nilai 100 diterima sebagai nilai maksimum.",
    "P2 Assignment Regression",
    "Grading Assignment",
    "Boundary Regression",
    "Sedang",
    "Submission siswa tersedia.",
    "Input nilai 100 pada submission siswa. Simpan penilaian.",
    "Nilai 100",
    "Sistem menyimpan nilai 100.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary scoring atas valid.",
  ],
  [
    "REG-QUIZ-001",
    "Quiz draft tidak dapat dikerjakan",
    "Memastikan quiz draft belum dapat diakses siswa.",
    "P1 Quiz Regression",
    "Quiz",
    "Access Control Regression",
    "Tinggi",
    "Quiz berstatus draft.",
    "Login sebagai siswa. Buka detail quiz draft. Klik mulai.",
    "Quiz draft",
    "Sistem menolak akses pengerjaan quiz draft.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Menguji aturan publikasi quiz.",
  ],
  [
    "REG-QUIZ-002",
    "Quiz sebelum waktu buka",
    "Memastikan quiz belum dapat dikerjakan sebelum open time.",
    "P1 Quiz Regression",
    "Quiz",
    "Time Boundary Regression",
    "Tinggi",
    "Quiz memiliki open time di masa depan.",
    "Login sebagai siswa. Coba mulai quiz sebelum waktunya.",
    "Open time masa depan",
    "Sistem menolak pengerjaan karena quiz belum dibuka.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary waktu quiz.",
  ],
  [
    "REG-QUIZ-003",
    "Quiz setelah waktu tutup",
    "Memastikan quiz tidak dapat dikerjakan setelah close time.",
    "P1 Quiz Regression",
    "Quiz",
    "Time Boundary Regression",
    "Tinggi",
    "Quiz memiliki close time yang sudah lewat.",
    "Login sebagai siswa. Coba mulai quiz setelah waktu tutup.",
    "Close time lampau",
    "Sistem menolak pengerjaan karena quiz sudah ditutup.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Boundary waktu quiz.",
  ],
  [
    "REG-QUIZ-004",
    "Quiz mencapai maksimum attempt",
    "Memastikan siswa tidak dapat melampaui batas attempt.",
    "P1 Quiz Regression",
    "Quiz Attempt",
    "Validation Regression",
    "Tinggi",
    "Siswa sudah memiliki jumlah attempt maksimum.",
    "Login sebagai siswa. Coba mulai attempt baru.",
    "Attempt maksimum terpenuhi",
    "Sistem menolak attempt tambahan.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Mencegah attempt berlebih.",
  ],
  [
    "REG-QUIZ-005",
    "Resume attempt in progress",
    "Memastikan attempt yang belum selesai dapat dilanjutkan.",
    "P1 Quiz Regression",
    "Quiz Attempt",
    "Functionality / Regression",
    "Tinggi",
    "Ada attempt quiz berstatus in_progress.",
    "Login sebagai siswa. Buka quiz yang punya attempt berjalan. Klik lanjutkan.",
    "Attempt in_progress",
    "Sistem membuka attempt yang sama tanpa membuat attempt baru.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Menjaga konsistensi attempt.",
  ],
  [
    "REG-QUIZ-006",
    "Skor quiz semua jawaban benar",
    "Memastikan perhitungan skor 100 ketika semua jawaban benar.",
    "P1 Quiz Regression",
    "Quiz Scoring",
    "Calculation Regression",
    "Tinggi",
    "Quiz berisi soal pilihan ganda dengan kunci jawaban.",
    "Kerjakan quiz dengan semua jawaban benar. Submit.",
    "Semua jawaban benar",
    "Sistem menghitung skor 100.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Calculation positive case.",
  ],
  [
    "REG-QUIZ-007",
    "Skor quiz semua jawaban salah",
    "Memastikan perhitungan skor 0 ketika semua jawaban salah.",
    "P1 Quiz Regression",
    "Quiz Scoring",
    "Calculation Regression",
    "Tinggi",
    "Quiz berisi soal pilihan ganda dengan kunci jawaban.",
    "Kerjakan quiz dengan semua jawaban salah. Submit.",
    "Semua jawaban salah",
    "Sistem menghitung skor 0.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Calculation negative case.",
  ],
  [
    "REG-QUIZ-008",
    "Jawaban essay null",
    "Memastikan jawaban essay kosong ditangani konsisten.",
    "P2 Quiz Regression",
    "Quiz Essay",
    "Validation Regression",
    "Sedang",
    "Quiz memiliki soal essay.",
    "Submit quiz dengan jawaban essay kosong.",
    "Jawaban essay kosong/null",
    "Sistem menyimpan atau menandai jawaban kosong sesuai aturan tanpa error.",
    "Lulus pada LegacyTestCaseAlignmentTest.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis",
    "QA Gabara",
    preparedDate,
    "Menutup edge case essay.",
  ],
  [
    "REG-QUIZ-009",
    "Siswa tidak terdaftar mengakses quiz kelas",
    "Memastikan user di luar kelas tidak dapat mengerjakan quiz.",
    "P2 Quiz Regression",
    "Quiz Access",
    "Access Control Regression",
    "Sedang",
    "User siswa aktif tetapi belum enroll pada kelas quiz.",
    "Login sebagai siswa tidak terdaftar. Buka URL quiz kelas. Coba mulai.",
    "User non-member kelas",
    "Sistem menolak akses quiz.",
    "Belum dijalankan manual pada sesi ini.",
    environment,
    "Belum Dijalankan",
    "",
    "",
    "Kandidat Manual",
    "QA Gabara",
    "",
    "Perlu verifikasi browser untuk memastikan UX error jelas.",
  ],
  [
    "REG-ROUTE-001",
    "Inventaris route aplikasi",
    "Memastikan route aplikasi dapat dilist tanpa error bootstrap.",
    "P1 Technical Regression",
    "Routing",
    "Smoke Regression",
    "Tinggi",
    "Dependency Composer tersedia.",
    "Jalankan php artisan route:list --except-vendor.",
    "Command route:list",
    "Daftar route tampil tanpa exception.",
    "68 route berhasil dilist.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis CLI",
    "QA Gabara",
    preparedDate,
    "Bukti bootstrap Laravel sehat.",
  ],
  [
    "REG-BUILD-001",
    "Build frontend production",
    "Memastikan asset frontend dapat dibuild.",
    "P1 Technical Regression",
    "Frontend Build",
    "Build Regression",
    "Tinggi",
    "Dependency npm tersedia.",
    "Jalankan npm.cmd run build.",
    "Vite production build",
    "Build selesai tanpa error.",
    "Lulus; 4061 modules transformed; build 8,73s; ada warning chunk besar.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis CLI",
    "QA Gabara",
    preparedDate,
    "Warning chunk dicatat di performance report.",
  ],
  [
    "REG-PERF-001",
    "Observasi ukuran bundle ClassDetail",
    "Mencatat risiko performance dari bundle besar pada build.",
    "P2 Technical Regression",
    "Frontend Performance",
    "Performance Regression",
    "Sedang",
    "Build production berhasil.",
    "Tinjau output build Vite dan ukuran gzip chunk utama.",
    "Output npm build",
    "Tidak ada error build; risiko ukuran bundle terdokumentasi.",
    "Lulus dengan catatan chunk ClassDetail 610,38 kB.",
    environment,
    "Lulus",
    "",
    "",
    "Otomatis CLI",
    "QA Gabara",
    preparedDate,
    "Perlu optimasi lanjutan bila target performa ketat.",
  ],
  [
    "REG-LINT-001",
    "Lint frontend",
    "Memastikan static analysis frontend berjalan.",
    "P2 Technical Regression",
    "Frontend Lint",
    "Static Analysis Regression",
    "Sedang",
    "Dependency npm tersedia.",
    "Jalankan npm.cmd run lint.",
    "ESLint config",
    "Lint selesai tanpa configuration error.",
    "Gagal: ConfigError plugin react-hooks didefinisikan ulang.",
    environment,
    "Gagal",
    "Sedang",
    "Tinggi",
    "Otomatis CLI",
    "QA Gabara",
    preparedDate,
    "Defect REG-02.",
  ],
  [
    "REG-FULL-001",
    "Full automated PHPUnit regression",
    "Memastikan seluruh suite otomatis backend bersih.",
    "P1 Technical Regression",
    "Automated Test Suite",
    "Regression Suite",
    "Tinggi",
    "Database MySQL testing tersedia.",
    "Jalankan php artisan test.",
    "Full PHPUnit suite",
    "Seluruh test lulus.",
    "Gagal: 30 passed, 13 failed pada test historis di luar alignment baru.",
    environment,
    "Gagal",
    "Tinggi",
    "Tinggi",
    "Otomatis CLI",
    "QA Gabara",
    preparedDate,
    "Defect REG-01.",
  ],
];

const executionRows = [
  ["2026-06-07", "php artisan test --filter=LegacyTestCaseAlignmentTest", "Lulus", "4 test, 60 assertion", "Suite alignment testcase lama berhasil dijalankan pada MySQL testing."],
  ["2026-06-07", "php artisan test", "Gagal", "30 passed, 13 failed", "Kegagalan berada pada test historis MeetingUnitTest, Auth/Profile, dan ProfileController::destroy."],
  ["2026-06-07", "php artisan route:list --except-vendor", "Lulus", "68 route", "Inventaris route dapat dibaca tanpa exception."],
  ["2026-06-07", "npm.cmd run build", "Lulus", "4061 modules transformed; 8,73s", "Build Vite sukses dengan catatan chunk ClassDetail melebihi 500 kB."],
  ["2026-06-07", "npm.cmd run lint", "Gagal", "ConfigError", "ESLint gagal karena plugin react-hooks didefinisikan ulang."],
];

const defectRows = [
  ["REG-01", "Full PHPUnit suite belum bersih", "Tinggi", "Tinggi", "Terbuka", "REG-FULL-001", "13 failed pada test historis.", "Sinkronkan test historis dengan implementasi Inertia/controller atau lengkapi method yang hilang."],
  ["REG-02", "ESLint ConfigError react-hooks", "Sedang", "Tinggi", "Terbuka", "REG-LINT-001", "Config (unnamed): Key plugins cannot redefine plugin react-hooks.", "Rapikan flat config ESLint agar plugin react-hooks hanya didefinisikan sekali."],
  ["REG-03", "Chunk ClassDetail besar", "Sedang", "Sedang", "Terbuka", "REG-PERF-001", "Chunk ClassDetail 610,38 kB sebelum gzip.", "Evaluasi dynamic import atau manual chunks untuk halaman detail kelas."],
  ["REG-04", "Warning metadata PHPUnit doc-comment", "Rendah", "Rendah", "Terbuka", "REG-FULL-001", "PHPUnit memberi warning metadata di doc-comment pada test lama.", "Migrasikan anotasi @test lama ke attribute PHPUnit modern bila perlu."],
];

const traceRows = [
  ["REQ-ENROLL", "Enrollment kelas", "REG-ENROLL-001, REG-ENROLL-002, REG-ENROLL-003, REG-ENROLL-004, REG-ENROLL-005", "Tercakup", "Lulus", "Menjaga akses siswa ke kelas dan validasi token."],
  ["REQ-ASSIGN", "Submission dan grading tugas", "REG-ASSIGN-001 s.d. REG-ASSIGN-011", "Tercakup sebagian", "Mayoritas Lulus", "Dua boundary manual direkomendasikan untuk konfirmasi UI."],
  ["REQ-QUIZ", "Quiz attempt dan scoring", "REG-QUIZ-001 s.d. REG-QUIZ-009", "Tercakup sebagian", "Mayoritas Lulus", "Satu access control manual direkomendasikan untuk verifikasi UX."],
  ["REQ-ROUTE", "Bootstrap route Laravel", "REG-ROUTE-001", "Tercakup", "Lulus", "Route list berhasil."],
  ["REQ-BUILD", "Build frontend", "REG-BUILD-001, REG-PERF-001", "Tercakup", "Lulus dengan catatan", "Build lulus; risiko bundle besar dicatat."],
  ["REQ-LINT", "Static analysis frontend", "REG-LINT-001", "Tercakup", "Gagal", "Perlu perbaikan konfigurasi ESLint."],
  ["REQ-FULL", "Full automated regression", "REG-FULL-001", "Tercakup", "Gagal", "Perlu pemeliharaan test historis."],
];

const scopeRows = [
  ["S-01", "Enrollment kelas", "Kode terkait enrollment disesuaikan dengan testcase lama.", "Tinggi", "Tinggi", "P1", "P1 Smoke Regression", "Ya", "Core workflow siswa."],
  ["S-02", "Assignment submission", "Validasi file, deadline, dan update submission.", "Tinggi", "Tinggi", "P1", "P1 Assignment Regression", "Ya", "Workflow pembelajaran utama."],
  ["S-03", "Quiz", "Attempt, time window, scoring, dan akses user.", "Tinggi", "Tinggi", "P1", "P1 Quiz Regression", "Ya", "Core evaluasi belajar."],
  ["S-04", "Route dan bootstrap", "Pemeriksaan CLI route list.", "Sedang", "Tinggi", "P1", "P1 Technical Regression", "Ya", "Smoke teknis aplikasi."],
  ["S-05", "Build frontend", "Vite production build dan ukuran asset.", "Sedang", "Sedang", "P2", "P2 Technical Regression", "Ya", "Quality gate sebelum demo/pengumpulan."],
  ["S-06", "Lint frontend", "ESLint config dan static analysis.", "Sedang", "Sedang", "P2", "P2 Technical Regression", "Ya", "Saat ini gagal dan masuk defect log."],
];

const validationLists = [
  ["Status Eksekusi", "Lulus", "Gagal", "Terblokir", "Belum Dijalankan", "Sedang Berjalan"],
  ["Prioritas", "Tinggi", "Sedang", "Rendah"],
  ["Keparahan", "Tinggi", "Sedang", "Rendah"],
  ["Status Otomatisasi", "Otomatis", "Otomatis CLI", "Kandidat Manual"],
  ["Status Cacat", "Terbuka", "Dalam Perbaikan", "Selesai", "Ditutup"],
];

const replacements = [
  ["Functionality / Regression", "Fungsional / Regresi"],
  ["Negative Regression", "Regresi Negatif"],
  ["Validation Regression", "Regresi Validasi"],
  ["Time Boundary Regression", "Regresi Batas Waktu"],
  ["Boundary Regression", "Regresi Batas Nilai"],
  ["Access Control Regression", "Regresi Kontrol Akses"],
  ["Calculation Regression", "Regresi Perhitungan"],
  ["Smoke Regression", "Regresi Inti"],
  ["Build Regression", "Regresi Build"],
  ["Performance Regression", "Regresi Performa"],
  ["Static Analysis Regression", "Regresi Analisis Statis"],
  ["Regression Suite", "Suite Regresi"],
  ["P1 Smoke Regression", "P1 Regresi Inti"],
  ["P1 Assignment Regression", "P1 Regresi Tugas"],
  ["P2 Assignment Regression", "P2 Regresi Tugas"],
  ["P1 Quiz Regression", "P1 Regresi Kuis"],
  ["P2 Quiz Regression", "P2 Regresi Kuis"],
  ["P1 Technical Regression", "P1 Regresi Teknis"],
  ["P2 Technical Regression", "P2 Regresi Teknis"],
  ["Negative scenario", "Skenario negatif"],
  ["Positive scenario", "Skenario positif"],
  ["manual confirmation", "konfirmasi manual"],
  ["Core workflow", "Alur utama"],
  ["quality gate", "gerbang mutu"],
  ["Defect", "Cacat"],
  ["defect", "cacat"],
  ["testcase", "kasus uji"],
  ["test case", "kasus uji"],
  ["Test Case", "Kasus Uji"],
  ["workflow", "alur kerja"],
  ["Boundary", "Batas"],
];

function localizeValue(value) {
  if (typeof value !== "string") return value;
  return replacements.reduce((current, [from, to]) => current.replaceAll(from, to), value);
}

function localizeRows(rows) {
  return rows.map((row) => row.map(localizeValue));
}

const localizedTestCases = localizeRows(testCases);
const localizedExecutionRows = localizeRows(executionRows);
const localizedDefectRows = localizeRows(defectRows);
const localizedTraceRows = localizeRows(traceRows);
const localizedScopeRows = localizeRows(scopeRows);

// Panduan
title(panduan, "A1:F1", "Panduan Workbook Pengujian Regresi Gabara LMS", "Struktur mengikuti praktik template Katalon: ruang lingkup/prioritas, kasus uji, ketertelusuran, log eksekusi, log cacat, dan ringkasan.");
panduan.getRange("A4:B16").values = [
  ["Atribut", "Nilai"],
  ["Nama proyek", "Gabara LMS - Garasi Belajar Banjarnegara"],
  ["Jenis pengujian", "Regression Testing"],
  ["Basis template", "Katalon Regression Testing Starter Kit dan Katalon Test Case Template, diterjemahkan ke Bahasa Indonesia"],
  ["Branch / Commit", `${branch} / ${commit}`],
  ["Lingkungan uji", environment],
  ["Basis data", "MySQL; database otomatis: dbs_gabara_testing"],
  ["Tanggal penyusunan", preparedDate],
  ["Status utama", "Penyelarasan kasus uji lama lulus; full PHPUnit dan lint masih memiliki cacat terbuka."],
  ["Catatan UAT", "Role mentah tester dikategorikan sebagai Murid/Siswa sesuai klarifikasi pengguna."],
  ["Sumber Katalon 1", "https://katalon.com/resources-center/blog/test-case-template-examples"],
  ["Sumber Katalon 2", "https://katalon.com/resources-center/blog/regression-testing-starter-kit-free-excel-template"],
  ["Sumber Katalon Docs", "https://docs.katalon.com/katalon-platform/create-tests/create-new-test-cases"],
];
styleTable(panduan, "A4:B16");
setWidths(panduan, [["A", 26], ["B", 92], ["C", 12], ["D", 12], ["E", 12], ["F", 12]]);
panduan.showGridLines = false;

// Lists
lists.getRange("A1:E1").values = [["Status Eksekusi", "Prioritas", "Severity", "Status Otomatisasi", "Status Defect"]];
validationLists.forEach((list, idx) => {
  const values = list.slice(1).map((v) => [v]);
  lists.getRangeByIndexes(1, idx, values.length, 1).values = values;
});
styleTable(lists, "A1:E6");
setWidths(lists, [["A", 24], ["B", 18], ["C", 18], ["D", 24], ["E", 20]]);
lists.showGridLines = false;

// Scope & Prioritas
title(scope, "A1:I1", "Ruang Lingkup & Prioritas Regresi", "Prioritas P1/P2/P3 membantu memilih suite seperti anjuran Katalon Regression Starter Kit.");
scope.getRange("A4:I4").values = [["ID Scope", "Area", "Pemicu Regresi", "Risiko Perubahan", "Dampak Bisnis", "Prioritas", "Suite Terpilih", "Dieksekusi", "Catatan"]];
scope.getRangeByIndexes(4, 0, scopeRows.length, scopeRows[0].length).values = localizedScopeRows;
styleTable(scope, `A4:I${4 + scopeRows.length}`);
scope.tables.add(`A4:I${4 + scopeRows.length}`, true, "ScopePrioritasTable");
setWidths(scope, [["A", 12], ["B", 24], ["C", 44], ["D", 18], ["E", 18], ["F", 12], ["G", 28], ["H", 12], ["I", 42]]);
setFrozen(scope, 4);
scope.showGridLines = false;

// Test Case Regresi
title(casesSheet, "A1:T1", "Kasus Uji Regresi Gabara LMS", "Kolom disusun dari komponen kasus uji Katalon: ID, deskripsi, prasyarat, langkah, input, hasil harapan/aktual, lingkungan, status, dan detail cacat.");
const headers = [
  "ID Kasus Uji",
  "Nama Kasus Uji",
  "Deskripsi",
  "Suite Regresi",
  "Modul/Fitur",
  "Tipe Uji",
  "Prioritas",
  "Prasyarat",
  "Langkah Uji",
  "Data Input",
  "Hasil yang Diharapkan",
  "Hasil Aktual",
  "Lingkungan Uji",
  "Status Eksekusi",
  "Tingkat Keparahan Cacat",
  "Prioritas Cacat",
  "Status Otomatisasi",
  "Tester",
  "Tanggal Eksekusi",
  "Catatan / Referensi",
];
casesSheet.getRange("A4:T4").values = [headers];
casesSheet.getRangeByIndexes(4, 0, testCases.length, headers.length).values = localizedTestCases;
styleTable(casesSheet, `A4:T${4 + testCases.length}`);
casesSheet.tables.add(`A4:T${4 + testCases.length}`, true, "TestCaseRegresiTable");
setWidths(casesSheet, [
  ["A", 18], ["B", 34], ["C", 44], ["D", 28], ["E", 24], ["F", 24], ["G", 14],
  ["H", 42], ["I", 56], ["J", 28], ["K", 50], ["L", 50], ["M", 42], ["N", 18],
  ["O", 22], ["P", 18], ["Q", 22], ["R", 18], ["S", 18], ["T", 48],
]);
setFrozen(casesSheet, 4, 2);
casesSheet.getRange(`N5:N${4 + testCases.length}`).dataValidation = { rule: { type: "list", values: ["Lulus", "Gagal", "Terblokir", "Belum Dijalankan", "Sedang Berjalan"] } };
casesSheet.getRange(`G5:G${4 + testCases.length}`).dataValidation = { rule: { type: "list", values: ["Tinggi", "Sedang", "Rendah"] } };
casesSheet.getRange(`O5:P${4 + testCases.length}`).dataValidation = { rule: { type: "list", values: ["Tinggi", "Sedang", "Rendah"] } };
casesSheet.getRange(`Q5:Q${4 + testCases.length}`).dataValidation = { rule: { type: "list", values: ["Otomatis", "Otomatis CLI", "Kandidat Manual"] } };
casesSheet.getRange(`N5:N${4 + testCases.length}`).conditionalFormats.add("containsText", { text: "Lulus", format: { fill: { color: colors.lightGreen }, font: { color: colors.green, bold: true } } });
casesSheet.getRange(`N5:N${4 + testCases.length}`).conditionalFormats.add("containsText", { text: "Gagal", format: { fill: { color: colors.lightRed }, font: { color: colors.red, bold: true } } });
casesSheet.getRange(`N5:N${4 + testCases.length}`).conditionalFormats.add("containsText", { text: "Belum Dijalankan", format: { fill: { color: colors.lightAmber }, font: { color: colors.amber, bold: true } } });
casesSheet.showGridLines = false;

// Execution Log
title(execLog, "A1:E1", "Log Eksekusi", "Mencatat perintah, status, hasil ringkas, dan catatan eksekusi aktual pada branch saat ini.");
execLog.getRange("A4:E4").values = [["Tanggal", "Aktivitas / Perintah", "Status", "Hasil Ringkas", "Catatan"]];
execLog.getRangeByIndexes(4, 0, executionRows.length, executionRows[0].length).values = localizedExecutionRows;
styleTable(execLog, `A4:E${4 + executionRows.length}`);
execLog.tables.add(`A4:E${4 + executionRows.length}`, true, "LogEksekusiTable");
setWidths(execLog, [["A", 16], ["B", 48], ["C", 16], ["D", 32], ["E", 70]]);
execLog.getRange(`C5:C${4 + executionRows.length}`).conditionalFormats.add("containsText", { text: "Lulus", format: { fill: { color: colors.lightGreen }, font: { color: colors.green, bold: true } } });
execLog.getRange(`C5:C${4 + executionRows.length}`).conditionalFormats.add("containsText", { text: "Gagal", format: { fill: { color: colors.lightRed }, font: { color: colors.red, bold: true } } });
setFrozen(execLog, 4);
execLog.showGridLines = false;

// Defect Log
title(defectLog, "A1:H1", "Log Cacat", "Cacat ditautkan ke kasus uji yang menemukannya agar ketertelusuran tetap jelas.");
defectLog.getRange("A4:H4").values = [["ID Cacat", "Judul", "Keparahan", "Prioritas", "Status", "Kasus Uji Terkait", "Bukti", "Rekomendasi Perbaikan"]];
defectLog.getRangeByIndexes(4, 0, defectRows.length, defectRows[0].length).values = localizedDefectRows;
styleTable(defectLog, `A4:H${4 + defectRows.length}`);
defectLog.tables.add(`A4:H${4 + defectRows.length}`, true, "LogDefectTable");
setWidths(defectLog, [["A", 14], ["B", 36], ["C", 14], ["D", 14], ["E", 18], ["F", 24], ["G", 48], ["H", 64]]);
defectLog.getRange(`E5:E${4 + defectRows.length}`).dataValidation = { rule: { type: "list", values: ["Terbuka", "Dalam Perbaikan", "Selesai", "Ditutup"] } };
defectLog.getRange(`C5:D${4 + defectRows.length}`).dataValidation = { rule: { type: "list", values: ["Tinggi", "Sedang", "Rendah"] } };
defectLog.getRange(`C5:D${4 + defectRows.length}`).conditionalFormats.add("containsText", { text: "Tinggi", format: { fill: { color: colors.lightRed }, font: { color: colors.red, bold: true } } });
defectLog.getRange(`C5:D${4 + defectRows.length}`).conditionalFormats.add("containsText", { text: "Sedang", format: { fill: { color: colors.lightAmber }, font: { color: colors.amber, bold: true } } });
setFrozen(defectLog, 4);
defectLog.showGridLines = false;

// Traceability
title(trace, "A1:F1", "Matriks Ketertelusuran", "Menghubungkan kebutuhan/area bisnis ke kasus uji, hasil eksekusi, dan catatan risiko.");
trace.getRange("A4:F4").values = [["ID Kebutuhan", "Area/Fitur", "Kasus Uji Terkait", "Cakupan", "Status Hasil", "Catatan"]];
trace.getRangeByIndexes(4, 0, traceRows.length, traceRows[0].length).values = localizedTraceRows;
styleTable(trace, `A4:F${4 + traceRows.length}`);
trace.tables.add(`A4:F${4 + traceRows.length}`, true, "MatriksTraceabilityTable");
setWidths(trace, [["A", 18], ["B", 30], ["C", 74], ["D", 20], ["E", 22], ["F", 58]]);
setFrozen(trace, 4);
trace.showGridLines = false;

// Ringkasan
title(ringkasan, "A1:H1", "Ringkasan Pengujian Regresi", "Ringkasan status kasus uji, cacat, cakupan otomatisasi, dan kualitas eksekusi.");
ringkasan.getRange("A4:B14").values = [
  ["Metrik", "Nilai"],
  ["Total Kasus Uji", ""],
  ["Lulus", ""],
  ["Gagal", ""],
  ["Terblokir", ""],
  ["Belum Dijalankan", ""],
  ["Sedang Berjalan", ""],
  ["Tingkat Kelulusan Eksekusi", ""],
  ["Cakupan Otomatisasi", ""],
  ["Cacat Terbuka", ""],
  ["Cacat Prioritas Tinggi", ""],
];
ringkasan.getRange("B5:B14").formulas = [
  ["=COUNTA('Kasus Uji Regresi'!A5:A200)"],
  ["=COUNTIF('Kasus Uji Regresi'!N5:N200,\"Lulus\")"],
  ["=COUNTIF('Kasus Uji Regresi'!N5:N200,\"Gagal\")"],
  ["=COUNTIF('Kasus Uji Regresi'!N5:N200,\"Terblokir\")"],
  ["=COUNTIF('Kasus Uji Regresi'!N5:N200,\"Belum Dijalankan\")"],
  ["=COUNTIF('Kasus Uji Regresi'!N5:N200,\"Sedang Berjalan\")"],
  ["=IF((B6+B7+B8)=0,0,B6/(B6+B7+B8))"],
  ["=IF(B5=0,0,(COUNTIF('Kasus Uji Regresi'!Q5:Q200,\"Otomatis\")+COUNTIF('Kasus Uji Regresi'!Q5:Q200,\"Otomatis CLI\"))/B5)"],
  ["=COUNTIF('Log Cacat'!E5:E100,\"Terbuka\")"],
  ["=COUNTIFS('Log Cacat'!D5:D100,\"Tinggi\",'Log Cacat'!E5:E100,\"Terbuka\")"],
];
ringkasan.getRange("A17:C21").values = [
  ["Status", "Jumlah", "Warna"],
  ["Lulus", "", "Hijau"],
  ["Gagal", "", "Merah"],
  ["Terblokir", "", "Kuning"],
  ["Belum Dijalankan", "", "Amber"],
];
ringkasan.getRange("B18:B21").formulas = [
  ["=B6"],
  ["=B7"],
  ["=B8"],
  ["=B9"],
];
ringkasan.getRange("E4:H12").values = [
  ["Konteks Eksekusi", "", "", ""],
  ["Branch", branch, "", ""],
  ["Commit", commit, "", ""],
  ["Database", "MySQL dbs_gabara_testing", "", ""],
  ["Tanggal", preparedDate, "", ""],
  ["Status Kunci", "Penyelarasan kasus uji lama lulus; lint dan full PHPUnit masih memiliki cacat terbuka.", "", ""],
  ["Basis Templat", "Katalon regression starter kit: ruang lingkup, ketertelusuran, log eksekusi, log cacat, ringkasan.", "", ""],
  ["Catatan", "Workbook ini sudah dalam Bahasa Indonesia.", "", ""],
  ["", "", "", ""],
];
styleTable(ringkasan, "A4:B14");
styleTable(ringkasan, "A17:C21");
styleTable(ringkasan, "E4:H12", colors.teal);
ringkasan.getRange("B11:B12").setNumberFormat("0.0%");
ringkasan.getRange("B13:B14").setNumberFormat("0");
ringkasan.getRange("B7").conditionalFormats.add("cellIs", { operator: "greaterThan", formula: 0, format: { fill: { color: colors.lightRed }, font: { color: colors.red, bold: true } } });
ringkasan.getRange("B6").conditionalFormats.add("cellIs", { operator: "greaterThan", formula: 0, format: { fill: { color: colors.lightGreen }, font: { color: colors.green, bold: true } } });
const chart = ringkasan.charts.add("bar", ringkasan.getRange("A17:B21"));
chart.title = "Distribusi Status Eksekusi";
chart.hasLegend = false;
chart.xAxis = { axisType: "textAxis" };
chart.yAxis = { numberFormatCode: "0" };
chart.setPosition("E15", "H31");
setWidths(ringkasan, [["A", 34], ["B", 20], ["C", 16], ["D", 4], ["E", 24], ["F", 32], ["G", 16], ["H", 16]]);
ringkasan.showGridLines = false;

for (const sheet of [panduan, ringkasan, scope, casesSheet, trace, execLog, defectLog, lists]) {
  const used = sheet.getUsedRange();
  used.format.wrapText = true;
  used.format.verticalAlignment = "Top";
}

const preview = await workbook.render({ sheetName: "Ringkasan", autoCrop: "all", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);

console.log(outputPath);
