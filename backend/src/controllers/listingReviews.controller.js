import * as ListingReviewsModel from '../models/listingReviews.model.js';
import * as ListingsModel from '../models/listings.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createListingReviewSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/listings/:listingId/reviews
export const listReviewsForListing = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);
  const listing = await ListingsModel.findListingById(listingId);
  if (!listing) throw new ApiError(404, 'Listing not found.');

  const reviews = await ListingReviewsModel.findReviewsByListing(listingId);
  res.json(reviews);
});

// POST /api/listings/:listingId/reviews  (auth required)
export const createReviewForListing = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.listingId);
  const listing = await ListingsModel.findListingById(listingId);
  if (!listing) throw new ApiError(404, 'Listing not found.');

  const data = parseOrThrow(createListingReviewSchema, req.body, ApiError);

  const review = await ListingReviewsModel.createReview({
    listingId,
    userId: req.user.userId,
    semester: data.semester,
    semesterYear: data.semesterYear,
    landlordRating: data.landlordRating,
    maintenanceRating: data.maintenanceRating,
    valueRating: data.valueRating,
    overallRating: data.overallRating,
    body: data.body,
  });

  res.status(201).json(review);
});

// DELETE /api/listings/:listingId/reviews/:reviewId  (auth required, own review only)
export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = Number(req.params.reviewId);
  const deleted = await ListingReviewsModel.deleteReview(reviewId, req.user.userId);
  if (!deleted) throw new ApiError(404, 'Review not found or not owned by you.');
  res.status(204).send();
});
