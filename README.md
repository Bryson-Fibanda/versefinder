# VerseFinder

Share your burden. Receive the Word.

A free, AI-powered Bible guidance app that gives you specific Bible verses, plain-language explanations, practical faith-based advice, and a personal prayer — in English, Swahili, Sheng, or any language you write in.

---

## Tech Stack

| Layer       | Tech                        |
|-------------|-----------------------------|
| Frontend    | React + Vite (PWA)          |
| Backend     | Flask + Gunicorn            |
| AI          | Groq API (Llama 3.3 70B)    |
| Bible Data  | bible-api.com (free)        |
| Hosting     | Render (free tier)          |

---

## Project Structure

```
versefinder/
  backend/
    app.py              # Flask API
    requirements.txt
    Procfile
    .env.example
  frontend/
    src/
      components/       # All UI components
      hooks/            # useSeek hook
      utils/            # API calls
    index.html
    vite.config.js
    package.json
    .env.example
```

---

## Local Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your GROQ_API_KEY in .env

python app.py
# Runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env
# VITE_API_URL=http://localhost:5000 for local dev
# Add your MPESA_TILL and MPESA_NAME

npm run dev
# Runs on http://localhost:5173
```

---

## Deploy to Render (Free)

### Step 1 — Backend (Web Service)

1. Push repo to GitHub
2. Go to render.com → New → Web Service
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --workers 2 --bind 0.0.0.0:$PORT --timeout 60`
5. Add Environment Variables:
   - `GROQ_API_KEY` = your key from console.groq.com
   - `ALLOWED_ORIGINS` = your frontend URL (e.g. https://versefinder.onrender.com)
   - `RATE_LIMIT_PER_HOUR` = 30
6. Deploy

### Step 2 — Frontend (Static Site)

1. Go to render.com → New → Static Site
2. Connect same repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL` = your backend URL (e.g. https://versefinder-api.onrender.com)
   - `VITE_MPESA_TILL` = your M-Pesa till number
   - `VITE_MPESA_NAME` = your business name
5. Deploy

---

## Environment Variables Reference

### Backend
| Variable              | Description                    | Default |
|-----------------------|--------------------------------|---------|
| `GROQ_API_KEY`        | Your Groq API key              | —       |
| `ALLOWED_ORIGINS`     | Comma-separated frontend URLs  | *       |
| `RATE_LIMIT_PER_HOUR` | Requests per IP per hour       | 30      |
| `PORT`                | Server port                    | 5000    |

### Frontend
| Variable           | Description                  |
|--------------------|------------------------------|
| `VITE_API_URL`     | Backend URL                  |
| `VITE_MPESA_TILL`  | M-Pesa till number           |
| `VITE_MPESA_NAME`  | Business name shown in app   |

---

## Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. API Keys → Create API Key
4. Copy and add to your backend .env

---

## Security Features

- Rate limiting: 30 requests/IP/hour
- Input sanitization (HTML stripping, length cap)
- Security headers (XSS, clickjacking, MIME sniffing protection)
- CORS restricted to your frontend domain
- No user data stored

---

## Donations

The app shows an M-Pesa donation modal. Users send money via Lipa na M-Pesa > Buy Goods & Services using your till number. No payment gateway needed — it's manual and zero-fee.

---

## License

Free to use and extend. Built for Kenya, blessed for the world.
