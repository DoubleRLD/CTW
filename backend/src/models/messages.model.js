import { pool } from "../config/db.js";

/**
 * Verify that the logged-in user belongs to an accepted roommate match.
 */
export async function findAcceptedMatchForUser(matchId, userId) {
  const [rows] = await pool.query(
    `
    SELECT
      rm.match_id,
      rm.profile_id_a,
      rm.profile_id_b,
      rm.status,
      profileA.user_id AS user_id_a,
      profileB.user_id AS user_id_b
    FROM Roommate_Match rm
    JOIN Roommate_Profile profileA
      ON profileA.room_profile_id = rm.profile_id_a
    JOIN Roommate_Profile profileB
      ON profileB.room_profile_id = rm.profile_id_b
    WHERE rm.match_id = ?
      AND rm.status = 'accepted'
      AND (profileA.user_id = ? OR profileB.user_id = ?)
    LIMIT 1
    `,
    [matchId, userId, userId]
  );

  return rows[0] || null;
}

/**
 * Find an existing conversation for a match.
 */
export async function findConversationByMatch(matchId) {
  const [rows] = await pool.query(
    `
    SELECT
      conversation_id,
      match_id,
      created_at
    FROM Conversations
    WHERE match_id = ?
    LIMIT 1
    `,
    [matchId]
  );

  return rows[0] || null;
}

/**
 * Create a new conversation.
 */
export async function createConversation(matchId) {
  const [result] = await pool.query(
    `
    INSERT INTO Conversations (match_id)
    VALUES (?)
    `,
    [matchId]
  );

  return {
    conversation_id: result.insertId,
    match_id: matchId,
  };
}

/**
 * Retrieve all messages for a conversation.
 */
export async function findMessagesByConversation(conversationId) {
  const [rows] = await pool.query(
    `
    SELECT
      m.message_id,
      m.conversation_id,
      m.sender_user_id,
      u.name AS sender_name,
      m.message_text,
      m.sent_at,
      m.read_at
    FROM Messages m
    JOIN Users u
      ON u.user_id = m.sender_user_id
    WHERE m.conversation_id = ?
    ORDER BY m.sent_at ASC, m.message_id ASC
    `,
    [conversationId]
  );

  return rows;
}

/**
 * Save a new message.
 */
export async function createMessage({
  conversationId,
  senderUserId,
  messageText,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO Messages (
      conversation_id,
      sender_user_id,
      message_text
    )
    VALUES (?, ?, ?)
    `,
    [conversationId, senderUserId, messageText]
  );

  const [rows] = await pool.query(
    `
    SELECT
      m.message_id,
      m.conversation_id,
      m.sender_user_id,
      u.name AS sender_name,
      m.message_text,
      m.sent_at,
      m.read_at
    FROM Messages m
    JOIN Users u
      ON u.user_id = m.sender_user_id
    WHERE m.message_id = ?
    LIMIT 1
    `,
    [result.insertId]
  );

  return rows[0] || null;
}