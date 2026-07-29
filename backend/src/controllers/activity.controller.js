import * as ActivityModel from '../models/activity.model.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const ICONS = {
  favorite: '❤️',
  dorm_review: '⭐',
  listing_review: '⭐',
};

// GET /api/activity/me — recent saves + reviews for the authenticated user
export const getMyActivity = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const rows = await ActivityModel.getRecentActivity(req.user.userId, limit);

  res.json({
    activities: rows.map((row) => ({
      id: `${row.activity_type}-${row.activity_id}`,
      icon: ICONS[row.activity_type] || '📌',
      text: row.text,
      time: row.created_at,
    })),
  });
});
