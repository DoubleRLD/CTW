-- =========================================================
-- Seed: On-campus residence halls for the 4 largest research
-- universities (UGA, Georgia Tech, GSU, Augusta University)
-- =========================================================
-- Sourced from each school's official housing website (not guessed):
--   UGA           -> housing.uga.edu/halls-information (official table, 32 halls)
--   Georgia Tech  -> housing.gatech.edu Area Offices page (official "buildings managed" lists, 33 halls)
--   GSU           -> myhousing.gsu.edu (official communities list, 6)
--   Augusta Univ. -> augusta.edu/housing (official residence halls page, 5)
--
-- Run this after seed.sql (needs Schools rows to already exist).
-- Address is intentionally just city/state — exact street addresses
-- per building weren't verified and aren't critical for the app.
--
-- Rooms are NOT seeded here — those get created organically through
-- the app's "my room isn't listed" flow (see rooms.model.js), the same
-- way real student-submitted data would arrive.

-- ---------- University of Georgia ----------

INSERT INTO Dorms (school_id, name, address)
SELECT school_id, hall, 'Athens, GA'
FROM Schools, (
  SELECT 'Black-Diallo-Miller Hall' AS hall UNION ALL SELECT 'Boggs Hall' UNION ALL
  SELECT 'Brandon Oaks' UNION ALL SELECT 'Brown Hall' UNION ALL SELECT 'Brumby Hall' UNION ALL
  SELECT 'Building 1516' UNION ALL SELECT 'Building 2266' UNION ALL SELECT 'Busbee Hall' UNION ALL
  SELECT 'Church Hall' UNION ALL SELECT 'Creswell Hall' UNION ALL SELECT 'Expanded Busbee Hall' UNION ALL
  SELECT 'Expanded McWhorter Hall' UNION ALL SELECT 'Expanded Rooker Hall' UNION ALL
  SELECT 'Expanded Vandiver Hall' UNION ALL SELECT 'Hill Hall' UNION ALL SELECT 'Lipscomb Hall' UNION ALL
  SELECT 'Mary Lyndon Hall' UNION ALL SELECT 'McWhorter Hall' UNION ALL SELECT 'Mell Hall' UNION ALL
  SELECT 'Morris Hall' UNION ALL SELECT 'Myers Hall' UNION ALL SELECT 'Oglethorpe House' UNION ALL
  SELECT 'Payne Hall' UNION ALL SELECT 'Reed Hall' UNION ALL SELECT 'Rogers Road' UNION ALL
  SELECT 'Rooker Hall' UNION ALL SELECT 'Russell Hall' UNION ALL SELECT 'Rutherford Hall' UNION ALL
  SELECT 'Soule Hall' UNION ALL SELECT 'University Village' UNION ALL
  SELECT 'University Village East' UNION ALL SELECT 'Vandiver Hall'
) AS halls
WHERE Schools.name = 'University of Georgia';

-- ---------- Georgia Institute of Technology ----------

INSERT INTO Dorms (school_id, name, address)
SELECT school_id, hall, 'Atlanta, GA'
FROM Schools, (
  SELECT 'Brown Hall' AS hall UNION ALL SELECT 'Cloudman Hall' UNION ALL SELECT 'Field Hall' UNION ALL
  SELECT 'Glenn Hall' UNION ALL SELECT 'Goldin House' UNION ALL SELECT 'Gray House' UNION ALL
  SELECT 'Hanson Hall' UNION ALL SELECT 'Harris Hall' UNION ALL SELECT 'Harrison Hall' UNION ALL
  SELECT 'Hayes House' UNION ALL SELECT 'Hopkins Hall' UNION ALL SELECT 'Howell Hall' UNION ALL
  SELECT 'Matheson Hall' UNION ALL SELECT 'Perry Hall' UNION ALL SELECT 'Smith Hall' UNION ALL
  SELECT 'Stein House' UNION ALL SELECT 'Towers Hall' UNION ALL SELECT 'Armstrong Hall' UNION ALL
  SELECT 'Caldwell Hall' UNION ALL SELECT 'Crecine Hall' UNION ALL SELECT 'Center Street Apartments' UNION ALL
  SELECT 'Eighth Street Apartments' UNION ALL SELECT 'Fitten Hall' UNION ALL SELECT 'Folk Hall' UNION ALL
  SELECT 'Freeman Hall' UNION ALL SELECT 'Fulmer Hall' UNION ALL SELECT 'Hefner Hall' UNION ALL
  SELECT 'Maulding Hall' UNION ALL SELECT 'Montag Hall' UNION ALL SELECT 'Nelson-Shell Hall' UNION ALL
  SELECT 'Woodruff North' UNION ALL SELECT 'Woodruff South' UNION ALL SELECT 'Zbar Hall'
) AS halls
WHERE Schools.name = 'Georgia Institute of Technology';

-- ---------- Georgia State University ----------

INSERT INTO Dorms (school_id, name, address)
SELECT school_id, hall, 'Atlanta, GA'
FROM Schools, (
  SELECT 'Patton Hall' AS hall UNION ALL SELECT 'Piedmont Central' UNION ALL
  SELECT 'Piedmont North' UNION ALL SELECT 'University Commons' UNION ALL
  SELECT 'University Lofts' UNION ALL SELECT 'Greek Housing'
) AS halls
WHERE Schools.name = 'Georgia State University';

-- ---------- Augusta University ----------

INSERT INTO Dorms (school_id, name, address)
SELECT school_id, hall, 'Augusta, GA'
FROM Schools, (
  SELECT 'Oak Hall' AS hall UNION ALL SELECT 'Elm Hall' UNION ALL
  SELECT 'Beacon Station' UNION ALL SELECT 'The Row' UNION ALL SELECT 'University Village'
) AS halls
WHERE Schools.name = 'Augusta University';
