import * as ProfilesModel from '../models/roommateProfiles.model.js';
import * as MatchesModel from '../models/roommateMatches.model.js';
import { computeCompatibilityScore } from '../services/matchingService.js';
import { generateMatchExplanation } from "../services/aiMatchingService.js";
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { respondToMatchSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/roommate-matches/me?semester=Fall&semesterYear=2026
//
// Computes-on-read rather than relying on a cron job: for every other
// candidate profile at the same school/semester that this user hasn't
// been scored against yet, compute + store the score, then return all
// matches for their profile sorted by compatibility. This keeps the
// scaffold simple (no job scheduler needed) while still avoiding
// redundant recomputation — see matchingService.js for the scoring
// itself, and the original design note about moving this to a cron
// job once profile volume makes on-read computation too slow.
export const getMyMatches = asyncHandler(async (req, res) => {
  const { semester, semesterYear } = req.query;
  if (!semester || !semesterYear) {
    throw new ApiError(400, 'semester and semesterYear query params are required.');
  }

  const myProfile = await ProfilesModel.findProfileByUserAndSemester(
    req.user.userId,
    semester,
    Number(semesterYear)
  );
  if (!myProfile) {
    throw new ApiError(404, 'Create a roommate profile for this semester before viewing matches.');
  }

  const candidates = await ProfilesModel.findProfilesForMatching({
    schoolId: req.user.schoolId,
    semester,
    semesterYear: Number(semesterYear),
    excludeUserId: req.user.userId,
  });

  for (const candidate of candidates) {
    const existing = await MatchesModel.findMatch(myProfile.room_profile_id, candidate.room_profile_id);
    if (!existing) {
      const score = computeCompatibilityScore(myProfile, candidate);
      await MatchesModel.upsertMatchScore(myProfile.room_profile_id, candidate.room_profile_id, score);
    }
  }

  const matches = await MatchesModel.findMatchesForProfile(myProfile.room_profile_id);
  res.json(matches);
});
// GET/api/roommate-matches/:matchId/analysis (auth required)
// Uses AI to provide a small summary of one specific roommate match after the base compatibility
// score is calculated
export const getMatchAnalysis = asyncHandler(async (req,res) => {
  const matchId = Number(req.params.matchId);

  const match = await MatchesModel.findMatchById(matchId);
  if (!match) throw new ApiError(404, 'Match not found.');

  const profileA = await  ProfilesModel.findProfileById(match.profile_id_a);
  const profileB = await  ProfilesModel.findProfileById(match.profile_id_b);

  const ownsMatch =
      profileA?.user_id === req.user.userId || profileB?.user_id === req.user.userId;
  if (!ownsMatch) throw new ApiError(403, "You are not part of this match. ");

  const score = match.compatibility_score ?? match.score ?? 0;
  const aiResult = await generateMatchExplanation(profileA,profileB,score);

  res.json({
    matchId,
    score,
    adjustment: aiResult.adjustment,
    adjustedScore: aiResult.adjustedScore,
    explanation: aiResult.explanation,
  });
});

// POST /api/roommate-matches/:matchId/request  (auth required)
// Claims an already-scored candidate match as "I sent this person a
// request." Fails silently (409) if someone already claimed it first
// — the DB-level guard in sendMatchRequest is the real source of
// truth, this just turns that into a clean HTTP response.
export const sendRoommateRequest = asyncHandler(async (req, res) => {
  const matchId = Number(req.params.matchId);

  const match = await MatchesModel.findMatchById(matchId);
  if (!match) throw new ApiError(404, 'Match not found.');

  const profileA = await ProfilesModel.findProfileById(match.profile_id_a);
  const profileB = await ProfilesModel.findProfileById(match.profile_id_b);
  const ownsMatch =
    profileA?.user_id === req.user.userId || profileB?.user_id === req.user.userId;
  if (!ownsMatch) throw new ApiError(403, 'You are not part of this match.');

  if (match.status !== 'pending') {
    throw new ApiError(409, 'This match has already been responded to.');
  }

  const updated = await MatchesModel.sendMatchRequest(matchId, req.user.userId);
  if (!updated) {
    throw new ApiError(409, 'A roommate request has already been sent for this match.');
  }

  res.json(updated);
});

// POST /api/roommate-matches/:matchId/respond  (auth required)
// body: { status: "accepted" | "rejected" }
export const respondToMatch = asyncHandler(async (req, res) => {
  const matchId = Number(req.params.matchId);
  const { status } = parseOrThrow(respondToMatchSchema, req.body, ApiError);

  const match = await MatchesModel.findMatchById(matchId);
  if (!match) throw new ApiError(404, 'Match not found.');

  // Confirm the requester actually owns one of the two profiles in
  // this match — otherwise anyone with a match ID could accept/reject
  // matches that aren't theirs.
  const profileA = await ProfilesModel.findProfileById(match.profile_id_a);
  const profileB = await ProfilesModel.findProfileById(match.profile_id_b);
  const ownsMatch =
    profileA?.user_id === req.user.userId || profileB?.user_id === req.user.userId;
  if (!ownsMatch) throw new ApiError(403, 'You are not part of this match.');

  if (!match.requester_user_id) {
    throw new ApiError(400, 'No roommate request has been sent for this match yet.');
  }
  if (match.requester_user_id === req.user.userId) {
    throw new ApiError(403, 'You cannot respond to your own request.');
  }

  const updated = await MatchesModel.updateMatchStatus(matchId, status);
  res.json(updated);
});
