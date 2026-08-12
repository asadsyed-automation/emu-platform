# EMU — Emerson University Multan | BS(CS) Platform

EMU is a single-class academic attendance and coursework platform for the BS(CS) 7th semester section at Emerson University Multan.

---

## 🎨 Official EUM Brand Palette
- **Primary Header / CTAs**: EUM Maroon (`#7A1F1F`)
- **Secondary / Academic Accent**: EUM Forest Green (`#1C5C34`)
- **Highlights & Badges**: Warm Gold (`#C9A227`)
- **Backgrounds**: Soft Off-White (`#F7F7F5`) / Pure White (`#FFFFFF`)
- **Typography**: Poppins / Sora (Headings) & Inter (Data & Body text)

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup (`/server`)
```bash
cd server
npm install
```
Create a `.env` file inside `server/` (see `server/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/emu_db?retryWrites=true&w=majority
JWT_SECRET=your_secret_jwt_key
RESEND_API_KEY=re_your_live_resend_key
FROM_EMAIL=EMU Platform <onboarding@resend.dev>
CLIENT_URL=http://localhost:5173
```

Run seed script to populate test accounts:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

### 2. Frontend Setup (`/client`)
```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👥 Seeded Test Credentials (Phase 0)

| Role | Username / Roll No. | Password | First Login OTP Behavior |
|---|---|---|---|
| **Owner (Shah G)** | `OWNER-01` | `Password123!` | Pre-verified (Direct Access) |
| **Teacher** | `TCH-CS01` | `Password123!` | Pre-verified (Direct Access) |
| **Student** | `21-BSCS-01` | `Password123!` | **Mandatory OTP Verification Required** |

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Create a new **Web Service** on Render connected to your GitHub repo `asadsyed-automation/emu-platform`.
2. Set Root Directory to `server`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `RESEND_API_KEY`, `CLIENT_URL`.

### Frontend (Vercel)
1. Import `asadsyed-automation/emu-platform` repository on Vercel.
2. Set Framework Preset: **Vite**.
3. Set Root Directory to `client`.
4. Deploy!
