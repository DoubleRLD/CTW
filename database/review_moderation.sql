-- Adds review reporting/moderation. Any authenticated user can flag a
-- review; an admin (Users.is_admin) can review open reports and either
-- dismiss them or remove the underlying review.
ALTER TABLE Users
  ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Polymorphic across the two review tables (Dorm_Review / Listing_Review)
-- rather than two near-identical report tables. No FK on
-- (review_type, review_id) since it spans two tables — reviewReports.model.js
-- resolves the target review itself before inserting.
CREATE TABLE Review_Report (
    report_id          INT AUTO_INCREMENT PRIMARY KEY,
    review_type        ENUM('dorm', 'listing') NOT NULL,
    review_id          INT NOT NULL,
    reporter_user_id   INT NOT NULL,
    reason             TEXT,
    status             ENUM('open', 'resolved', 'dismissed') NOT NULL DEFAULT 'open',
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at        TIMESTAMP NULL,
    FOREIGN KEY (reporter_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_reports_status ON Review_Report(status);
CREATE INDEX idx_reports_review ON Review_Report(review_type, review_id);

-- Promote yourself to admin locally for testing, e.g.:
-- UPDATE Users SET is_admin = TRUE WHERE email = 'you@yourschool.edu';
