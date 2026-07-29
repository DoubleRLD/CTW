import { pool } from '../config/db.js';

export async function createReport({ reviewType, reviewId, reporterUserId, reason }) {
  const [result] = await pool.query(
    `INSERT INTO Review_Report (review_type, review_id, reporter_user_id, reason)
     VALUES (?, ?, ?, ?)`,
    [reviewType, reviewId, reporterUserId, reason ?? null]
  );
  return findReportById(result.insertId);
}

export async function findReportById(reportId) {
  const [rows] = await pool.query('SELECT * FROM Review_Report WHERE report_id = ?', [reportId]);
  return rows[0] || null;
}

// Open reports for the admin queue, joined with the underlying
// review's content so an admin can see what's being flagged without a
// second round trip. Dorm and listing reports have different review
// tables to join against, so this runs both and merges — the alternative
// (one giant UNION across differently-shaped review tables) would need
// to pad columns that don't apply to one type or the other, which is
// harder to read than just merging two smaller queries in JS.
export async function findOpenReports() {
  const [dormReports] = await pool.query(
    `SELECT
       rr.report_id, rr.review_type, rr.review_id, rr.reason, rr.status, rr.created_at,
       reporter.name AS reporter_name,
       dr.body AS review_body,
       dr.overall_rating,
       author.name AS review_author_name,
       d.name AS context_name
     FROM Review_Report rr
     JOIN users reporter ON reporter.user_id = rr.reporter_user_id
     JOIN Dorm_Review dr ON dr.dorm_review_id = rr.review_id
     JOIN users author ON author.user_id = dr.user_id
     JOIN Rooms r ON r.room_id = dr.room_id
     JOIN Dorms d ON d.dorm_id = r.dorm_id
     WHERE rr.review_type = 'dorm' AND rr.status = 'open'`
  );

  const [listingReports] = await pool.query(
    `SELECT
       rr.report_id, rr.review_type, rr.review_id, rr.reason, rr.status, rr.created_at,
       reporter.name AS reporter_name,
       lr.body AS review_body,
       lr.overall_rating,
       author.name AS review_author_name,
       COALESCE(l.name, l.address) AS context_name
     FROM Review_Report rr
     JOIN users reporter ON reporter.user_id = rr.reporter_user_id
     JOIN Listing_Review lr ON lr.listing_review_id = rr.review_id
     JOIN users author ON author.user_id = lr.user_id
     JOIN Listings l ON l.listing_id = lr.listing_id
     WHERE rr.review_type = 'listing' AND rr.status = 'open'`
  );

  return [...dormReports, ...listingReports].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
}

export async function resolveReport(reportId, status) {
  await pool.query(
    'UPDATE Review_Report SET status = ?, resolved_at = CURRENT_TIMESTAMP WHERE report_id = ?',
    [status, reportId]
  );
  return findReportById(reportId);
}
