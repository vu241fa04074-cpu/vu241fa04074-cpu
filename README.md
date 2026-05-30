# VeriFolio — Digital Portfolio & Achievement Verification Platform

A professional full-stack web application for building, verifying, and sharing your digital portfolio. Users can add projects, certifications, and achievements, request admin verification, receive skill endorsements, and share a public profile URL with verified badges.

---

## ✨ Features

- **JWT Authentication** — Secure register/login with role-based access (user/admin)
- **Portfolio Management** — Add/edit/delete Projects, Certifications, and Achievements
- **Admin Verification** — Submit proof files; admins approve/reject and verified badges appear
- **Public Portfolio** — Share your profile at `/u/username` with full details and verified badges
- **Skill Endorsements** — Search peers and endorse their skills
- **Analytics Dashboard** — Profile views, portfolio stats, verification counts
- **Admin Panel** — Platform-wide stats and verification request management with pagination
- **GitHub Integration** — Link GitHub repos on projects and GitHub profile in social links
- **Responsive UI** — Mobile-first design with Tailwind CSS + Framer Motion animations

---

## 🛠 Tech Stack

| Layer    | Technology                                                        |
|----------|-------------------------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Recharts, React Hook Form + Zod |
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer    |
| Security | Helmet, CORS env config, Rate Limit, HPP, Mongo Sanitize, express-validator |

---

## 📁 Folder Structure

```
VeriFolio/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── server.js               # Server entry point
│   │   ├── config/db.js            # MongoDB connection
│   │   ├── controllers/            # Route handlers
│   │   ├── middleware/             # Auth, upload, error, role
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express routers
│   │   ├── utils/                  # JWT token generator
│   │   └── validators/             # Input validators
│   ├── uploads/                    # Local file storage
│   ├── .env                        # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/                    # Axios API calls per domain
    │   ├── components/             # Shared UI components
    │   ├── context/AuthContext.jsx # Global auth state
    │   ├── layouts/                # DashboardLayout
    │   ├── pages/                  # All page components
    │   └── routes/                 # ProtectedRoute, AdminRoute
    ├── .env
    └── package.json
```

---

## 🔧 Environment Variables

### `backend/.env`
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_min_32_chars
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_URL=https://github.com/your-username/VeriFolio
VITE_APP_NAME=VeriFolio
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))

### Backend
```bash
cd backend
cp .env.example .env        # Fill in your MONGO_URI and JWT_SECRET
npm install
npm run dev                  # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env        # Set VITE_API_URL
npm install
npm run dev                  # Runs on http://localhost:5173
```

---

## 📡 API Reference

| Method | Endpoint                          | Auth   | Description                        |
|--------|-----------------------------------|--------|------------------------------------|
| POST   | /api/auth/register                | Public | Register new user                  |
| POST   | /api/auth/login                   | Public | Login, returns JWT                 |
| GET    | /api/auth/me                      | User   | Get current user                   |
| GET    | /api/profile/me                   | User   | Get my profile                     |
| PUT    | /api/profile/me                   | User   | Update my profile                  |
| GET    | /api/profile/public/:username     | Public | Get public profile (full data)     |
| GET    | /api/projects                     | User   | List my projects                   |
| POST   | /api/projects                     | User   | Create project                     |
| PUT    | /api/projects/:id                 | User   | Update project                     |
| DELETE | /api/projects/:id                 | User   | Delete project                     |
| GET    | /api/certifications               | User   | List my certifications             |
| POST   | /api/certifications               | User   | Create certification               |
| PUT    | /api/certifications/:id           | User   | Update certification               |
| DELETE | /api/certifications/:id           | User   | Delete certification               |
| GET    | /api/achievements                 | User   | List my achievements               |
| POST   | /api/achievements                 | User   | Create achievement                 |
| PUT    | /api/achievements/:id             | User   | Update achievement                 |
| DELETE | /api/achievements/:id             | User   | Delete achievement                 |
| GET    | /api/verifications/my-requests    | User   | Get my verification requests       |
| POST   | /api/verifications                | User   | Submit verification request        |
| GET    | /api/verifications/admin          | Admin  | Get all requests (paginated)       |
| PUT    | /api/verifications/:id/approve    | Admin  | Approve + mark item verified       |
| PUT    | /api/verifications/:id/reject     | Admin  | Reject with remarks                |
| GET    | /api/endorsements/:userId         | User   | Get endorsements for user          |
| POST   | /api/endorsements                 | User   | Endorse a user's skill             |
| GET    | /api/dashboard/stats              | User   | Dashboard statistics               |
| GET    | /api/analytics/me                 | User   | My analytics data                  |
| GET    | /api/admin/stats                  | Admin  | Platform-wide stats                |
| GET    | /api/users                        | User   | Search users                       |

---

## 🗄 Database Models

| Model              | Key Fields                                                                   |
|--------------------|------------------------------------------------------------------------------|
| User               | name, username, email, password (hashed), role (user/admin)                 |
| Profile            | user, bio, headline, skills[], education[], workExperience[], socialLinks, isPublic |
| Project            | user, title, description, technologies[], githubLink, liveLink, verified    |
| Certification      | user, title, issuer, issueDate, credentialId, credentialUrl, verified       |
| Achievement        | user, title, description, category, proofFile, verified                     |
| VerificationRequest| user, itemType, itemId, proofFile, status, remarks, verifiedBy              |
| Endorsement        | fromUser, toUser, skill                                                      |
| ProfileAnalytics   | user, profileViews, verificationCount                                        |

---

## 👤 Creating an Admin User

There is no admin registration endpoint by design. To create an admin:

1. Register a normal user via `/api/auth/register` or the UI.
2. Open MongoDB Compass or Atlas.
3. Find the user in the `users` collection.
4. Change `role` from `"user"` to `"admin"`.
5. That user can now log in and access `/admin` routes.

---

## ☁️ Deployment Guide

### Backend (Railway / Render / Fly.io)
1. Set all environment variables in the hosting dashboard.
2. Set `NODE_ENV=production`.
3. Set `CLIENT_URL` to your deployed frontend URL.
4. For file uploads at scale, replace `uploads/` with **Cloudinary** or **AWS S3**.
5. Deploy with `npm start`.

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL.
2. Run `npm run build` — outputs to `dist/`.
3. Upload `dist/` to your hosting provider.
4. Add a redirect rule: all routes → `/index.html` (for React Router).

### MongoDB Atlas Setup
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist your server IP.
3. Copy the connection string and set it as `MONGO_URI`.

### Production CORS
In `backend/.env`, set `CLIENT_URL` to your exact frontend domain:
```env
CLIENT_URL=https://verifolio.yourdomain.com
```

---

## ⚖️ Scaling Notes (1000+ Users)

- Database indexes are defined on frequently queried fields (user, status, username).
- All list endpoints support pagination (`?page=1&limit=20`).
- Rate limiting: 500 req/15min globally, 20 req/15min for auth endpoints.
- File uploads capped at 5MB; only PDF/JPG/PNG accepted.
- Backend uses `express-mongo-sanitize` and `hpp` to prevent injection attacks.
- For 10,000+ users: add Redis caching for dashboard stats, migrate uploads to S3/Cloudinary.

---

## 🔒 Security Notes

- Passwords hashed with `bcryptjs` (salt rounds 10).
- JWTs expire after 7 days; secret must be 32+ chars.
- Helmet sets secure HTTP headers.
- CORS restricted to `CLIENT_URL` env variable.
- Mongo sanitize prevents NoSQL injection.
- HPP prevents HTTP parameter pollution.
- No secrets should be committed — use `.env` (listed in `.gitignore`).

---

## 🔮 Future Improvements

- [ ] Email verification on registration (Nodemailer / SendGrid)
- [ ] Password reset via email
- [ ] Cloudinary / AWS S3 for production file uploads
- [ ] WebSockets for real-time endorsement notifications
- [ ] OAuth login (Google, GitHub)
- [ ] PDF generation for verified portfolio
- [ ] Custom domain for public profiles
- [ ] Organization/team accounts
