# 🇮🇳 Sarkari Sahayak — AI Government Scheme Finder

A production-grade full-stack web app that helps Indian citizens find government schemes they are eligible for — powered by rule-based AI, with 123+ schemes across all categories.

---

## ✨ Features

- **123+ schemes** — Central + major state government schemes
- **AI Eligibility Engine** — Rule-based matching across age, income, state, occupation, category & gender
- **"Why You're Eligible"** — Dynamic explanations generated per user
- **Multi-step animated form** — Framer Motion page transitions & voice input
- **WhatsApp Share** — Share results with family via encoded link
- **Voice Input** — Web Speech API for hands-free form filling (English / Hindi)
- **Search & Filter** — Within results and across all schemes
- **Collapsible scheme details** — Documents, apply steps, benefits
- **Skeleton loading** — Smooth shimmer placeholders
- **No data stored** — 100% in-session, zero server-side user storage
- **Mobile responsive** — Works perfectly on phones

---

## 🗂 Project Structure

```
ai-scheme-finder/
├── backend/
│   ├── server.js          # Express API with eligibility engine
│   ├── package.json
│   └── data/
│       └── schemes.json   # 123+ schemes database
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Hero, features, how-it-works
│   │   │   ├── EligibilityForm.jsx # Multi-step form with voice input
│   │   │   ├── Results.jsx        # Matched schemes + WhatsApp share
│   │   │   ├── SchemeDetail.jsx   # Full details with collapsible sections
│   │   │   └── AllSchemes.jsx     # Browse + search all schemes
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── SchemeCard.jsx     # Animated card with expand-on-click
│   │   │   ├── Skeleton.jsx       # Loading skeletons
│   │   │   └── PageWrapper.jsx    # Page transition wrapper
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css      # Design system, glassmorphism, animations
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── start.sh               # One-command startup
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v18+ installed
- npm v8+

### Option 1 — One command (recommended)

```bash
chmod +x start.sh
./start.sh
```

### Option 2 — Manual (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check + scheme count |
| GET | `/api/schemes` | All schemes (optional `?search=` `?category=`) |
| GET | `/api/schemes/:id` | Single scheme details |
| POST | `/api/eligible` | Match schemes to a user profile |
| GET | `/api/categories` | List all categories |

### POST `/api/eligible` — Request body

```json
{
  "age": "28",
  "income": "200000",
  "state": "Telangana",
  "occupation": "farmer",
  "category": "OBC",
  "gender": "male"
}
```

### Response

```json
{
  "count": 47,
  "profile": { ... },
  "schemes": [
    {
      "id": "pmkisan",
      "name": "PM-KISAN",
      "eligibility_reason": "You qualify because this scheme is available across all Indian states, no income restriction applies, and targeted at farmers and agricultural workers.",
      ...
    }
  ]
}
```

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend framework | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion 11 |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Database | Local JSON file |
| AI Engine | Rule-based (free, no API keys) |
| Voice Input | Web Speech API |

---

## 📊 Scheme Categories Covered

Agriculture, Housing (urban & rural), Health & Insurance, Education & Scholarships,
Business & Loans, Skill Development, Women's Welfare, Senior Citizens, SC/ST/OBC,
Tribal Affairs, Disability, Minority, Fishermen, Artisans, Energy & Solar,
Food Security, Sports, Startups, Digital Literacy, and more.

---

## ⚠️ Disclaimer

This is an independent civic-utility tool. It is not affiliated with the Government of India.
Always verify eligibility and apply on official government portals.

---

## 📱 WhatsApp Sharing

On the Results page, clicking "Share on WhatsApp" generates a pre-filled message with your top 3 matched schemes and the app link — enabling organic sharing to family members who might benefit.
