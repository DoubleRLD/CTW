# Dorm App Backend (scaffold)

A working Express + MySQL example covering the `dorms` and `rooms` resources
end-to-end. Use this as the pattern to fill in the remaining resources
(`listings`, `roommate-profiles`, `roommate-matches`, reviews, auth).

## Setup

```bash
npm install
cp .env.example .env   # then fill in your DB credentials
```

Run `schema.sql` against your MySQL database first to create the tables.

## Run

```bash
npm run dev
```

Server starts on `http://localhost:4000`. Try:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/dorms
```

## Auth

```bash
# Register — email domain must match a row in Schools.domain
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@gsu.edu","password":"supersecret"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@gsu.edu","password":"supersecret"}'

# Both return { token, user }. Use the token on protected routes:
curl http://localhost:4000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

Register will fail with a 400 until you've inserted at least one school
domain into `School_Domains`. Run `seed.sql` (see below) to populate real
Georgia schools, or add your own manually:

```sql
INSERT INTO Schools (name) VALUES ('Georgia State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gsu.edu');
```

## Seeding Georgia schools

`seed.sql` populates all 26 University System of Georgia institutions plus
the residential private nonprofit colleges (Emory, Mercer, Spelman,
Morehouse, SCAD, etc.) — 50 schools, 51 domains total (Truett McConnell
University has two valid domains: `truett.edu` and `tmu.edu`, which is
exactly why `School_Domains` is a separate table rather than one column
on `Schools` — a school can have more than one valid student email domain).

```bash
mysql -u <user> -p<password> <database> < schema.sql
mysql -u <user> -p<password> <database> < seed.sql
```

A handful of smaller colleges have domains marked lower-confidence in
`seed.sql`'s comments — spot-check those before relying on them for real
signups. Technical colleges (TCSG) are intentionally excluded since they're
primarily commuter schools without the on-campus housing this app is built
around; add them the same way if that changes.

## Seeding dorms

`dorms_seed.sql` populates real on-campus residence halls for the 4 largest
research universities (UGA, Georgia Tech, GSU, Augusta University) — 76
halls total, sourced from each school's official housing website, not
guessed. Run it after `seed.sql`:

```bash
mysql -u <user> -p<password> <database> < schema.sql
mysql -u <user> -p<password> <database> < seed.sql
mysql -u <user> -p<password> <database> < dorms_seed.sql
```

The other 46 seeded schools have no dorms yet — add them the same way
(`INSERT INTO Dorms (school_id, name, address) SELECT school_id, 'Hall Name',
'City, GA' FROM Schools WHERE name = '...'`) when you're ready to expand
coverage. Individual rooms aren't seeded at all — those get created
organically through the app's "my room isn't listed" flow as real students
add them, the same way real data would arrive.

## Rate limiting

`/api/auth/login` and `/api/auth/register` are rate-limited (see
`src/middleware/rateLimit.js`):

- **Login**: 10 failed attempts per 15 minutes, per IP. Successful logins
  don't count against the limit — only failures accumulate, so a user who
  mistypes their password once or twice is never punished for it.
- **Register**: 20 attempts per hour, per IP — guards against automated
  spam account creation.

Both return `429 { "error": "Too many attempts..." }` once exceeded.

On top of the auth-specific limiters, every `/api/*` route also has a general
throttle of **100 requests per minute per IP** (`apiLimiter`), as defense in
depth against any single endpoint being hammered in a loop. `/health` is
mounted before this limiter and is never throttled.


## Structure

- `src/config/db.js` — MySQL connection pool
- `src/middleware/` — auth (JWT), validation (zod), centralized error handling
- `src/models/` — raw SQL query functions, one file per table/resource
- `src/controllers/` — request handling, calls models, no SQL here
- `src/routes/` — maps HTTP verbs + paths to controllers; nested resources
  (like rooms under dorms) use Express's `mergeParams` router option

## Adding the next resource (e.g. `listings`)

1. `models/listings.model.js` — SQL functions (`findAll`, `findById`, `create`, ...)
2. `middleware/validate.js` — add a zod schema for the create/update payload
3. `controllers/listings.controller.js` — thin handlers wrapped in `asyncHandler`
4. `routes/listings.routes.js` — wire verbs to controller functions
5. Mount it in `app.js`: `app.use('/api/listings', listingsRouter)`

Auth: use `requireAuth` on write routes (POST/PATCH/DELETE), leave reads public
unless you want personalized results, in which case use `optionalAuth`.
