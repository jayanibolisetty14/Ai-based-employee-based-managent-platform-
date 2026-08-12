EMOTION_TO_CATEGORY = {
    "joy": "Happy",
    "sadness": "Stress",
    "fear": "Stress",
    "anger": "Frustration",
    "disgust": "Frustration",
    "surprise": "Neutral",
    "neutral": "Neutral",
}

CONFIDENCE_THRESHOLD = 0.50

def map_to_wellness_category(emotion: str, score: float) -> str:
    if score < CONFIDENCE_THRESHOLD:
        return "Neutral"
    return EMOTION_TO_CATEGORY.get(emotion, "Neutral")