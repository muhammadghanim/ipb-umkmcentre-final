# 🍃 IPB Food Hub - Pre-Order Makanan UMKM

**IPB Food Hub** adalah sebuah sistem manajemen *pre-order* makanan inovatif yang dirancang khusus untuk menghubungkan mahasiswa IPB University dengan UMKM dan kantin di sekitar ekosistem kampus. 

Aplikasi ini bertujuan untuk mengurai antrean panjang di kantin pada jam makan siang dan mendigitalisasi pengelolaan inventori bagi para mitra UMKM lokal.

---

## ✨ Fitur Utama
* **🛒 Smart Cart & Checkout:** Mahasiswa dapat memesan makanan dari berbagai kantin dalam satu platform.
* **🏷️ Kupon & Flash Sale:** Dukungan sistem diskon dan *flash sale* cerdas berdasarkan jam makan siang.
* **📦 Seller Dashboard:** Panel khusus UMKM untuk memantau pesanan masuk secara *real-time*.
* **📊 Inventory Management:** Manajemen stok produk dan SKU yang mudah digunakan oleh penjual.
* **🔍 Semantic Search & Filter:** Pencarian cerdas untuk mempermudah mahasiswa menemukan menu favorit.

---

## 🛠️ Tech Stack
Aplikasi ini dibangun menggunakan arsitektur *Fullstack* modern untuk memastikan performa yang cepat dan skalabilitas tinggi.
* **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **Backend:** Python, FastAPI, SQLAlchemy
* **Database:** PostgreSQL (Cloud deployment via Supabase)

---

## ⚙️ Prasyarat
Sebelum menjalankan project ini di komputermu, pastikan kamu sudah menginstal perangkat lunak berikut:
- [Node.js](https://nodejs.org/) (Versi 16 atau lebih baru)
- [Python](https://www.python.org/downloads/) (Versi 3.9 atau lebih baru)
- [Git](https://git-scm.com/)

---

## 🚀 Panduan Instalasi Lokal

### 1. Clone Repository
Langkah pertama, *clone* repositori ini ke komputer lokal kamu:
```bash
git clone [https://github.com/bianglalametro/IPB-UMKMcentre.git](https://github.com/bianglalametro/IPB-UMKMcentre.git)
cd IPB-UMKMcentre
```

### 2. Setup Database & Environment Variables (.env)
Karena aplikasi ini menggunakan Supabase, kamu perlu mengatur variabel *environment*.
1. Buat file bernama `.env` di dalam folder `backend/`.
2. Isi dengan kredensial database Supabase milikmu (hubungi administrator repositori jika kamu tidak memiliki aksesnya).

### 3. Menjalankan Backend (FastAPI)
Buka terminal baru untuk menjalankan *server* Python.
```bash
# Masuk ke folder backend
cd backend

# Buat Virtual Environment (Sangat direkomendasikan)
python -m venv venv

# Aktifkan Virtual Environment
# Untuk Mac/Linux:
source venv/bin/activate 
# Untuk Windows:
venv\Scripts\activate

# Install semua dependensi
pip install -r requirements.txt

# Jalankan Server FastAPI
uvicorn main:app --reload
```
*Server API sekarang berjalan di `http://localhost:8000`.*
*Cek Dokumentasi API interaktif di: `http://localhost:8000/docs`*

### 4. Menjalankan Frontend (React/Vite)
Buka tab terminal baru (biarkan terminal backend tetap berjalan).
```bash
# Masuk ke folder frontend (jika kodemu ada di dalam folder terpisah, misal 'frontend')
# Jika frontend berada di root folder, lewati langkah 'cd' ini.
# cd frontend 

# Install dependensi Node.js
npm install

# Jalankan server development Vite
npm run dev
```
*Aplikasi frontend sekarang dapat diakses melalui browser di `http://localhost:3000` (atau port yang diberikan oleh Vite).*

---

## 👥 Kontributor
Dibuat dengan ❤️ untuk mahasiswa IPB University.
* **Sistem Informasi / Ilmu Komputer IPB** - *Analisis dan Desain Sistem Project 2026*
* **Ilmu Komputer IPB** - *Analisis Desain Sistem Project 2026*
