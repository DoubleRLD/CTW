import * as ListingsModel from '../models/listings.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createListingSchema, updateListingSchema, uploadImageSchema, parseOrThrow } from '../middleware/validate.js';

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

// PATCH /api/listings/:id/image  (auth required)
export const setListingImage = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.id);
  const listing = await ListingsModel.findListingById(listingId);
  if (!listing) throw new ApiError(404, 'Listing not found.');

  const { imageUrl } = parseOrThrow(uploadImageSchema, req.body, ApiError);
  const updated = await ListingsModel.setListingImage(listingId, imageUrl);
  res.json(updated);
});

// PATCH /api/listings/:id  (admin only)
export const updateListing = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.id);
  const listing = await ListingsModel.findListingById(listingId);
  if (!listing) throw new ApiError(404, 'Listing not found.');

  const data = parseOrThrow(updateListingSchema, req.body, ApiError);
  const updated = await ListingsModel.updateListing(listingId, data);
  res.json(updated);
});

// DELETE /api/listings/:id  (admin only)
export const deleteListing = asyncHandler(async (req, res) => {
  const listingId = Number(req.params.id);
  const deleted = await ListingsModel.deleteListing(listingId);
  if (!deleted) throw new ApiError(404, 'Listing not found.');
  res.status(204).send();
});
