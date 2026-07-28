-- Adds requester tracking to Roommate_Match so the app can tell the
-- difference between "a candidate the matching algorithm surfaced but
-- nobody has acted on yet" (requester_user_id IS NULL), "I sent them
-- a request" (requester_user_id = me), and "they sent me a request"
-- (requester_user_id = them). Without this there's no way to know
-- which side of a pending match is the sender.
ALTER TABLE Roommate_Match
  ADD COLUMN requester_user_id INT NULL AFTER status,
  ADD CONSTRAINT fk_match_requester
    FOREIGN KEY (requester_user_id) REFERENCES Users(user_id) ON DELETE SET NULL;

CREATE INDEX idx_matches_requester ON Roommate_Match(requester_user_id);
