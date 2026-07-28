-- =========================================================
-- Seed: Georgia colleges & universities + their email domains
-- =========================================================
-- Covers the 26 University System of Georgia (public) institutions
-- plus the residential private, nonprofit four-year colleges
-- (via the Georgia Independent College Association member list) and
-- SCAD. Deliberately excludes the Technical College System of
-- Georgia's 22 schools — those are primarily commuter institutions
-- without the on-campus/roommate dynamics this app is built around.
-- Add them the same way if that scope changes.
--
-- CONFIDENCE NOTE: domains for the well-known public universities and
-- major private schools (Emory, Mercer, Spelman, Morehouse, Clark
-- Atlanta, Berry, SCAD, etc.) are well-established and stable. A
-- handful of smaller private colleges (flagged inline below) have
-- lower-confidence domains pulled from directory listings rather than
-- a verified source — spot-check those specifically before relying on
-- them for real student signups.
--
-- Run this after schema.sql, once, on a fresh database.

-- ---------- University System of Georgia (public) ----------

INSERT INTO Schools (name) VALUES ('Augusta University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'augusta.edu');

INSERT INTO Schools (name) VALUES ('Georgia Institute of Technology');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gatech.edu');

INSERT INTO Schools (name) VALUES ('Georgia State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gsu.edu');

INSERT INTO Schools (name) VALUES ('University of Georgia');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'uga.edu');

INSERT INTO Schools (name) VALUES ('Georgia Southern University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'georgiasouthern.edu');

INSERT INTO Schools (name) VALUES ('Kennesaw State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'kennesaw.edu');

INSERT INTO Schools (name) VALUES ('University of West Georgia');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'westga.edu');

INSERT INTO Schools (name) VALUES ('Valdosta State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'valdosta.edu');

INSERT INTO Schools (name) VALUES ('Albany State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'asurams.edu');

INSERT INTO Schools (name) VALUES ('Clayton State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'clayton.edu');

INSERT INTO Schools (name) VALUES ('Columbus State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'columbusstate.edu');

INSERT INTO Schools (name) VALUES ('Fort Valley State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'fvsu.edu');

INSERT INTO Schools (name) VALUES ('Georgia College & State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gcsu.edu');

INSERT INTO Schools (name) VALUES ('Georgia Southwestern State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gsw.edu');

INSERT INTO Schools (name) VALUES ('Middle Georgia State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'mga.edu');

INSERT INTO Schools (name) VALUES ('Savannah State University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'savannahstate.edu');

INSERT INTO Schools (name) VALUES ('University of North Georgia');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'ung.edu');

INSERT INTO Schools (name) VALUES ('Abraham Baldwin Agricultural College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'abac.edu');

INSERT INTO Schools (name) VALUES ('Atlanta Metropolitan State College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'atlm.edu');

INSERT INTO Schools (name) VALUES ('College of Coastal Georgia');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'ccga.edu');

INSERT INTO Schools (name) VALUES ('Dalton State College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'daltonstate.edu');

INSERT INTO Schools (name) VALUES ('East Georgia State College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'ega.edu');

INSERT INTO Schools (name) VALUES ('Georgia Gwinnett College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'ggc.edu');

INSERT INTO Schools (name) VALUES ('Georgia Highlands College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'highlands.edu');

INSERT INTO Schools (name) VALUES ('Gordon State College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'gordonstate.edu');

INSERT INTO Schools (name) VALUES ('South Georgia State College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'sgsc.edu');

-- ---------- Private, nonprofit four-year colleges ----------

INSERT INTO Schools (name) VALUES ('Agnes Scott College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'agnesscott.edu');

INSERT INTO Schools (name) VALUES ('Berry College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'berry.edu');

INSERT INTO Schools (name) VALUES ('Brenau University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'brenau.edu');

-- Lower confidence — verify before relying on this one
INSERT INTO Schools (name) VALUES ('Brewton-Parker Christian University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'bpc.edu');

INSERT INTO Schools (name) VALUES ('Clark Atlanta University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'cau.edu');

INSERT INTO Schools (name) VALUES ('Covenant College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'covenant.edu');

-- Verified via search: Emmanuel's actual domain is eu.edu, not the
-- more "guessable" ec.edu
INSERT INTO Schools (name) VALUES ('Emmanuel University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'eu.edu');

INSERT INTO Schools (name) VALUES ('Emory University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'emory.edu');

INSERT INTO Schools (name) VALUES ('LaGrange College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'lagrange.edu');

-- Lower confidence — verify before relying on this one
INSERT INTO Schools (name) VALUES ('Life University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'life.edu');

INSERT INTO Schools (name) VALUES ('Mercer University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'mercer.edu');

INSERT INTO Schools (name) VALUES ('Morehouse College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'morehouse.edu');

INSERT INTO Schools (name) VALUES ('Oglethorpe University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'oglethorpe.edu');

INSERT INTO Schools (name) VALUES ('Piedmont University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'piedmont.edu');

-- Verified via search
INSERT INTO Schools (name) VALUES ('Point University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'point.edu');

INSERT INTO Schools (name) VALUES ('Reinhardt University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'reinhardt.edu');

INSERT INTO Schools (name) VALUES ('Shorter University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'shorter.edu');

INSERT INTO Schools (name) VALUES ('Spelman College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'spelman.edu');

-- Lower confidence — verify before relying on this one
INSERT INTO Schools (name) VALUES ('Thomas University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'thomasu.edu');

INSERT INTO Schools (name) VALUES ('Toccoa Falls College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'tfc.edu');

-- Confirmed via search to actively use BOTH domains — a real example
-- of why School_Domains needed to be one-to-many, not one column
INSERT INTO Schools (name) VALUES ('Truett McConnell University');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'truett.edu');
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'tmu.edu');

INSERT INTO Schools (name) VALUES ('Wesleyan College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'wesleyancollege.edu');

-- Verified via search
INSERT INTO Schools (name) VALUES ('Young Harris College');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'yhc.edu');

INSERT INTO Schools (name) VALUES ('Savannah College of Art and Design');
SET @sid = LAST_INSERT_ID();
INSERT INTO School_Domains (school_id, domain) VALUES (@sid, 'scad.edu');
