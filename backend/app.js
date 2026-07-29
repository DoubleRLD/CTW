import dormsRouter from './src/routes/dorms.routes.js';
import authRouter from './src/routes/auth.routes.js';
import listingsRouter from './src/routes/listings.routes.js';
import roommateProfilesRouter from './src/routes/roommateProfiles.routes.js';
import roommateMatchesRouter from './src/routes/roommateMatches.routes.js';
import favoritesRouter from './src/routes/favorites.routes.js';
import activityRouter from './src/routes/activity.routes.js';
import moderationRouter from './src/routes/moderation.routes.js';
import schoolsRouter from './src/routes/school.routes.js';
import adminUsersRouter from './src/routes/adminUsers.routes.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import { apiLimiter } from './src/middleware/rateLimit.js';
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Defense-in-depth: general throttle across all API routes. Auth
// routes additionally have their own tighter limiters (see
// auth.routes.js) layered on top of this one.
app.use('/api', apiLimiter);

app.use('/api/dorms', dormsRouter);
app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/roommate-profiles', roommateProfilesRouter);
app.use('/api/roommate-matches', roommateMatchesRouter);
// Favorites API (bookmarks) — routes added for the "Save favorite listings" feature
app.use('/api/favorites', favoritesRouter);
// Derived recent-activity feed for the dashboard (saves + reviews)
app.use('/api/activity', activityRouter);
// Admin-only review moderation
app.use('/api/moderation', moderationRouter);
// Schools (public read, admin-managed write)
app.use('/api/schools', schoolsRouter);
// Admin-only user management
app.use('/api/admin/users', adminUsersRouter);

// Catch-all for unmatched routes
app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

// Must be registered last — see middleware/errorHandler.js
app.use(errorHandler);

export default app;
