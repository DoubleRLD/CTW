-- Rooms was never seeded anywhere in this project — schema.sql defines
-- the table, but no seed file ever inserted rows into it, so every
-- dorm's "Write a Review" room dropdown was empty except for whatever
-- got created ad hoc through the API.
--
-- This generates 3 floors x 4 rooms (12 rooms per dorm) for every
-- existing dorm, numbered like 101-104, 201-204, 301-304.
-- INSERT IGNORE so it's safe to re-run and won't collide with any
-- room numbers that already exist (e.g. a manually created "312").
INSERT IGNORE INTO Rooms (dorm_id, floor, room_number)
SELECT d.dorm_id, f.floor, CONCAT(f.floor, LPAD(r.room_num, 2, '0'))
FROM Dorms d
CROSS JOIN (SELECT 1 AS floor UNION ALL SELECT 2 UNION ALL SELECT 3) f
CROSS JOIN (SELECT 1 AS room_num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) r;
