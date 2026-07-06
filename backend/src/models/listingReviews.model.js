import { pool } from '../config/db.js';

export async function findReviewsByListing(listingId) {
  const [rows] = await pool.query(
    `SELECT lr.*, u.name AS reviewer_name
     FROM Listing_Review lr
     JOIN Users u ON u.user_id = lr.user_id
     WHERE lr.listing_id = ?
     ORDER BY lr.created_at DESC`,
    [listingId]
  );
  return rows;
}

export async function findReviewById(reviewId) {
  const [rows] = await pool.query('SELECT * FROM Listing_Review WHERE listing_review_id = ?', [reviewId]);
  return rows[0] || null;
}

export async function createReview({
  listingId,
  userId,
  semester,
  semesterYear,
  landlordRating,
  maintenanceRating,
  valueRating,
  overallRating,
  body,
}) {
  const [result] = await pool.query(
    `INSERT INTO Listing_Review
       (listing_id, user_id, semester, semester_year, landlord_rating, maintenance_rating, value_rating, overall_rating, body)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [listingId, userId, semester, semesterYear, landlordRating, maintenanceRating, valueRating, overallRating, body ?? null]
  );
  return findReviewById(result.insertId);
}

export async function deleteReview(reviewId, userId) {
  const [result] = await pool.query(
    'DELETE FROM Listing_Review WHERE listing_review_id = ? AND user_id = ?',
    [reviewId, userId]
  );
  return result.affectedRows > 0;
}
