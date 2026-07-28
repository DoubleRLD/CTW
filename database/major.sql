-- Adds a "major" field to Roommate_Profile. This was already being
-- displayed on the Matches page (match.other_major) and referenced
-- nowhere else — the column, the form field, and the query that would
-- have populated it never existed, so it always showed "Major
-- unavailable."
ALTER TABLE Roommate_Profile
  ADD COLUMN major VARCHAR(255) NULL AFTER school_id;
