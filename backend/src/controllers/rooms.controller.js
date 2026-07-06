import * as RoomsModel from '../models/rooms.model.js';
import * as DormsModel from '../models/dorms.model.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { createRoomSchema, parseOrThrow } from '../middleware/validate.js';

// GET /api/dorms/:dormId/rooms
export const listRoomsForDorm = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.dormId);

  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const rooms = await RoomsModel.findRoomsByDorm(dormId);
  res.json(rooms);
});

// GET /api/dorms/:dormId/rooms/:roomId
export const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomsModel.findRoomById(Number(req.params.roomId));
  if (!room || room.dorm_id !== Number(req.params.dormId)) {
    throw new ApiError(404, 'Room not found.');
  }
  res.json(room);
});

// POST /api/dorms/:dormId/rooms
export const createRoom = asyncHandler(async (req, res) => {
  const dormId = Number(req.params.dormId);

  const dorm = await DormsModel.findDormById(dormId);
  if (!dorm) throw new ApiError(404, 'Dorm not found.');

  const { floor, roomNumber } = parseOrThrow(createRoomSchema, req.body, ApiError);
  const room = await RoomsModel.createRoom({ dormId, floor, roomNumber });
  res.status(201).json(room);
});
