/* DISCLAIMER!!
   AI was used in some Parts of this filE to create dummy data for students.
 */

-- Find Georgia State University's school ID
SET @gsu_id = (
    SELECT school_id
    FROM Schools
    WHERE name = 'Georgia State University'
    LIMIT 1
);

SET @gatech_id = (
    SELECT school_id
    FROM Schools
    WHERE name = 'Georgia Institute of Technology'
    LIMIT 1
);

SET @uga_id = (
    SELECT school_id
    FROM Schools
    WHERE name = 'University of Georgia'
    LIMIT 1
);

SET @kennesaw_id = (
    SELECT school_id
    FROM Schools
    WHERE name = 'Kennesaw State University'
    LIMIT 1
);

SET @emory_id = (
    SELECT school_id
    FROM Schools
    WHERE name = 'Emory University'
    LIMIT 1
);

/*
Dumbmy users
Password hashes are placeholders because these accounts
are only intended to appear in roommate matching results.
*/

INSERT INTO Users (
    school_id,
    name,
    email,
    password_hash,
    email_verified
)
VALUES

(@gsu_id, 'Maya Johnson', 'maya.johnson@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Jordan Kim', 'jordan.kim@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Alexis Brown', 'alexis.brown@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Ethan Patel', 'ethan.patel@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Sofia Garcia', 'sofia.garcia@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Noah Williams', 'noah.williams@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Jasmine Carter', 'jasmine.carter@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'David Nguyen', 'david.nguyen@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Taylor Brooks', 'taylor.brooks@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gsu_id, 'Morgan Lee', 'morgan.lee@student.gsu.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gatech_id, 'Avery Thompson', 'avery.thompson@gatech.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@gatech_id, 'Marcus Reed', 'marcus.reed@gatech.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@uga_id, 'Chloe Bennett', 'chloe.bennett@uga.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@uga_id, 'Caleb Foster', 'caleb.foster@uga.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@kennesaw_id, 'Nia Robinson', 'nia.robinson@students.kennesaw.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@kennesaw_id, 'Lucas Martin', 'lucas.martin@students.kennesaw.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@emory_id, 'Amara Wilson', 'amara.wilson@emory.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE),
(@emory_id, 'Henry Park', 'henry.park@emory.edu', 'DUMMY_ACCOUNT_NOT_FOR_LOGIN', TRUE);

-- ---------------------------------------------------------
-- Dummy roommate profiles
-- ---------------------------------------------------------

INSERT INTO Roommate_Profile (
    user_id,
    school_id,
    semester,
    semester_year,
    housing_preference,
    profile_picture,
    bio,
    roommate_pet_peeve,
    conflict_style,
    visitor_style,
    boundaries,
    sleep_schedule,
    cleanliness_level,
    noise_tolerance,
    study_habits,
    social_level,
    smoking,
    pets,
    budget_min,
    budget_max,
    move_in_date
)
VALUES

(
    (SELECT user_id FROM Users WHERE email = 'maya.johnson@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'either',
    NULL,
    'I am friendly, organized, and enjoy cooking, yoga, and quiet nights during the week.',
    'Leaving shared spaces messy for several days.',
    'I prefer calm and direct conversations before problems become bigger.',
    'I enjoy occasional guests but appreciate advance notice.',
    'Please ask before borrowing personal items.',
    'early_bird',
    5,
    2,
    'library',
    3,
    FALSE,
    FALSE,
    900,
    1250,
    '2026-08-01'
),

(
    (SELECT user_id FROM Users WHERE email = 'jordan.kim@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Computer science student who enjoys gaming, music, and late-night study sessions.',
    'People touching my gaming setup without asking.',
    'I like to talk through problems honestly and find a compromise.',
    'Friends may visit on weekends, but I will always communicate first.',
    'Quiet time after midnight unless we both agree otherwise.',
    'night_owl',
    3,
    4,
    'in_room',
    4,
    FALSE,
    FALSE,
    1000,
    1450,
    '2026-08-05'
),

(
    (SELECT user_id FROM Users WHERE email = 'alexis.brown@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'on_campus',
    NULL,
    'Biology student who is quiet, focused, and usually studying or watching movies.',
    'Loud phone calls while I am studying.',
    'I prefer respectful one-on-one conversations.',
    'I rarely have visitors and prefer a calm living space.',
    'Please respect quiet hours and shared study time.',
    'early_bird',
    4,
    1,
    'in_room',
    2,
    FALSE,
    FALSE,
    800,
    1100,
    '2026-08-03'
),

(
    (SELECT user_id FROM Users WHERE email = 'ethan.patel@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Outgoing student who enjoys sports, networking events, and exploring Atlanta.',
    'Passive-aggressive communication instead of discussing an issue.',
    'I prefer addressing problems quickly and directly.',
    'I enjoy having friends over occasionally, mostly on weekends.',
    'Guests should not stay overnight without a conversation first.',
    'flexible',
    3,
    4,
    'flexible',
    5,
    FALSE,
    FALSE,
    1100,
    1500,
    '2026-08-01'
),

(
    (SELECT user_id FROM Users WHERE email = 'sofia.garcia@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'either',
    NULL,
    'Psychology student who loves reading, coffee shops, art, and meeting new people.',
    'Not replacing shared supplies after using the last of something.',
    'I like to listen first and work toward a fair solution.',
    'I am comfortable with a few visitors as long as we communicate.',
    'Shared spaces should be cleaned after use.',
    'flexible',
    4,
    3,
    'library',
    4,
    FALSE,
    TRUE,
    950,
    1300,
    '2026-08-07'
),

(
    (SELECT user_id FROM Users WHERE email = 'noah.williams@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Relaxed student who enjoys gaming, basketball, and trying new restaurants.',
    'Leaving dirty dishes in the sink overnight.',
    'I am easygoing but prefer discussing issues before they build up.',
    'Friends may visit sometimes for games or study sessions.',
    'Please keep shared areas reasonably clean.',
    'night_owl',
    3,
    4,
    'in_room',
    4,
    FALSE,
    FALSE,
    1000,
    1350,
    '2026-08-10'
),

(
    (SELECT user_id FROM Users WHERE email = 'jasmine.carter@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'either',
    NULL,
    'Social and organized student who enjoys fashion, content creation, and campus events.',
    'Using my belongings without asking.',
    'I communicate directly but respectfully.',
    'I enjoy visitors, but I will give notice beforehand.',
    'Personal belongings and bedroom spaces should remain private.',
    'flexible',
    4,
    4,
    'flexible',
    5,
    FALSE,
    TRUE,
    950,
    1400,
    '2026-08-02'
),

(
    (SELECT user_id FROM Users WHERE email = 'david.nguyen@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'on_campus',
    NULL,
    'Engineering student who values structure, cleanliness, and a peaceful environment.',
    'Unexpected loud music late at night.',
    'I prefer calmly identifying the issue and agreeing on a solution.',
    'I rarely invite guests over during the week.',
    'Quiet hours after 10 PM on school nights.',
    'early_bird',
    5,
    1,
    'library',
    2,
    FALSE,
    FALSE,
    900,
    1200,
    '2026-08-04'
),

(
    (SELECT user_id FROM Users WHERE email = 'taylor.brooks@student.gsu.edu'),
    @gsu_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Creative student who enjoys photography, concerts, and decorating shared spaces.',
    'A roommate making strict household decisions without discussing them.',
    'I prefer open communication and finding a solution that works for everyone.',
    'I enjoy having friends over but respect schedules and quiet hours.',
    'Communicate before changing shared spaces or inviting overnight guests.',
    'night_owl',
    2,
    5,
    'flexible',
    5,
    FALSE,
    TRUE,
    850,
    1250,
    '2026-08-08'
),

(
    (SELECT user_id FROM Users WHERE email = 'morgan.lee@student.gsu.edu'),
 @gsu_id,
 'Fall',
 2026,
 'either',
 NULL,
 'Independent and easygoing student who enjoys running, meal prepping, and movie nights.',
 'Not communicating about bills or shared responsibilities.',
 'I prefer creating a clear plan and checking in calmly.',
 'I am fine with occasional visitors when notice is provided.',
 'Shared expenses and chores should be discussed clearly.',
 'flexible',
 4,
 3,
 'flexible',
 3,
 FALSE,
 FALSE,
 1000,
 1400,
 '2026-08-06'
),
(

    (SELECT user_id FROM Users WHERE email = 'avery.thompson@gatech.edu'),
    @gatech_id,
    'Fall',
    2026,
    'on_campus',
    NULL,
    'Engineering student who enjoys robotics, coffee shops, and structured study schedules.',
    'Leaving food or dishes in shared spaces.',
    'I prefer discussing issues directly and calmly.',
    'I rarely have guests during the week.',
    'Quiet time after 11 PM on school nights.',
    'night_owl',
    5,
    2,
    'in_room',
    3,
    FALSE,
    FALSE,
    1100,
    1450,
    '2026-08-12'

),

(

    (SELECT user_id FROM Users WHERE email = 'marcus.reed@gatech.edu'),
    @gatech_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Computer science student who likes gaming, basketball, and exploring Atlanta.',
    'A roommate being unclear about bills or chores.',
    'I like to solve problems early before they become stressful.',
    'Friends may visit occasionally on weekends.',
    'Shared expenses should be divided clearly.',
    'night_owl',
    3,
    4,
    'flexible',
    4,
    FALSE,
    FALSE,
    1200,
    1600,
    '2026-08-08'

),

(

    (SELECT user_id FROM Users WHERE email = 'chloe.bennett@uga.edu'),
    @uga_id,
    'Fall',
    2026,
    'either',
    NULL,
    'Journalism student who enjoys reading, fitness classes, and attending campus events.',
    'Loud music early in the morning.',
    'I prefer respectful conversations and compromise.',
    'I enjoy having a few friends over with notice.',
    'Please ask before borrowing clothes or personal items.',
    'flexible',
    4,
    3,
    'library',
    4,
    FALSE,
    TRUE,
    850,
    1200,
    '2026-08-10'

),

(

    (SELECT user_id FROM Users WHERE email = 'caleb.foster@uga.edu'),
    @uga_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Business student who enjoys sports, cooking, and social events.',
    'Ignoring shared cleaning responsibilities.',
    'I prefer being direct but respectful.',
    'I am comfortable with visitors, especially on weekends.',
    'Overnight guests should be discussed first.',
    'flexible',
    3,
    4,
    'flexible',
    5,
    FALSE,
    FALSE,
    900,
    1300,
    '2026-08-05'

),

(

    (SELECT user_id FROM Users WHERE email = 'nia.robinson@students.kennesaw.edu'),
    @kennesaw_id,
    'Fall',
    2026,
    'either',
    NULL,
    'Nursing student who values cleanliness, communication, and a quiet home environment.',
    'Leaving trash or laundry in common areas.',
    'I prefer calm conversations and clear expectations.',
    'I rarely invite guests over during the week.',
    'Quiet hours should be respected before early classes.',
    'early_bird',
    5,
    1,
    'library',
    2,
    FALSE,
    FALSE,
    800,
    1100,
    '2026-08-02'

),

(

    (SELECT user_id FROM Users WHERE email = 'lucas.martin@students.kennesaw.edu'),
    @kennesaw_id,
    'Fall',
    2026,
    'off_campus',
    NULL,
    'Information systems student who enjoys gaming, music, and working from home.',
    'Constant interruptions while I am studying.',
    'I prefer talking things out and agreeing on a solution.',
    'I may have friends over occasionally.',
    'Please knock before entering my room.',
    'night_owl',
    3,
    4,
    'in_room',
    4,
    FALSE,
    TRUE,
    850,
    1250,
    '2026-08-09'

),

(

    (SELECT user_id FROM Users WHERE email = 'amara.wilson@emory.edu'),
    @emory_id,
    'Fall',
    2026,
    'either',
    NULL,
    'Public health student who enjoys running, volunteering, and quiet movie nights.',
    'Not cleaning up after cooking.',
    'I prefer empathetic but honest conversations.',
    'I am fine with occasional visitors when notice is given.',
    'Shared spaces should stay clean and peaceful.',
    'early_bird',
    4,
    2,
    'library',
    3,
    FALSE,
    FALSE,
    1100,
    1500,
    '2026-08-06'

),
(
     (SELECT user_id FROM Users WHERE email = 'henry.park@emory.edu'),
     @emory_id,
     'Fall',
     2026,
     'off_campus',
     NULL,
     'Economics student who enjoys music, restaurants, and studying with friends.',
     'Passive-aggressive notes instead of direct communication.',
     'I prefer discussing concerns directly and finding a fair compromise.',
     'I enjoy visitors but will communicate first.',
     'Please communicate before hosting overnight guests.',
     'flexible',
     3,
     3,
     'flexible',
     4,
     FALSE,
     FALSE,
     1200,
     1700,
     '2026-08-11'
    );