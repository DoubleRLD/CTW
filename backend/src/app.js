import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import dormsRouter from './routes/dorms.routes.js';
import authRouter from './routes/auth.routes.js';
import listingsRouter from './routes/listings.routes.js';
import roommateProfilesRouter from './routes/roommateProfiles.routes.js';
import roommateMatchesRouter from './routes/roommateMatches.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

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

// Catch-all for unmatched routes
app.use((req, res) => res.status(404).json({ error: 'Not found.' }));

// Must be registered last — see middleware/errorHandler.js
app.use(errorHandler);

export default app;
