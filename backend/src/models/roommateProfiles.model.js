import { pool } from '../config/db.js';

export async function findProfileByUserAndSemester(userId, semester, semesterYear) {
  const [rows] = await pool.query(
    'SELECT * FROM Roommate_Profile WHERE user_id = ? AND semester = ? AND semester_year = ?',
    [userId, semester, semesterYear]
  );
  return rows[0] || null;
}

export async function findProfileById(profileId) {
  const [rows] = await pool.query(
    `SELECT rp.*, u.name AS user_name
     FROM Roommate_Profile rp
     JOIN Users u ON u.user_id = rp.user_id
     WHERE rp.room_profile_id = ?`,
    [profileId]
  );
  return rows[0] || null;
}

// Other students' profiles at the same school + semester, for browsing
// or as candidates for compatibility scoring. Excludes the caller's
// own profile.
export async function findProfilesForMatching({ schoolId, semester, semesterYear, excludeUserId }) {
  const [rows] = await pool.query(
    `SELECT rp.*, u.name AS user_name
     FROM Roommate_Profile rp
     JOIN Users u ON u.user_id = rp.user_id
     WHERE rp.school_id = ? AND rp.semester = ? AND rp.semester_year = ? AND rp.user_id != ?`,
    [schoolId, semester, semesterYear, excludeUserId]
  );
  return rows;
}

// One profile per user per semester (matches the UNIQUE constraint in
// the schema) — this is an upsert so re-submitting the form updates
// the existing profile instead of erroring on a duplicate key.
export async function upsertProfile(data) {
  const existing = await findProfileByUserAndSemester(data.userId, data.semester, data.semesterYear);

  if (existing) {
    await pool.query(
      `UPDATE Roommate_Profile SET
         bio = ?, 
         roommate_pet_peeve = ?, 
         conflict_style = ?, 
         visitor_style = ?, 
         boundaries = ?,
         sleep_schedule = ?, 
         cleanliness_level = ?, 
         noise_tolerance = ?,
         study_habits = ?, 
         social_level = ?, 
         smoking = ?, 
         pets = ?,
         budget_min = ?, 
         budget_max = ?, 
         move_in_date = ?
       WHERE room_profile_id = ?`,
      [
        data.bio ?? null,
        data.roommatePetPeeve ?? null,
        data.conflictStyle ?? null,
        data.visitorStyle ?? null,
        data.boundaries ?? null,
        data.sleepSchedule,
        data.cleanlinessLevel,
        data.noiseTolerance,
        data.studyHabits,
        data.socialLevel,
        data.smoking,
        data.pets,
        data.budgetMin ?? null,
        data.budgetMax ?? null,
        data.moveInDate ?? null,
        existing.room_profile_id,
      ]
    );
    return findProfileById(existing.room_profile_id);
  }

  const [result] = await pool.query(
    `INSERT INTO Roommate_Profile
       (user_id, 
        school_id, 
        semester, 
        semester_year, 
        bio, 
        roommate_pet_peeve, 
        visitor_style, 
        conflict_style, 
        boundaries, 
        sleep_schedule, 
        cleanliness_level, 
        noise_tolerance, 
        study_habits, 
        social_level, 
        smoking, 
        pets, 
        budget_min, 
        budget_max, 
        move_in_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.userId,
      data.schoolId,
      data.semester,
      data.semesterYear,
      data.bio ?? null,
      data.roommatePetPeeve ?? null,
      data.visitorStyle ?? null,
      data.conflictStyle ?? null,
      data.boundaries ?? null,
      data.sleepSchedule,
      data.cleanlinessLevel,
      data.noiseTolerance,
      data.studyHabits,
      data.socialLevel,
      data.smoking,
      data.pets,
      data.budgetMin ?? null,
      data.budgetMax ?? null,
      data.moveInDate ?? null,
    ]
  );
  return findProfileById(result.insertId);
}
