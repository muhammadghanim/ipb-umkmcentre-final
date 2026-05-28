# 🚀 Deployment Guide: Railway (Backend) + Vercel (Frontend)

## Overview
- **Backend**: FastAPI di Railway
- **Frontend**: React + Vite di Vercel
- **Database**: PostgreSQL di Railway

---

## 📋 BACKEND DEPLOYMENT (Railway)

### Step 1: Persiapkan Backend Repository

Pastikan struktur folder:
```
backend/
├── __init__.py
├── main.py
├── database.py
├── Procfile ✓ (sudah diperbaiki)
├── requirements.txt ✓
├── .env.production
├── controller/
├── domain/
├── repository/
└── uploads/
```

**File penting:**
- `Procfile`: `web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.main:app` ✓
- `requirements.txt`: Sudah include gunicorn, uvicorn, fastapi, psycopg2-binary ✓

### Step 2: Setup PostgreSQL di Railway

1. Di Railway dashboard, klik **+ New**
2. Pilih **Database** → **PostgreSQL**
3. Ambil connection string dari Railway
4. Format: `postgresql://user:password@host:port/database_name`

### Step 3: Deploy Backend ke Railway

1. **Connect Repository**
   - Railway: Settings → Source → Connect GitHub
   - Pilih repository IPB-UMKMcentre

2. **Configure Deployment**
   - Root Directory: `/backend`
   - Build Command: (kosongkan atau `pip install -r requirements.txt`)
   - Start Command: Sudah di Procfile

3. **Set Environment Variables di Railway**
   ```
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   SECRET_KEY=generate-random-key-with-32-chars
   ALLOWED_ORIGINS=https://your-vercel-url.vercel.app,https://domain.com
   ```

### Step 4: Verify Backend Deployment

- Kunjungi: `https://your-backend-railway-url.up.railway.app/docs`
- Harusnya tampil Swagger documentation

---

## 🎨 FRONTEND DEPLOYMENT (Vercel)

### Step 1: Persiapkan Frontend

Pastikan file sudah ada:
```
├── package.json ✓
├── vite.config.ts ✓
├── vercel.json ✓ (sudah dibuat)
├── .env.production ✓ (sudah dibuat)
├── tsconfig.json ✓
├── index.html ✓
└── src/
    ├── services/api.ts ✓ (sudah update)
    └── ...
```

### Step 2: Update Frontend untuk Production

File `src/services/api.ts` sudah menggunakan:
```typescript
baseURL: process.env.VITE_API_URL || 'http://localhost:8000'
```

### Step 3: Deploy Frontend ke Vercel

1. **Login ke Vercel**
   - https://vercel.com/dashboard

2. **Import Project**
   - Klik "Add New" → "Project"
   - Pilih GitHub repository: `IPB-UMKMcentre`

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `.` (root)
   - Build Command: `npm run build` ✓ (Vercel auto-detect)
   - Output Directory: `dist` ✓

4. **Set Environment Variables di Vercel**
   ```
   VITE_API_URL=https://your-backend-railway-url.up.railway.app
   VITE_GEMINI_API_KEY=your-gemini-api-key-if-any
   ```

5. **Deploy**
   - Klik Deploy
   - Tunggu build selesai (~2-3 menit)

### Step 4: Verify Frontend Deployment

- Kunjungi: `https://your-project.vercel.app`
- Pastikan API calls working ke backend Railway

---

## 🔐 Environment Variables Checklist

### Railway (Backend)
- [ ] DATABASE_URL (dari PostgreSQL Railway)
- [ ] SECRET_KEY (generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- [ ] ALLOWED_ORIGINS (include Vercel frontend URL)

### Vercel (Frontend)
- [ ] VITE_API_URL (gunakan Railway backend URL)
- [ ] VITE_GEMINI_API_KEY (jika pakai AI features)

---

## 🐛 Troubleshooting

### Backend Error: "Module not found: backend"
**Solusi**: Procfile sudah fix menjadi `backend.main:app` ✓

### Frontend Error: CORS blocked
**Solusi**: 
1. Pastikan `ALLOWED_ORIGINS` di Railway include Vercel URL
2. Check: `https://backend-url.up.railway.app/docs` bisa diakses

### Frontend Error: Cannot connect to API
**Solusi**:
1. Verify `VITE_API_URL` di Vercel environment
2. Check frontend console (F12 → Network tab)
3. Pastikan backend URL benar dan accessible

### Database connection failed
**Solusi**:
1. Verify PostgreSQL Railway sudah running
2. Check `DATABASE_URL` format: `postgresql://user:pass@host:port/db`
3. Test connection di Railway logs

---

## 📝 Post-Deployment

### 1. Run Database Migrations (jika ada)
```bash
# Di Railway backend console
python -m alembic upgrade head
# atau
python backend/database.py
```

### 2. Test Critical Features
- [ ] Login/Register working
- [ ] Create menu/order working
- [ ] Upload images (ke folder uploads)
- [ ] Payment flow working

### 3. Setup Custom Domain (Optional)
**Railway Backend:**
- Settings → Networking → Custom Domain

**Vercel Frontend:**
- Settings → Domains → Add custom domain

---

## 🔄 CI/CD Pipeline

Deployment akan automatic ketika push ke GitHub:
- **Backend**: Railway trigger build otomatis dari `/backend` changes
- **Frontend**: Vercel trigger build otomatis dari root changes

Untuk hanya trigger backend: commit ke branch dengan path `/backend/**`
Untuk hanya trigger frontend: commit ke branch dengan path `src/**`, `package.json`, dll

---

## 📊 Monitoring

### Railway Backend
- Dashboard → Deployments → View Logs
- Check: CPU, Memory, Network usage
- Scale: nyariin settings > resources kalau perlu

### Vercel Frontend
- Dashboard → Deployments → Logs
- Analytics → Performance metrics
- Real-time monitoring included

---

## 🚨 Important Notes

1. **Jangan commit `.env.production` ke GitHub** (sudah di .gitignore? check!)
2. **Regular backup** PostgreSQL database
3. **Update dependencies** regularly: `npm audit fix`, `pip --upgrade`
4. **Monitor costs** Railway & Vercel bisa ada charges jika exceed free tier
5. **Test sebelum production** dengan staging environment

---

## 📞 Quick Reference

| Component | URL | Notes |
|-----------|-----|-------|
| Backend API | `https://your-backend.up.railway.app` | Gunakan untuk VITE_API_URL |
| API Docs | `https://your-backend.up.railway.app/docs` | Swagger documentation |
| Frontend | `https://your-project.vercel.app` | Production frontend |
| Database | PostgreSQL Railway | Connection via DATABASE_URL |

---

**Last Updated**: May 28, 2026
