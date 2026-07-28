-- Adds real photo storage to Dorms and Listings. Photos are stored as
-- base64 data URLs directly in the row (LONGTEXT), the same pattern
-- already used for Roommate_Profile.profile_picture — no S3/cloud
-- storage config needed to get real user-submitted photos working.
ALTER TABLE Dorms
  ADD COLUMN image_url LONGTEXT NULL;

ALTER TABLE Listings
  ADD COLUMN image_url LONGTEXT NULL;
