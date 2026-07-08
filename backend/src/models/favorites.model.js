// Favorites model
// Provides simple DB helpers for the Favorites table (user bookmarks).
// This file was added as part of the "Save favorite listings" feature.
import { pool } from '../config/db.js';

// Return an array of listing_id values the user has saved
export async function getFavoritesByUser(userId) {
  const [rows] = await pool.query('SELECT listing_id FROM Favorites WHERE user_id = ?', [userId]);
  return rows.map((r) => r.listing_id);
}

export async function addFavorite(userId, listingId) {
  const [result] = await pool.query(
    'INSERT INTO Favorites (user_id, listing_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)',
    [userId, listingId]
  );
  return result.insertId;
}

export async function removeFavorite(userId, listingId) {
  const [result] = await pool.query('DELETE FROM Favorites WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
  return result.affectedRows > 0;
}

export async function isFavorite(userId, listingId) {
  const [rows] = await pool.query('SELECT 1 FROM Favorites WHERE user_id = ? AND listing_id = ? LIMIT 1', [userId, listingId]);
  return rows.length > 0;
}
