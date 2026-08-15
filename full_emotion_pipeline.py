from emotion_detection import detect_emotion
from emotion_mapping import map_to_wellness_category
from sample_texts import sample_texts

def analyze(text: str):
    result = detect_emotion(text)
    category = map_to_wellness_category(result['emotion'], result['score'])
    return {
        "emotion": result['emotion'],
        "confidence": result['score'],
        "wellness_category": category
    }

if __name__ == "__main__":
    for text in sample_texts:
        result = analyze(text)
        print(f"Text: {text!r}")
        print(f"Emotion: {result['emotion']} ({result['confidence']}) → Category: {result['wellness_category']}")
        print("-" * 50)