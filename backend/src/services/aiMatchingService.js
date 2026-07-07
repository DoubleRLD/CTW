const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateMatchExplanation(userA, userB, score) {
  const prompt = `
You are helping explain roommate compatibility for a college roommate matching app.

Compatibility score: ${score}/100

Roommate A:
${JSON.stringify(userA, null, 2)}

Roommate B:
${JSON.stringify(userB, null, 2)}

Write a short, friendly explanation with:
1. Why they may be compatible
2. Possible areas of conflict
3. One practical suggestion

Do not mention private or sensitive assumptions.
Be lighthearted and friendly.
Keep it under 150 words.
`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
  });

  return response.output_text;
}

module.exports = {
  generateMatchExplanation,
};