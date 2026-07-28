import * as SchoolsModel from '../models/schools.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createSchoolSchema, updateSchoolSchema, addDomainSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/schools — public. Useful for any "pick your school" UI,
// not just the admin console.
export const listSchools = asyncHandler(async (req, res) => {
  const schools = await SchoolsModel.findAllSchools();
  res.json(schools);
});

// POST /api/schools  (admin only)
export const createSchool = asyncHandler(async (req, res) => {
  const data = parseOrThrow(createSchoolSchema, req.body, ApiError);
  const school = await SchoolsModel.createSchool(data);
  res.status(201).json(school);
});

// PATCH /api/schools/:id  (admin only)
export const updateSchool = asyncHandler(async (req, res) => {
  const schoolId = Number(req.params.id);
  const school = await SchoolsModel.findSchoolById(schoolId);
  if (!school) throw new ApiError(404, 'School not found.');

  const { name } = parseOrThrow(updateSchoolSchema, req.body, ApiError);
  const updated = await SchoolsModel.updateSchoolName(schoolId, name);
  res.json(updated);
});

// DELETE /api/schools/:id  (admin only)
// Refuses if the school still has users or dorms attached — deleting
// it would cascade-delete them (see schema.sql FKs), and that's not a
// mistake an admin should be able to make with one click.
export const deleteSchool = asyncHandler(async (req, res) => {
  const schoolId = Number(req.params.id);
  const school = await SchoolsModel.findSchoolById(schoolId);
  if (!school) throw new ApiError(404, 'School not found.');

  const impact = await SchoolsModel.getDeletionImpact(schoolId);
  if (impact.userCount > 0 || impact.dormCount > 0) {
    throw new ApiError(
      409,
      `Can't delete this school — it still has ${impact.userCount} user(s) and ${impact.dormCount} dorm(s) attached. Remove or reassign those first.`
    );
  }

  await SchoolsModel.deleteSchool(schoolId);
  res.status(204).send();
});

// POST /api/schools/:id/domains  (admin only)  body: { domain }
export const addDomain = asyncHandler(async (req, res) => {
  const schoolId = Number(req.params.id);
  const school = await SchoolsModel.findSchoolById(schoolId);
  if (!school) throw new ApiError(404, 'School not found.');

  const { domain } = parseOrThrow(addDomainSchema, req.body, ApiError);
  const schools = await SchoolsModel.addDomain(schoolId, domain);
  res.status(201).json(schools);
});

// DELETE /api/schools/:id/domains/:domain  (admin only)
export const removeDomain = asyncHandler(async (req, res) => {
  const schoolId = Number(req.params.id);
  const removed = await SchoolsModel.removeDomain(schoolId, req.params.domain);
  if (!removed) throw new ApiError(404, 'Domain not found for this school.');
  res.status(204).send();
});
