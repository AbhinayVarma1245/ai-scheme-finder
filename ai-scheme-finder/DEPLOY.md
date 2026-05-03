# 🚀 Deployment Guide — Sarkari Sahayak

This project has two parts:
- **Backend** (Node/Express API) → deployed to **Render.com** (free)
- **Frontend** (React/Vite) → deployed to **Netlify** or **Vercel** (free)

Total time: ~10 minutes.

---

## Step 1 — Push to GitHub

```bash
# From the project root (ai-scheme-finder/)
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sarkari-sahayak.git
git push -u origin main
```

---

## Step 2 — Deploy the Backend on Render.com

1. Go to **[render.com](https://render.com)** → Sign up / Log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account and select the `sarkari-sahayak` repo
4. Fill in the settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `sarkari-sahayak-api` (or anything) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Plan** | `Free` |

5. Click **"Create Web Service"** — Render will build and deploy it.
6. Wait ~2 minutes. You'll get a URL like:
   ```
   https://sarkari-sahayak-api.onrender.com
   ```
   **Copy this URL — you need it in Step 3.**

7. *(Optional but recommended)* Add the `ALLOWED_ORIGIN` environment variable:
   - In Render dashboard → Your service → **Environment**
   - Add: `ALLOWED_ORIGIN` = `https://your-frontend.netlify.app`
   - *(Set this after Step 3 once you know your frontend URL)*

---

## Step 3 — Deploy the Frontend on Netlify

1. Go to **[netlify.com](https://netlify.com)** → Sign up / Log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub → select `sarkari-sahayak` repo
4. Fill in the build settings:

   | Field | Value |
   |-------|-------|
   | **Base directory** | `frontend` |
   | **Build command** | `npm install && npm run build` |
   | **Publish directory** | `frontend/dist` |

   *(Netlify auto-reads `netlify.toml` so these may already be filled in)*

5. **Add environment variable** — this is the critical step:
   - Go to **Site settings** → **Environment variables** → **Add variable**
   - Key: `VITE_API_URL`
   - Value: `https://sarkari-sahayak-api.onrender.com` ← paste your Render URL from Step 2

6. Click **"Deploy site"** — done!
7. Your site will be live at something like:
   ```
   https://sarkari-sahayak.netlify.app
   ```

---

## Alternative: Deploy Frontend on Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up / Log in
2. Click **"Add New"** → **"Project"** → Import from GitHub
3. In **"Configure Project"**:
   - **Root Directory**: `frontend`
   - Framework: Vite (auto-detected)
4. Under **"Environment Variables"** add:
   - `VITE_API_URL` = `https://sarkari-sahayak-api.onrender.com`
5. Click **Deploy** — you'll get a `*.vercel.app` URL.

---

## Verifying It Works

1. Visit your Netlify/Vercel URL
2. Go to **Check Eligibility** and fill the form
3. You should see matched schemes in results

If results don't load, check:
- The `VITE_API_URL` env var on Netlify/Vercel is set correctly (no trailing slash)
- The Render backend is awake — open `https://your-api.onrender.com/api/health` in browser
- *(Note: Render free tier sleeps after 15 min inactivity — first request may take ~30s to wake)*

---

## Local Development (unchanged)

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 — Vite automatically proxies `/api` to `localhost:3001` so no env var needed locally.
