import * as ProfilesModel from '../models/roommateProfiles.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { roommateProfileSchema, parseOrThrow } from '../middleware/validate.js';

function parseSemesterQuery(req) {
  const { semester, semesterYear } = req.query;
  if (!semester || !semesterYear) {
    throw new ApiError(400, 'semester and semesterYear query params are required.');
  }
  return { semester, semesterYear: Number(semesterYear) };
}

// GET /api/roommate-profiles/me?semester=Fall&semesterYear=2026
export const getMyProfile = asyncHandler(async (req, res) => {
  const { semester, semesterYear } = parseSemesterQuery(req);
  const profile = await ProfilesModel.findProfileByUserAndSemester(req.user.userId, semester, semesterYear);
  if (!profile) throw new ApiError(404, 'No roommate profile found for that semester.');
  res.json(profile);
});

// POST /api/roommate-profiles  (auth required) — create or update this
// user's profile for the given semester (upsert, per the unique
// constraint on user_id + semester + semester_year).
export const upsertMyProfile = asyncHandler(async (req, res) => {
  const data = parseOrThrow(roommateProfileSchema, req.body, ApiError);

  const profile = await ProfilesModel.upsertProfile({
    userId: req.user.userId,
    schoolId: req.user.schoolId,
    ...data,
  });

  res.status(200).json(profile);
});

// GET /api/roommate-profiles/browse?semester=Fall&semesterYear=2026
// Other students' profiles at the caller's school, for browsing
// before matches are computed.
export const browseProfiles = asyncHandler(async (req, res) => {
  const { semester, semesterYear } = parseSemesterQuery(req);
  const profiles = await ProfilesModel.findProfilesForMatching({
    schoolId: req.user.schoolId,
    semester,
    semesterYear,
    excludeUserId: req.user.userId,
  });
  res.json(profiles);
});
