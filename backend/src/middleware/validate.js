import { z } from 'zod';

export const createDormSchema = z.object({
  schoolId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  address: z.string().max(255).optional(),
});

// Shared by the dorm and listing photo-upload endpoints. Expects a
// base64 data URL from the browser's FileReader — same pattern
// already used for Roommate_Profile.profile_picture.
export const uploadImageSchema = z.object({
  imageUrl: z.string().url().max(10000000),
});

export const reportReviewSchema = z.object({
  reason: z.string().min(1).max(1000),
});

export const resolveReportSchema = z.object({
  action: z.enum(['dismiss', 'remove']),
});

export const createSchoolSchema = z.object({
  name: z.string().min(1).max(255),
  domains: z.array(z.string().min(1).max(255)).optional().default([]),
});

export const updateSchoolSchema = z.object({
  name: z.string().min(1).max(255),
});

export const addDomainSchema = z.object({
  domain: z.string().min(1).max(255),
});

export const updateDormSchema = z.object({
  schoolId: z.number().int().positive().optional(),
  name: z.string().min(1).max(255).optional(),
  address: z.string().max(255).optional(),
});

export const updateListingSchema = z.object({
  landlordId: z.number().int().positive().optional().nullable(),
  name: z.string().max(255).optional().nullable(),
  address: z.string().min(1).max(255).optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  monthlyRent: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  listingType: z.enum(['apartment', 'house', 'condo', 'townhouse']).optional(),
});

export const createRoomSchema = z.object({
  floor: z.number().int().optional(),
  roomNumber: z.string().min(1).max(20),
});

export const registerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1),
});

export const resendVerificationSchema = z.object({
  email: z.string().email(),
});

export const createListingSchema = z.object({
  landlordId: z.number().int().positive().optional(),
  name: z.string().max(255).optional(),
  address: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  monthlyRent: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  listingType: z.enum(['apartment', 'house', 'condo', 'townhouse']).default('apartment'),
  schoolIds: z.array(z.number().int().positive()).min(1, 'At least one school must be linked.'),
});

const semesterEnum = z.enum(['Fall', 'Spring', 'Summer']);
const ratingField = z.number().int().min(1).max(5);

export const createDormReviewSchema = z.object({
  roomId: z.number().int().positive().optional(),
  semester: semesterEnum,
  semesterYear: z.number().int().min(2000).max(2100),
  cleanlinessRating: ratingField,
  noiseRating: ratingField,
  locationRating: ratingField,
  overallRating: ratingField,
  body: z.string().max(5000).optional(),
});

export const createListingReviewSchema = z.object({
  semester: semesterEnum,
  semesterYear: z.number().int().min(2000).max(2100),
  landlordRating: ratingField,
  maintenanceRating: ratingField,
  valueRating: ratingField,
  overallRating: ratingField,
  body: z.string().max(5000).optional(),
});

export const roommateProfileSchema = z
  .object({
    semester: semesterEnum,
    semesterYear: z.number().int().min(2000).max(2100),
    major: z.string().max(255).optional(),
    housingInterest: z.enum(['on_campus', 'off_campus', 'either']).optional(),
    bio: z.string().max(2000).optional(),
    profilePicture: z.string().url().max(10000000).optional().or(z.literal("")),
    roommatePetPeeve: z.string().max(2000).optional(),
    conflictStyle: z.string().max(2000).optional(),
    visitorStyle: z.string().max(2000).optional(),
    boundaries: z.string().max(2000).optional(),
    sleepSchedule: z.enum(['early_bird', 'night_owl', 'flexible']),
    cleanlinessLevel: z.number().int().min(1).max(5),
    noiseTolerance: z.number().int().min(1).max(5),
    studyHabits: z.enum(['in_room', 'library', 'flexible']),
    socialLevel: z.number().int().min(1).max(5),
    smoking: z.boolean().default(false),
    pets: z.boolean().default(false),
    budgetMin: z.number().int().positive().optional(),
    budgetMax: z.number().int().positive().optional(),
    moveInDate: z.string().optional(), // ISO date string, e.g. "2026-08-15"
  })
  .refine(
    (data) => data.budgetMin == null || data.budgetMax == null || data.budgetMax >= data.budgetMin,
    { message: 'budgetMax must be greater than or equal to budgetMin', path: ['budgetMax'] }
  );

export const respondToMatchSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
});

// Small helper used by controllers: validates req.body against a
// schema and throws a 400 ApiError with readable field errors if it
// fails, instead of letting a malformed insert hit MySQL first.
export function parseOrThrow(schema, data, ApiError) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');
    throw new ApiError(400, message);
  }
  return result.data;
}
