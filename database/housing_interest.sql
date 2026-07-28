-- Adds a "housing_interest" field to Roommate_Profile. Like `major`,
-- the Matches page already displayed match.other_housing_interest but
-- nothing anywhere actually collected or returned it, so it always
-- showed "Not specified".
ALTER TABLE Roommate_Profile
  ADD COLUMN housing_interest ENUM('on_campus', 'off_campus', 'either') NULL AFTER major;
