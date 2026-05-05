# Pre-Order Makanan UMKM - Python FastAPI Backend

Anda telah berhasil mengenerate kode backend berbasis **Python (FastAPI) & PostgreSQL** menggunakan arsitektur 3 lapis (Domain, Repository, Controller).

## Prasyarat
- Python 3.9+
- PostgreSQL (Opsional, jika tidak ada akan fallback ke SQLite secara otomatis)

## Cara Menjalankan Secara Lokal

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
