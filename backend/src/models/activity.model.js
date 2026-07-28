import { pool } from '../config/db.js';

// There's no dedicated "activity log" table — recent activity is
// derived on the fly from actions that already have their own
// created_at timestamp: saving a listing, and writing a dorm or
// listing review. UNION ALL keeps this to one round trip instead of
// three separate queries the caller would have to merge and sort.
export async function getRecentActivity(userId, limit = 10) {
  const [rows] = await pool.query(
    `
    (
      SELECT
        'favorite' AS activity_type,
        f.favorite_id AS activity_id,
        CONCAT('Saved ', COALESCE(l.name, l.address)) AS text,
        f.created_at AS created_at
      FROM Favorites f
      JOIN Listings l ON l.listing_id = f.listing_id
      WHERE f.user_id = ?
    )
    UNION ALL
    (
      SELECT
        'dorm_review' AS activity_type,
        dr.dorm_review_id AS activity_id,
        CONCAT('Reviewed ', d.name) AS text,
        dr.created_at AS created_at
      FROM Dorm_Review dr
      JOIN Rooms r ON r.room_id = dr.room_id
      JOIN Dorms d ON d.dorm_id = r.dorm_id
      WHERE dr.user_id = ?
    )
    UNION ALL
    (
      SELECT
        'listing_review' AS activity_type,
        lr.listing_review_id AS activity_id,
        CONCAT('Reviewed ', COALESCE(l.name, l.address)) AS text,
        lr.created_at AS created_at
      FROM Listing_Review lr
      JOIN Listings l ON l.listing_id = lr.listing_id
      WHERE lr.user_id = ?
    )
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [userId, userId, userId, Number(limit)]
  );
  return rows;
}
