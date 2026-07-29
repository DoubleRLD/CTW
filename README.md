# DormScout

DormScout is a Georgia-based student housing and roommate matching platform. Students can search on-campus dorms and off-campus apartments, read and write housing reviews, build a roommate profile, and get compatibility-scored roommate matches.

Currently seeded with data for **Georgia State University**, **Georgia Institute of Technology**, **Augusta University**, and **University of Georgia**.

## Features

- **Housing search** — browse on-campus dorms and off-campus listings, filter by type/rating/distance, sort by price or rating
- **Reviews** — students leave category-rated reviews (cleanliness, noise, location for dorms; landlord, maintenance, value for listings)
- **Photo uploads** — any logged-in user can add/update a photo on a dorm or listing
- **Favorites** — save off-campus listings for later
- **Roommate matching** — build a profile (lifestyle, budget, housing interest, etc.), browse compatibility-scored candidates in **Discover**, send/accept roommate requests, and view **Matches**
- **AI match analysis** — an optional AI-generated compatibility writeup on top of the base algorithmic score
- **Activity feed** — a running history of what you've saved and reviewed
- **Off-campus listings are crowdsourced** — any student can post one, and edit/delete their own afterward
- **Review moderation** — anyone can flag a review; admins review flagged content and can dismiss or remove it
- **Admin console** (`/admin`) — manage schools (incl. valid student email domains), dorms, listings, users (ban/promote), and review reports

## Tech Stack

- **Frontend:** React + Vite, React Router
- **Backend:** Node.js + Express (ES modules)
- **Database:** MySQL
- **Auth:** JWT, bcrypt password hashing, email verification
- **Validation:** Zod

## Project Structure

```
CTW/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # route handlers
│   │   ├── middleware/    # auth, validation, error handling, rate limiting
│   │   ├── models/        # SQL queries
│   │   ├── routes/        # Express routers
│   │   └── services/      # matching algorithm, AI analysis, email
│   ├── app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/           # backend API client wrappers
│       ├── assets/        # images, dorm photo lookup map
│       ├── components/    # shared UI components
│       ├── context/       # Auth + Toast providers
│       └── pages/         # route-level views
├── database/               # schema, seed data, and migrations (run in order — see below)
└── package.json             # root scripts to run both halves together
```

## Setup

### 1. Clone and install

```bash
git clone https://github.com/DoubleRLD/CTW.git
cd CTW
npm run install-all
```

### 2. Configure Environment Variables

Create a `backend/.env` file (or use the one provided by the team) with the appropriate Aiven database credentials:

DB_HOST=dormscope-dormscopet6.d.aivencloud.com
DB_USER=avnadmin
DB_PORT=11889
DB_PASSWORD= * sent privately to group *
DB_NAME=defaultdb
DB_SSL=true

JWT_SECRET= * sent privately to group *
GEMINI_API_KEY= * sent privately to group *


### 3. Configure environment variables

Create `backend/.env` (never committed — see `.gitignore`):

```env
PORT=4000
FRONTEND_URL=http://localhost:5173

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=dormscout

JWT_SECRET=change-this-to-a-long-random-string

# Email verification — "console" logs the verification link to the
# server terminal instead of sending real email. Good enough for local dev.
EMAIL_PROVIDER=console
# EMAIL_PROVIDER=smtp
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=
# SMTP_PASSWORD=
# SMTP_FROM="DormScout" <no-reply@dormscout.app>

# Optional — powers the AI match-analysis feature. Without it, base
# compatibility scores still work; only the AI writeup is unavailable.
GEMINI_API_KEY=
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Run it

```bash
npm run dev
```

This starts both servers together:
- Backend: `http://localhost:4000`
- Frontend: `http://localhost:5173`

### 5. (Optional) Make yourself an admin

To access `/admin`, promote your account after registering:

```sql
UPDATE Users SET is_admin = TRUE WHERE email = 'your@email.edu';
```

Log out and back in afterward — admin status is read fresh from the database on every request, so this takes effect immediately, but your browser still needs a fresh session.

## Scripts

| Command | Description |
|---|---|
| `npm run install-all` | Installs root, backend, and frontend dependencies |
| `npm run dev` | Runs backend and frontend together |
| `npm run dev --prefix backend` | Backend only |
| `npm run dev --prefix frontend` | Frontend only |

## Known Limitations

- Photos are stored as base64 directly in the database, not a dedicated file storage service — fine at this scale, worth revisiting before handling large volumes of user-uploaded images
- Roommate "Message Match" is not yet connected to a real messaging feature
- No password reset flow yet
- Email sending requires real SMTP credentials to be configured (`EMAIL_PROVIDER=smtp`); defaults to logging links to the console for local development
