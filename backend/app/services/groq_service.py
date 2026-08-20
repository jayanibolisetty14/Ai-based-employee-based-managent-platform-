import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not configured")

client = Groq(api_key=GROQ_API_KEY)


def get_song_recommendations(mood: str, limit: int = 10):
    prompt = f"""
You are a music recommendation assistant for MoodMentor.

The user's current mood is: {mood}

Recommend {limit} songs that can help or match this mood.

Return only a simple numbered list in this format:
1. Song Title - Artist
2. Song Title - Artist

Do not add explanations.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content