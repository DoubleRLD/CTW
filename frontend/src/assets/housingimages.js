// Maps dorm names / off-campus listing addresses to the housing photos
// bundled under src/assets/dorms. The backend has no image_url column
// yet, so these local images are the fallback whenever a dorm/listing
// doesn't come back with its own photo URL from the API.

import pattonHall from "./dorms/Patton Hall.jpg";
import piedmontCentral from "./dorms/Piedmont Central.jpg";
import piedmontNorth from "./dorms/Piedmont North.jpg";
import universityCommons from "./dorms/University Commons.jpg";
import universityLofts from "./dorms/University Lofts.jpg";
import greekHousing from "./dorms/Greek Housing.jpg";
import greekHousing2 from "./dorms/Greek Housing 2.jpg";
import greekHousing3 from "./dorms/Greek Housing 3.jpg";
import greekHousing4 from "./dorms/Greek Housing 4.jpg";

import oakHall from "./dorms/Oak Hall.jpg";
import elmHall from "./dorms/Elm Hall.jpg";
import beaconStation from "./dorms/Beacon Station.jpg";
import theRow from "./dorms/The Row.jpg";
import universityVillage from "./dorms/University Village.jpg";

import gtGrayHouse from "./dorms/GTech Gray House.jpg";
import gtHansonHall from "./dorms/GTech Hanson Hall.jpg";
import gtHarrisHall from "./dorms/GTech Harris Hall.jpg";
import gtHarrisonHall from "./dorms/GTech Harrison Hall.jpg";
import gtHayesHouse from "./dorms/GTech Hayes House.jpg";
import gtHefnerHall from "./dorms/GTech Hefner Hall.jpg";
import gtHopkinsHall from "./dorms/GTech Hopkins Hall.jpg";
import gtHowellHall from "./dorms/GTech Howell Hall.jpg";
import gtMathesonHall from "./dorms/GTech Matheson Hall.jpg";
import gtMauldingHall from "./dorms/GTech Maulding Hall.jpg";
import gtMontagHall from "./dorms/GTech Montag Hall.jpg";
import gtNelsonShellHall from "./dorms/GTech Nelson-Shell Hall.jpg";
import gtPerryHall from "./dorms/GTech Perry Hall.jpg";
import gtSmithHall from "./dorms/GTech Smith Hall.jpg";
import gtSteinHouse from "./dorms/GTech Stein House.jpg";
import gtTowersHall from "./dorms/GTech Towers Hall.jpg";
import gtWoodruffSouth from "./dorms/GTech Woodruff South.jpg";
import gtWoodruffNorth from "./dorms/GTech Woodruff North.jpg";
import gtZbarHall from "./dorms/GTech Zbar Hall.jpg";
import gtGlennHall from "./dorms/GTech Glenn Hall.jpg";
import gtFulmerHall from "./dorms/GTech Fulmer Hall.jpg";
import gtFreemanHall from "./dorms/GTech Freeman Hall.jpg";
import gtFolkHall from "./dorms/GTech Folk Hall.jpg";
import gtFittenHall from "./dorms/GTech Fitten Hall.jpg";
import gtFieldHall from "./dorms/GTech Field Hall.jpg";
import gtEighthStreetApartments from "./dorms/GTech Eighth Street Apartments.jpg";
import gtCrecineHall from "./dorms/GTech Crecine Hall.jpg";
import gtCloudmanHall from "./dorms/GTech Cloudman Hall.jpg";
import gtCaldwellHall from "./dorms/GTech Caldwell Hall.jpg";
import gtBrownHall from "./dorms/GTech Brown Hall.jpg";
import gtGoldinHouse from "./dorms/GTech Goldin House.jpg";
import gtCenterStreetApartments from "./dorms/GTech Center Street Apartments.jpg";
import gtArmstrongHall from "./dorms/GTech Armstrong Hall.jpg";

import theMix1Bed from "./dorms/The Mix 1 Bedroom 1 Bathroom.jpg";
import theMix2Bed from "./dorms/The Mix 2 Bedroom 2 Bathroom.jpeg";
import yugo1Bed from "./dorms/Yugo Atlanta Summerhill 1 Bedroom 1 Bathroom.jpg";
import yugo2Bed from "./dorms/Yugo Atlanta Summerhill 2 Bedroom 2 Bathroom.jpg";
import reflections1Bed from "./dorms/Reflections 1 Bedroom-1 Bathroom.png";
import reflections2Bed from "./dorms/Reflections 2 Bedroom-2 Bathroom.png";

// Dorm images, scoped by school then dorm name — NOT a flat dorm-name
// map. Dorm names aren't unique across schools (e.g. both Augusta
// University and University of Georgia have a dorm literally called
// "University Village" — two different buildings), so a flat map
// would silently show the wrong school's photo for any name that
// collides. Keys must match Schools.name exactly.
const DORM_IMAGES = {
  "Georgia State University": {
    "Patton Hall": [pattonHall],
    "Piedmont Central": [piedmontCentral],
    "Piedmont North": [piedmontNorth],
    "University Commons": [universityCommons],
    "University Lofts": [universityLofts],
    "Greek Housing": [greekHousing, greekHousing2, greekHousing3, greekHousing4],
  },
  "Augusta University": {
    "Oak Hall": [oakHall],
    "Elm Hall": [elmHall],
    "Beacon Station": [beaconStation],
    "The Row": [theRow],
    "University Village": [universityVillage],
  },
  "Georgia Institute of Technology": {
    "Gray House": [gtGrayHouse],
    "Hanson Hall": [gtHansonHall],
    "Harris Hall": [gtHarrisHall],
    "Harrison Hall": [gtHarrisonHall],
    "Hayes House": [gtHayesHouse],
    "Hefner Hall": [gtHefnerHall],
    "Hopkins Hall": [gtHopkinsHall],
    "Howell Hall": [gtHowellHall],
    "Matheson Hall": [gtMathesonHall],
    "Maulding Hall": [gtMauldingHall],
    "Montag Hall": [gtMontagHall],
    "Nelson-Shell Hall": [gtNelsonShellHall],
    "Perry Hall": [gtPerryHall],
    "Smith Hall": [gtSmithHall],
    "Stein House": [gtSteinHouse],
    "Towers Hall": [gtTowersHall],
    "Woodruff South": [gtWoodruffSouth],
    "Woodruff North": [gtWoodruffNorth],
    "Zbar Hall": [gtZbarHall],
    "Glenn Hall": [gtGlennHall],
    "Fulmer Hall": [gtFulmerHall],
    "Freeman Hall": [gtFreemanHall],
    "Folk Hall": [gtFolkHall],
    "Fitten Hall": [gtFittenHall],
    "Field Hall": [gtFieldHall],
    "Eighth Street Apartments": [gtEighthStreetApartments],
    "Crecine Hall": [gtCrecineHall],
    "Cloudman Hall": [gtCloudmanHall],
    "Caldwell Hall": [gtCaldwellHall],
    "Brown Hall": [gtBrownHall],
    "Goldin House": [gtGoldinHouse],
    "Center Street Apartments": [gtCenterStreetApartments],
    "Armstrong Hall": [gtArmstrongHall],
  },
};



// Off-campus complex, keyed by a distinctive street-address fragment
// (Listings don't always have a `name`, so address is the reliable
// join key), each with a 1BR/2BR image variant.
const LISTING_IMAGES = [
  { match: "Piedmont Ave", oneBed: theMix1Bed, twoBed: theMix2Bed },
  { match: "Hank Aaron", oneBed: yugo1Bed, twoBed: yugo2Bed },
  { match: "John Wesley Dobbs", oneBed: reflections1Bed, twoBed: reflections2Bed },
];

// Single image — used for card thumbnails (search results, favorites)
// where only one photo is shown.
export function getDormImage(name, schoolName) {
  return DORM_IMAGES[schoolName]?.[name]?.[0] || "";
}

// Full gallery — used on the dorm details page.
export function getDormImages(name, schoolName) {
  return DORM_IMAGES[schoolName]?.[name] || [];
}

export function getListingImage(address, bedrooms) {
  if (!address) return "";
  const complex = LISTING_IMAGES.find((c) => address.includes(c.match));
  if (!complex) return "";
  return Number(bedrooms) >= 2 ? complex.twoBed : complex.oneBed;
}
