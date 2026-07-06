import * as DormReviewsModel from '../models/dormReviews.model.js';
import * as DormsModel from '../models/dorms.model.js';
import * as RoomsModel from '../models/rooms.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createDormReviewSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/dorms/:dormId/reviews
export const listReviewsForDorm = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.dormId);
  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const reviews = await DormReviewsModel.findReviewsByDorm(dormId);
  res.json(reviews);
});

// POST /api/dorms/:dormId/reviews  (auth required)
export const createReviewForDorm = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.dormId);
  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const data = parseOrThrow(createDormReviewSchema, req.body, ApiError);

  let room;
  if (data.roomId) {
    // A real room was picked from the dropdown — verify it actually
    // belongs to this dorm so someone can't attach a review to a
    // room_id from a completely different building.
    room = await RoomsModel.findRoomById(data.roomId);
    if (!room || room.dorm_id !== dormId) {
      throw new ApiError(400, 'That room does not belong to this dorm.');
    }
  } else {
    // No room selected — the reviewer doesn't know their specific room
    // number, so the review attaches to a shared "General" room for
    // this dorm (created once, reused after) rather than blocking them.
    room = await RoomsModel.findOrCreateDefaultRoom(dormId);
  }

  const review = await DormReviewsModel.createReview({
    roomId: room.room_id,
    userId: req.user.userId,
    semester: data.semester,
    semesterYear: data.semesterYear,
    cleanlinessRating: data.cleanlinessRating,
    noiseRating: data.noiseRating,
    locationRating: data.locationRating,
    overallRating: data.overallRating,
    body: data.body,
  });

  res.status(201).json(review);
});

// DELETE /api/dorms/:dormId/reviews/:reviewId  (auth required, own review only)
export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = Number(req.params.reviewId);
  const deleted = await DormReviewsModel.deleteReview(reviewId, req.user.userId);
  if (!deleted) throw new ApiError(404, 'Review not found or not owned by you.');
  res.status(204).send();
});
