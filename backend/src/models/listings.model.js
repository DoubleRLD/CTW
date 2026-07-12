import { pool } from '../config/db.js';

// Joins Listing_School since school filtering happens through the
// many-to-many table, not a direct column on Listings. GROUP_CONCAT
// pulls in every linked school's name as one comma-separated string
// (a listing can be near more than one school) without needing a
// separate query per listing.
export async function findAllListings({ schoolId }) {
  let sql = `
    SELECT
      l.*,
      GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', ') AS school_names,
      ROUND(AVG(lr.overall_rating), 2) AS avg_rating,
      COUNT(DISTINCT lr.listing_review_id) AS review_count
    FROM Listings l
    LEFT JOIN Listing_School ls ON ls.listing_id = l.listing_id
    LEFT JOIN Schools s ON s.school_id = ls.school_id
    LEFT JOIN Listing_Review lr ON lr.listing_id = l.listing_id
  `;
  const params = [];

  if (schoolId) {
    sql += ' WHERE l.listing_id IN (SELECT listing_id FROM Listing_School WHERE school_id = ?)';
    params.push(schoolId);
  }

  sql += ' GROUP BY l.listing_id ORDER BY l.created_at DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function findListingById(listingId) {
  const [rows] = await pool.query('SELECT * FROM Listings WHERE listing_id = ?', [listingId]);
  return rows[0] || null;
}

// Includes landlord info and average rating, same approach as
// findDormWithStats — LEFT JOINs so a listing with no reviews yet
// (or no landlord assigned) still returns a row instead of nothing.
export async function findListingWithStats(listingId) {
  const [rows] = await pool.query(
    `SELECT
       l.*,
       ld.name AS landlord_name,
       ld.email AS landlord_email,
       ld.phone AS landlord_phone,
       GROUP_CONCAT(DISTINCT s.name ORDER BY s.name SEPARATOR ', ') AS school_names,
       ROUND(AVG(lr.overall_rating), 2) AS avg_rating,
       COUNT(DISTINCT lr.listing_review_id) AS review_count
     FROM Listings l
     LEFT JOIN Landlords ld ON ld.landlord_id = l.landlord_id
     LEFT JOIN Listing_School ls ON ls.listing_id = l.listing_id
     LEFT JOIN Schools s ON s.school_id = ls.school_id
     LEFT JOIN Listing_Review lr ON lr.listing_id = l.listing_id
     WHERE l.listing_id = ?
     GROUP BY l.listing_id`,
    [listingId]
  );
  return rows[0] || null;
}

export async function createListing({
  landlordId,
  address,
  latitude,
  longitude,
  monthlyRent,
  bedrooms,
  bathrooms,
  listingType,
  schoolIds,
}) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO Listings
         (landlord_id, address, latitude, longitude, monthly_rent, bedrooms, bathrooms, listing_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [landlordId ?? null, address, latitude ?? null, longitude ?? null, monthlyRent, bedrooms, bathrooms, listingType]
    );
    const listingId = result.insertId;

    // A listing can be linked to multiple nearby schools (many-to-many).
    if (schoolIds?.length) {
      const values = schoolIds.map((schoolId) => [listingId, schoolId]);
      await conn.query('INSERT INTO Listing_School (listing_id, school_id) VALUES ?', [values]);
    }

    await conn.commit();
    return findListingById(listingId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
