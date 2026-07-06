import { pool } from '../config/db.js';

// Schema enforces profile_id_a < profile_id_b (see schema.sql CHECK
// constraint) so (A,B) and (B,A) can't both exist as separate rows.
// This helper sorts the pair before every query/insert so callers
// don't have to remember to do it themselves.
function orderPair(profileIdA, profileIdB) {
  return profileIdA < profileIdB ? [profileIdA, profileIdB] : [profileIdB, profileIdA];
}

export async function findMatch(profileIdA, profileIdB) {
  const [a, b] = orderPair(profileIdA, profileIdB);
  const [rows] = await pool.query(
    'SELECT * FROM Roommate_Match WHERE profile_id_a = ? AND profile_id_b = ?',
    [a, b]
  );
  return rows[0] || null;
}

// Insert-or-update the compatibility score for a pair. Recomputing
// scores (e.g. after either profile is edited) should call this again
// rather than accumulating stale duplicate rows.
export async function upsertMatchScore(profileIdA, profileIdB, score) {
  const [a, b] = orderPair(profileIdA, profileIdB);
  await pool.query(
    `INSERT INTO Roommate_Match (profile_id_a, profile_id_b, compatibility_score)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE compatibility_score = VALUES(compatibility_score), computed_at = CURRENT_TIMESTAMP`,
    [a, b, score]
  );
  return findMatch(a, b);
}

// All matches involving a given profile, in either position (a or b),
// joined with the other profile's info so the frontend has everything
// it needs in one call.
export async function findMatchesForProfile(profileId) {
  const [rows] = await pool.query(
    `SELECT
       m.*,
       CASE WHEN m.profile_id_a = ? THEN m.profile_id_b ELSE m.profile_id_a END AS other_profile_id,
       u.name AS other_user_name,
       rp.bio AS other_bio,
       rp.sleep_schedule AS other_sleep_schedule,
       rp.cleanliness_level AS other_cleanliness_level,
       rp.noise_tolerance AS other_noise_tolerance,
       rp.budget_min AS other_budget_min,
       rp.budget_max AS other_budget_max
     FROM Roommate_Match m
     JOIN Roommate_Profile rp
       ON rp.room_profile_id = CASE WHEN m.profile_id_a = ? THEN m.profile_id_b ELSE m.profile_id_a END
     JOIN Users u ON u.user_id = rp.user_id
     WHERE m.profile_id_a = ? OR m.profile_id_b = ?
     ORDER BY m.compatibility_score DESC`,
    [profileId, profileId, profileId, profileId]
  );
  return rows;
}

export async function findMatchById(matchId) {
  const [rows] = await pool.query('SELECT * FROM Roommate_Match WHERE match_id = ?', [matchId]);
  return rows[0] || null;
}

export async function updateMatchStatus(matchId, status) {
  await pool.query(
    'UPDATE Roommate_Match SET status = ?, responded_at = CURRENT_TIMESTAMP WHERE match_id = ?',
    [status, matchId]
  );
  return findMatchById(matchId);
}
