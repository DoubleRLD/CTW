import * as UsersModel from '../models/users.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';

// GET /api/admin/users  (admin only)
export const listUsers = asyncHandler(async (req, res) => {
  const users = await UsersModel.findAllUsersForAdmin();
  res.json(users);
});

// PATCH /api/admin/users/:id/ban  (admin only)  body: { banned: boolean }
export const setBanned = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  if (userId === req.user.userId) {
    throw new ApiError(400, "You can't ban your own account.");
  }

  const { banned } = req.body;
  if (typeof banned !== 'boolean') {
    throw new ApiError(400, '"banned" must be true or false.');
  }

  const user = await UsersModel.setUserBanned(userId, banned);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json(user);
});

// PATCH /api/admin/users/:id/admin  (admin only)  body: { isAdmin: boolean }
export const setAdmin = asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  if (userId === req.user.userId) {
    throw new ApiError(400, "You can't change your own admin status.");
  }

  const { isAdmin } = req.body;
  if (typeof isAdmin !== 'boolean') {
    throw new ApiError(400, '"isAdmin" must be true or false.');
  }

  const user = await UsersModel.setUserAdmin(userId, isAdmin);
  if (!user) throw new ApiError(404, 'User not found.');
  res.json(user);
});
