

# 🍃 IPB Food Hub - Pre-Order Makanan UMKM

Sistem manajemen *pre-order* makanan untuk menghubungkan mahasiswa IPB dengan UMKM/Kantin kampus. Aplikasi ini dibangun menggunakan arsitektur *Fullstack* modern.

* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Backend:** Python, FastAPI, SQLAlchemy
* **Database:** PostgreSQL (Cloud via Supabase)

---

## ⚙️ Prasyarat
Sebelum menjalankan project ini di lokal, pastikan laptop kamu sudah terinstall:
- [Node.js](https://nodejs.org/) (v16 atau lebih baru)
- [Python](https://www.python.org/downloads/) (v3.9 atau lebih baru)
- [Git](https://git-scm.com/)

---

## 🚀 Cara Menjalankan Project Secara Lokal

### 1. Clone Repository & Setup Environment Variable
Pertama, *clone* repository ini ke lokal kamu dan masuk ke dalam foldernya.

```bash
git clone [https://github.com/bianglalametro/IPB-UMKMcentre.git](https://github.com/bianglalametro/IPB-UMKMcentre.git)
cd IPB-UMKMcentre

## Cara Menjalankan Secara Lokal (backend)
1. **Buka terminal dan arahkan ke root folder.**
2. **Buat Virtual Environment (Opsional namun direkomendasikan):**
   ```bash
   python -m venv venv
   source venv/bin/activate # (Untuk Mac/Linux)
   venv\\Scripts\\activate    # (Untuk Windows)
   ```
3. **Install Dependensi:**
   ```bash
   pip install -r backend/requirements.txt
   ```
4. **Jalankan Server FastAPI:**
   ```bash
   uvicorn backend.main:app --reload
   ```
5. **Akses API Documentation:**
   Buka browser dan navigasi ke: [http://localhost:8000/docs](http://localhost:8000/docs)

## Cara Menjalankan Secara Lokal (frontend)
1. npm install
2. npm run dev

