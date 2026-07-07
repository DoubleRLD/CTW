import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateMatchExplanation(userA, userB, score) {
    const getCompatibilityData = (profile) => ({
    bio: profile.bio,
    roommate_pet_peeve: profile.roommate_pet_peeve,
    conflict_style: profile.conflict_style,
    visitor_style: profile.visitor_style,
    boundaries: profile.boundaries,
    sleep_schedule: profile.sleep_schedule,
    cleanliness_level: profile.cleanliness_level,
    noise_tolerance: profile.noise_tolerance,
    study_habits: profile.study_habits,
    social_level: profile.social_level,
    smoking: profile.smoking,
    pets: profile.pets,
    budget_min: profile.budget_min,
    budget_max: profile.budget_max,
    move_in_date: profile.move_in_date,
  });

  const prompt = `
You are helping explain roommate compatibility for DormScope, a college roommate matching app.

The compatibility score has already been calculated by the app's matching algorithm.
Do not change or recalculate the score. 

Compatibility score: ${score}/100

Roommate A:
${JSON.stringify(userA, null, 2)}
${JSON.stringify(getCompatibilityData(userA), null, 2)}

Roommate B:
${JSON.stringify(userB, null, 2)}
${JSON.stringify(getCompatibilityData(userB), null, 2)}

Pay special attention to these open-ended profile fields: 
 - roommate_pet_peeve
 - conflict_style
 - visitor_style
 - boundaries
 
Write a short, friendly compatibility analysis that includes:
1. Why they may be compatible
2. Possible areas of conflict
3. One practical suggestion for living together successfully

Base the analysis only on the profile information provided. 
Do not make assumptions about sensitive or private traits. 

Be lighthearted and friendly.
Keep it under 150 words.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}
