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
import greekHousing2 from "./dorms/Greek_Housing_2.jpg";
import greekHousing3 from "./dorms/Greek_Housing_3.jpg";
import greekHousing4 from "./dorms/Greek_Housing_4.jpg";

import oakHall from "./dorms/Oak_Hall.jpg";
import elmHall from "./dorms/Elm_Hall.jpg";
import beaconStation from "./dorms/Beacon_Station.jpg";
import theRow from "./dorms/The_Row.jpg";
import universityVillage from "./dorms/University_Village.jpg";

import gtGrayHouse from "./dorms/Gray_House.jpg";
import gtHansonHall from "./dorms/Hanson_Hall.jpg";
import gtHarrisHall from "./dorms/Harris_Hall.jpg";
import gtHarrisonHall from "./dorms/Harrison_Hall.jpg";
import gtHayesHouse from "./dorms/Hayes_House.jpg";
import gtHefnerHall from "./dorms/Hefner_Hall.jpg";
import gtHopkinsHall from "./dorms/Hopkins_Hall.jpg";
import gtHowellHall from "./dorms/Howell_Hall.jpg";
import gtMathesonHall from "./dorms/Matheson_Hall.jpg";
import gtMauldingHall from "./dorms/Maulding_Hall.jpg";
import gtMontagHall from "./dorms/Montag_Hall.jpg";
import gtNelsonShellHall from "./dorms/Nelson-Shell_Hall.jpg";
import gtPerryHall from "./dorms/Perry_Hall.jpg";
import gtSmithHall from "./dorms/Smith_Hall.jpg";
import gtSteinHouse from "./dorms/Stein_House.jpg";
import gtTowersHall from "./dorms/Towers_Hall.jpg";
import gtWoodruffSouth from "./dorms/Woodruff_South.jpg";
import gtWoodruffNorth from "./dorms/Woodruff_North.jpg";
import gtZbarHall from "./dorms/Zbar_Hall.jpg";
import gtGlennHall from "./dorms/Glenn_Hall.jpg";
import gtFulmerHall from "./dorms/Fulmer_Hall.jpg";
import gtFreemanHall from "./dorms/Freeman_Hall.jpg";
import gtFolkHall from "./dorms/Folk_Hall.jpg";
import gtFittenHall from "./dorms/Fitten_Hall.jpg";
import gtFieldHall from "./dorms/Field_Hall.jpg";
import gtEighthStreetApartments from "./dorms/Eighth_Street_Apartments.jpg";
import gtCrecineHall from "./dorms/Crecine_Hall.jpg";
import gtCloudmanHall from "./dorms/Cloudman_Hall.jpg";
import gtCaldwellHall from "./dorms/Caldwell_Hall.jpg";
import gtBrownHall from "./dorms/Brown_Hall.jpg";
import gtGoldinHouse from "./dorms/Goldin_House.jpg";
import gtCenterStreetApartments from "./dorms/Center_Street_Apartments.jpg";
import gtArmstrongHall from "./dorms/Armstrong_Hall.jpg";

import theMix1Bed from "./dorms/The_Mix_1_Bedroom_1_Bathroom.jpg";
import theMix2Bed from "./dorms/The_Mix_2_Bedroom_2_Bathroom.jpeg";
import yugo1Bed from "./dorms/Yugo_Atlanta_Summerhill_1_Bedroom_1_Bathroom.jpg";
import yugo2Bed from "./dorms/Yugo_Atlanta_Summerhill_2_Bedroom_2_Bathroom.jpg";
import reflections1Bed from "./dorms/Reflections_1_Bedroom1_Bathroom.png";
import reflections2Bed from "./dorms/Reflections_2_Bedroom2_Bathroom.png";

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
