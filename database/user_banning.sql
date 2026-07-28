-- Adds ban capability for user management. is_admin already exists
-- from add_review_moderation.sql.
ALTER TABLE Users
  ADD COLUMN is_banned BOOLEAN NOT NULL DEFAULT FALSE;
