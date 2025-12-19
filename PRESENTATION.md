# Materi Presentasi: Windows Explorer Clone

## Windows Explorer dengan Tech Stack Modern (Bun + Elysia + Vue 3)

---

### 1. Pendahuluan (Introduction)

**Judul Project:** Windows Explorer Web Clone
**Tujuan:** Membuat replika Windows Explorer berbasis web yang cepat, responsif, dan scalable dengan User Experience (UX) setara aplikasi Desktop Native.

**Visi:**
Bukan hanya sekadar menampilkan file, tapi memberikan pengalaman **"Terasa Nyata"** (Native Feel).

- Klik kanan muncul menu instan.
- Rename langsung di tempat.
- Navigasi folder tanpa reload (SPA).

---

### 2. Teknologi yang Digunakan (The Tech Stack)

Kami memilih teknologi "Ferrari" untuk project ini:

- **Bun (Runtime):** Kinerja tinggi untuk JavaScript, startup time hampir instan.
- **Elysia (Backend Framework):** Framework backend tercepat untuk Bun, menangani request dengan overhead minimal.
- **Vue 3 + Vite (Frontend):**
  - **Composition API:** Untuk _Logic Reuse_ yang bersih (lihat `useExplorer.ts`).
  - **V-Model & Reactivity:** Sinkronisasi state instan antar komponen.
- **PostgreSQL + Drizzle ORM:** Database relasional dengan akses data Type-Safe.

---

### 3. Arsitektur Kode (Clean Architecture)

Kami menggunakan pola **Clean Architecture** untuk memisahkan tanggung jawab (Separation of Concerns):

1.  **Controller Layer (Pelayan)** `folders.controller.ts`:
    - Menerima request HTTP.
    - Validasi input.
2.  **Service Layer (Koki)** `folder.service.ts`:
    - Logika bisnis utama.
    - Algoritma transformasi _Flat-to-Tree_.
3.  **Repository Layer (Gudang)** `folder.repository.ts`:
    - Interaksi langsung dengan Database.

**Highlight Arsitektur Frontend (`useExplorer.ts`):**
Kami menggunakan pola **Composable Global State**.

- Status aplikasi (Tab aktif, Folder terpilih, Breadcrumb) disimpan secara _terpusat_.
- Efek: Saat folder dihapus di Panel Kanan, **Sidebar Kiri** otomatis tahu dan menghapusnya juga tanpa perlu refresh halaman.

---

### 4. Tantangan Teknis & Solusi Cerdas

#### A. Algoritma Tree Building O(n)

Mengubah data flat dari database menjadi pohon hierarki bisa lambat (O(n²)). Kami mengoptimalkannya menjadi **O(n)** menggunakan **Hash Map Reference**, sehingga ribuan folder bisa dimuat dalam hitungan milidetik.

#### B. Optimistic UI Updates

Agar aplikasi terasa "Instan", kami menerapkan **Optimistic UI**:

- Saat user me-rename folder, nama berubah **seketika** di layar sebelum server merespon.
- Jika server gagal, aplikasi otomatis me-revert perubahan.
- _Hasil:_ UX yang sangat responsif tanpa delay jaringan.

#### C. Navigasi & Sinkronisasi Jalur (Breadcrumb Healing)

Salah satu fitur tercanggih kami adalah **Auto-Path Discovery**.

- Walaupun user masuk ke sub-folder terdalam melalui Search, aplikasi otomatis melacak "Siapa induk saya?" secara rekursif ke atas (`findNode` global helper).
- Ini memperbaiki masalah umum "Broken Breadcrumbs" pada aplikasi web file manager.

---

### 5. Fitur Unggulan (Demo Highlights)

1.  **Full Inline Renaming:**

    - Rename folder langsung di Sidebar atau Grid View.
    - Menggunakan _Dual-State Binding_ (`renamingValue`) untuk memastikan data tersimpan akurat ke database.

2.  **Global Synchronization:**

    - Hapus folder di kanan -> Hilang di kiri.
    - Buat folder baru -> Muncul di kiri.

3.  **Context Menu Native-Like:**

    - Klik kanan custom dengan menu Copy, Cut, Paste, Rename, Delete.
    - Posisi menu cerdas (tidak keluar layar).

4.  **Split Pane Resizable:**
    - Sidebar bisa ditarik lebar/sempit sesuai kebutuhan user.

---

### 6. Kesimpulan

Aplikasi ini mendemonstrasikan kemampuan **Full Stack Development** tingkat lanjut:

1.  **Backend Efficiency:** Struktur data & Algoritma yang efisien.
2.  **Frontend Mastery:** Manajemen State kompleks (Vue Reactivity) dan UX Design.
3.  **Robustness:** Penanganan Error, Sinkronisasi Data, dan Skabilitas.

Siap untuk tahap selanjutnya! 🚀
