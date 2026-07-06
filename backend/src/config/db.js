import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// A connection pool, not a single connection — Express handles many
// concurrent requests, so each query borrows a connection and returns
// it when done, rather than every request fighting over one socket.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick sanity check you can call from server.js on boot, so a bad
// DB config fails loudly at startup instead of on the first request.
export async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.query('SELECT 1');
    console.log('Database connection OK');
  } finally {
    conn.release();
  }
}
