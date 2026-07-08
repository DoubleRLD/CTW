import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateMatchExplanation(userA, userB, score) {
    const getCompatibilityData = (profile) => ({
    name: profile.user_name,
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
${JSON.stringify(getCompatibilityData(userA), null, 2)}

Roommate B:
${JSON.stringify(getCompatibilityData(userB), null, 2)}

Pay special attention to these open-ended profile fields: 
 - roommate_pet_peeve
 - conflict_style
 - visitor_style
 - boundaries

Use the open-ended answers to gently adjust the compatibility score.

The adjustment must be between -10 and +10 points:

- Positive adjustment: the open-ended answers reveal extra compatibility

- Negative adjustment: the open-ended answers reveal possible roommate conflicts

- Zero adjustment: there is not enough information to justify a change

Do not recalculate the original compatibility score.
Only recommend a small adjustment based on the open-ended answers.

Use the roommates names in the explanation whenever possible.
Do not refer to them as Roommate A or Roommate B

Return ONLY valid JSON in this exact format:
{
  "adjustment": 0,
  "explanation": "A short, friendly explanation here."
}

Write a short, friendly compatibility analysis explanation that includes:
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

  const cleanedText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  const result = JSON.parse(cleanedText);

  const adjustment = Math.max(
      -10,
      Math.min(10, Number(result.adjustment) || 0)
  );

  const adjustedScore = Math.max(
      0,
      Math.min(100, Number(score) + adjustment)
  );

  return {
      adjustment,
      adjustedScore,
      explanation: result.explanation,
  };
}
