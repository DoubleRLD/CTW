import * as DormsModel from '../models/dorms.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createDormSchema, updateDormSchema, uploadImageSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/dorms?schoolId=1
export const listDorms = asyncHandler(async (req, res) => {
  const schoolId = req.query.schoolId ? Number(req.query.schoolId) : undefined;
  const dorms = await DormsModel.findAllDorms({ schoolId });
  res.json(dorms);
});

// GET /api/dorms/:id
export const getDorm = asyncHandler(async (req, res) => {
  const dorm = await DormsModel.findDormWithStats(Number(req.params.id));
  if (!dorm) throw new ApiError(404, 'Dorm not found.');
  res.json(dorm);
});

// POST /api/dorms
export const createDorm = asyncHandler(async (req, res) => {
  const data = parseOrThrow(createDormSchema, req.body, ApiError);
  const dorm = await DormsModel.createDorm(data);
  res.status(201).json(dorm);
});

// PATCH /api/dorms/:id/image  (auth required)
export const setDormImage = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.id);
  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const { imageUrl } = parseOrThrow(uploadImageSchema, req.body, ApiError);
  const updated = await DormsModel.setDormImage(dormId, imageUrl);
  res.json(updated);
});

// PATCH /api/dorms/:id  (admin only)
export const updateDorm = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.id);
  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const data = parseOrThrow(updateDormSchema, req.body, ApiError);
  const updated = await DormsModel.updateDorm(dormId, data);
  res.json(updated);
});

// DELETE /api/dorms/:id  (admin only)
export const deleteDorm = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.id);
  const deleted = await DormsModel.deleteDorm(dormId);
  if (!deleted) throw new ApiError(404, 'Dorm not found.');
  res.status(204).send();
});
