import * as DormsModel from '../models/dorms.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createDormSchema, parseOrThrow } from '../middleware/validate.js';

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
