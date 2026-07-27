INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('111 John Wesley Dobbs Ave NE, Atlanta, GA 30303', 1045, 1, 1, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';

INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('111 John Wesley Dobbs Ave NE, Atlanta, GA 30303', 1450, 2, 2, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';

-- ---------- The Mix (120 Piedmont Ave NE) ----------

INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('120 Piedmont Ave NE, Atlanta, GA 30303', 1200, 1, 1, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';

INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('120 Piedmont Ave NE, Atlanta, GA 30303', 1800, 2, 2, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';

-- ---------- Yugo Atlanta Summerhill (521 Hank Aaron Dr SW) ----------

INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('521 Hank Aaron Dr SW, Atlanta, GA 30312', 999, 1, 1, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';

INSERT INTO Listings (address, monthly_rent, bedrooms, bathrooms, listing_type)
VALUES ('521 Hank Aaron Dr SW, Atlanta, GA 30312', 1650, 2, 2, 'apartment');
SET @lid = LAST_INSERT_ID();
INSERT INTO Listing_School (listing_id, school_id)
SELECT @lid, school_id FROM Schools WHERE name = 'Georgia State University';
