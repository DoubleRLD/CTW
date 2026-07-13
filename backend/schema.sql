-- =========================================================
-- Dorm Rating + Roommate Matchmaking — MySQL Schema
-- =========================================================

CREATE TABLE Schools (
    school_id     INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A school can have more than one valid student email domain (common
-- in practice — e.g. a school using both its main domain and a
-- separate "students." subdomain, or one that rebranded and kept the
-- old domain alive). One-to-many instead of a single column on
-- Schools means adding a domain later is a one-row INSERT, not a
-- schema change.
CREATE TABLE School_Domains (
    domain_id     INT AUTO_INCREMENT PRIMARY KEY,
    school_id     INT NOT NULL,
    domain        VARCHAR(255) NOT NULL UNIQUE,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id) ON DELETE CASCADE
);

CREATE TABLE Users (
    user_id                     INT AUTO_INCREMENT PRIMARY KEY,
    school_id                   INT NOT NULL,
    name                        VARCHAR(255) NOT NULL,
    email                       VARCHAR(255) NOT NULL UNIQUE,
    password_hash               VARCHAR(255) NOT NULL,
    email_verified              BOOLEAN NOT NULL DEFAULT FALSE,
    -- Verification tokens are stored hashed (SHA-256), never in plain
    -- text — same principle as passwords: if the DB ever leaks, a raw
    -- token would let an attacker verify/hijack any pending signup.
    verification_token_hash     CHAR(64),
    verification_token_expires  TIMESTAMP NULL,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id) ON DELETE CASCADE
);

CREATE TABLE Dorms (
    dorm_id     INT AUTO_INCREMENT PRIMARY KEY,
    school_id   INT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id) ON DELETE CASCADE
);

CREATE TABLE Rooms (
    room_id      INT AUTO_INCREMENT PRIMARY KEY,
    dorm_id      INT NOT NULL,
    floor        INT,
    room_number  VARCHAR(20) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dorm_id) REFERENCES Dorms(dorm_id) ON DELETE CASCADE,
    UNIQUE KEY uq_room_per_dorm (dorm_id, room_number)
);

-- =========================================================
-- Reviews (category ratings instead of a single overall number)
-- =========================================================

CREATE TABLE Dorm_Review (
    dorm_review_id       INT AUTO_INCREMENT PRIMARY KEY,
    room_id               INT NOT NULL,
    user_id               INT NOT NULL,
    semester              ENUM('Fall','Spring','Summer') NOT NULL,
    semester_year          YEAR NOT NULL,
    cleanliness_rating    TINYINT NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
    noise_rating          TINYINT NOT NULL CHECK (noise_rating BETWEEN 1 AND 5),
    location_rating       TINYINT NOT NULL CHECK (location_rating BETWEEN 1 AND 5),
    overall_rating        TINYINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    body                   TEXT,
    created_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    -- one review per user per room per semester (prevents review spam / duplicate reviews)
    UNIQUE KEY uq_review_per_user_room_semester (user_id, room_id, semester, semester_year)
);

-- =========================================================
-- Off-campus housing (listings)
-- =========================================================

CREATE TABLE Landlords (
    landlord_id   INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255),
    phone         VARCHAR(20),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Listings (
    listing_id     INT AUTO_INCREMENT PRIMARY KEY,
    landlord_id    INT,                          -- nullable: listing may be added by students before landlord info is known
    name           VARCHAR(255),                 -- nullable: named apartment complexes have one (e.g. "The Mix"), a random single-owner rental may not
    address        VARCHAR(255) NOT NULL,
    latitude       DECIMAL(9,6),                 -- for map display / distance-from-campus sorting
    longitude      DECIMAL(9,6),
    monthly_rent   DECIMAL(8,2) NOT NULL,
    bedrooms       TINYINT NOT NULL,
    bathrooms      DECIMAL(3,1) NOT NULL,        -- allows 1.5 baths
    listing_type   ENUM('apartment','house','condo','townhouse') NOT NULL DEFAULT 'apartment',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (landlord_id) REFERENCES Landlords(landlord_id) ON DELETE SET NULL
);

-- Many-to-many: an off-campus listing can be near/relevant to multiple schools
CREATE TABLE Listing_School (
    listing_id   INT NOT NULL,
    school_id    INT NOT NULL,
    distance_mi  DECIMAL(4,2),  -- optional: distance from this school's campus
    PRIMARY KEY (listing_id, school_id),
    FOREIGN KEY (listing_id) REFERENCES Listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id) ON DELETE CASCADE
);

CREATE TABLE Listing_Review (
    listing_review_id    INT AUTO_INCREMENT PRIMARY KEY,
    listing_id            INT NOT NULL,
    user_id                INT NOT NULL,
    semester               ENUM('Fall','Spring','Summer') NOT NULL,
    semester_year          YEAR NOT NULL,
    landlord_rating        TINYINT NOT NULL CHECK (landlord_rating BETWEEN 1 AND 5),
    maintenance_rating     TINYINT NOT NULL CHECK (maintenance_rating BETWEEN 1 AND 5),
    value_rating           TINYINT NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    overall_rating         TINYINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    body                    TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES Listings(listing_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE KEY uq_review_per_user_listing_semester (user_id, listing_id, semester, semester_year)
);

-- =========================================================
-- Roommate matchmaking
-- =========================================================

CREATE TABLE Roommate_Profile (
    room_profile_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL,
    school_id         INT NOT NULL,
    semester          ENUM('Fall','Spring','Summer') NOT NULL,
    semester_year     YEAR NOT NULL,
    profile_picture   LONGTEXT,
    bio               TEXT,
    -- open response fields used by the AI compatibility analysis
    roommate_pet_peeve TEXT,
    conflict_style    TEXT,
    visitor_style     TEXT,
    boundaries        TEXT,
    -- structured preference fields the matching algorithm actually compares
    sleep_schedule    ENUM('early_bird','night_owl','flexible') NOT NULL,
    cleanliness_level TINYINT NOT NULL CHECK (cleanliness_level BETWEEN 1 AND 5),
    noise_tolerance   TINYINT NOT NULL CHECK (noise_tolerance BETWEEN 1 AND 5),
    study_habits      ENUM('in_room','library','flexible') NOT NULL,
    social_level      TINYINT NOT NULL CHECK (social_level BETWEEN 1 AND 5), -- 1=introvert, 5=extrovert
    smoking           BOOLEAN NOT NULL DEFAULT FALSE,
    pets              BOOLEAN NOT NULL DEFAULT FALSE,

    budget_min        INT,
    budget_max        INT,
    move_in_date      DATE,

    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (school_id) REFERENCES Schools(school_id) ON DELETE CASCADE,

    -- one active profile per user per semester
    UNIQUE KEY uq_profile_per_user_semester (user_id, semester, semester_year),
    CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min)
);

CREATE TABLE Roommate_Match (
    match_id             INT AUTO_INCREMENT PRIMARY KEY,
    profile_id_a         INT NOT NULL,
    profile_id_b         INT NOT NULL,
    compatibility_score  DECIMAL(5,2) NOT NULL,   -- e.g. 0.00-100.00
    status                ENUM('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
    computed_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at          TIMESTAMP NULL,

    FOREIGN KEY (profile_id_a) REFERENCES Roommate_Profile(room_profile_id) ON DELETE CASCADE,
    FOREIGN KEY (profile_id_b) REFERENCES Roommate_Profile(room_profile_id) ON DELETE CASCADE,

    -- prevent A-B and B-A duplicate rows, and self-matches
    CHECK (profile_id_a < profile_id_b),
    UNIQUE KEY uq_match_pair (profile_id_a, profile_id_b)
);

-- =========================================================
-- Helpful indexes for common query patterns
-- =========================================================
CREATE INDEX idx_users_school ON Users(school_id);
CREATE INDEX idx_school_domains_school ON School_Domains(school_id);
CREATE INDEX idx_dorms_school ON Dorms(school_id);
CREATE INDEX idx_rooms_dorm ON Rooms(dorm_id);
CREATE INDEX idx_reviews_room ON Dorm_Review(room_id);
CREATE INDEX idx_profiles_school_semester ON Roommate_Profile(school_id, semester, semester_year);
CREATE INDEX idx_matches_status ON Roommate_Match(status);
CREATE INDEX idx_listings_landlord ON Listings(landlord_id);
CREATE INDEX idx_listings_location ON Listings(latitude, longitude);
CREATE INDEX idx_listing_reviews_listing ON Listing_Review(listing_id);
