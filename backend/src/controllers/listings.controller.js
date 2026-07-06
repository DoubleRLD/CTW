import * as ListingsModel from '../models/listings.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createListingSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/listings?schoolId=1
export const listListings = asyncHandler(async (req, res) => {
  const schoolId = req.query.schoolId ? Number(req.query.schoolId) : undefined;
  const listings = await ListingsModel.findAllListings({ schoolId });
  res.json(listings);
});

// GET /api/listings/:id
export const getListing = asyncHandler(async (req, res) => {
  const listing = await ListingsModel.findListingWithStats(Number(req.params.id));
  if (!listing) throw new ApiError(404, 'Listing not found.');
  res.json(listing);
});

// POST /api/listings
export const createListing = asyncHandler(async (req, res) => {
  const data = parseOrThrow(createListingSchema, req.body, ApiError);
  const listing = await ListingsModel.createListing(data);
  res.status(201).json(listing);
});
