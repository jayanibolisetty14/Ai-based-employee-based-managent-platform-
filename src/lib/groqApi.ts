export async function getGroqRecommendations(
  mood: string,
  limit: number = 5
) {
  const response = await fetch(
    `http://127.0.0.1:8000/groq/recommendations?mood=${encodeURIComponent(
      mood
    )}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to get Groq recommendations");
  }

  return response.json();
}