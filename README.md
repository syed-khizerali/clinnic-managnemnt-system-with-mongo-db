# MediFlow AI – Smart Clinic Operating System

A production-ready, scalable SaaS platform for clinic management with AI-powered diagnosis assistance.

## Tech Stack

**Frontend:** React (Vite), TailwindCSS, Recharts, Axios, React Router, JWT  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, PDFKit, OpenAI  
**AI:** OpenAI API with graceful fallback when unavailable

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI and OPENAI_API_KEY
npm install
npm run seed
npm run dev
```

Backend runs at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### 3. Seed Accounts

| Role        | Email                 | Password     |
|-------------|-----------------------|--------------|
| Admin       | admin@mediflow.com     | admin123     |
| Doctor      | doctor@mediflow.com    | doctor123    |
| Receptionist| reception@mediflow.com | reception123 |

## Features

### User Roles
- **Admin:** Manage users, view analytics, subscription plans, AI settings
- **Doctor:** Appointments, patient history, prescriptions, AI diagnosis assist, PDF generation
- **Receptionist:** Patient registration, appointment booking, schedule management
- **Patient:** Profile, appointments, prescriptions, PDF download, AI explanations

### AI Features
- **POST /api/ai/assist** – Symptom analysis → possible conditions, suggested tests, treatment recommendations
- **Prescription Explanation** – Convert diagnosis to simple language (Pro/Enterprise)
- Graceful fallback when AI API fails

### Core Features
- JWT authentication & role-based access
- Patient management with medical history timeline
- Appointment booking and status tracking
- Prescription creation with PDF download
- Analytics dashboards (Admin & Doctor)
- Clinic settings (AI toggle)

## Project Structure

```
├── backend/
│   ├── config/         # DB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth, RBAC, error handler
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── services/      # AI, PDF
│   └── scripts/       # Seed data
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/    # Auth
│   │   ├── lib/        # API client
│   │   └── pages/
│   └── ...
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/auth/me | Current user |
| GET | /api/patients | List patients |
| POST | /api/patients | Create patient |
| GET | /api/appointments | List appointments |
| POST | /api/appointments | Book appointment |
| GET | /api/prescriptions | List prescriptions |
| POST | /api/prescriptions | Create prescription |
| GET | /api/prescriptions/:id/pdf | Download PDF |
| POST | /api/ai/assist | AI diagnosis assist |
| GET | /api/analytics/admin | Admin stats |
| GET | /api/analytics/doctor | Doctor stats |

## Deployment

- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway / Cyclic
- **Database:** MongoDB Atlas

Set environment variables in your hosting platform.

## License

MIT
