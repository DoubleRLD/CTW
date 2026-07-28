// Maps dorm names / off-campus listing addresses to the housing photos
// bundled under src/assets/dorms. The backend has no image_url column
// yet, so these local images are the fallback whenever a dorm/listing
// doesn't come back with its own photo URL from the API.

import pattonHall from "./dorms/Patton_Hall.jpg";
import piedmontCentral from "./dorms/Piedmont_Central.jpg";
import piedmontNorth from "./dorms/Piedmont_North.jpg";
import universityCommons from "./dorms/University_Commons.jpg";
import universityLofts from "./dorms/University_Lofts.jpg";
import greekHousing from "./dorms/Greek_Housing.jpg";

import theMix1Bed from "./dorms/The_Mix_1_Bedroom_1_Bathroom.jpg";
import theMix2Bed from "./dorms/The_Mix_2_Bedroom_2_Bathroom.jpeg";
import yugo1Bed from "./dorms/Yugo_Atlanta_Summerhill_1_Bedroom_1_Bathroom.jpg";
import yugo2Bed from "./dorms/Yugo_Atlanta_Summerhill_2_Bedroom_2_Bathroom.jpg";
import reflections1Bed from "./dorms/Reflections_1_Bedroom1_Bathroom.png";
import reflections2Bed from "./dorms/Reflections_2_Bedroom2_Bathroom.png";

// Dorm name -> image (exact match against Dorms.name)
const DORM_IMAGES = {
  "Patton Hall": pattonHall,
  "Piedmont Central": piedmontCentral,
  "Piedmont North": piedmontNorth,
  "University Commons": universityCommons,
  "University Lofts": universityLofts,
  "Greek Housing": greekHousing,
};

// Off-campus complex, keyed by a distinctive street-address fragment
// (Listings don't always have a `name`, so address is the reliable
// join key), each with a 1BR/2BR image variant.
const LISTING_IMAGES = [
  { match: "Piedmont Ave", oneBed: theMix1Bed, twoBed: theMix2Bed },
  { match: "Hank Aaron", oneBed: yugo1Bed, twoBed: yugo2Bed },
  { match: "John Wesley Dobbs", oneBed: reflections1Bed, twoBed: reflections2Bed },
];

export function getDormImage(name) {
  return DORM_IMAGES[name] || "";
}

export function getListingImage(address, bedrooms) {
  if (!address) return "";
  const complex = LISTING_IMAGES.find((c) => address.includes(c.match));
  if (!complex) return "";
  return Number(bedrooms) >= 2 ? complex.twoBed : complex.oneBed;
}
