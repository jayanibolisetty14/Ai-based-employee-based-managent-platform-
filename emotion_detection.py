from transformers import pipeline
from sample_texts import sample_texts
from text_cleaning import clean_text, is_valid_text

emotion_classifier = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

def detect_emotion(text: str):
    if not is_valid_text(text):
        return {"emotion": "neutral", "score": 0.0, "note": "empty or invalid input"}
    
    cleaned = clean_text(text)
    results = emotion_classifier(cleaned)[0]
    
    # results is a list of all emotions with scores, sorted highest first
    top_result = max(results, key=lambda x: x['score'])
    
    return {
        "emotion": top_result['label'],
        "score": round(top_result['score'], 4),
        "all_scores": results
    }

if __name__ == "__main__":
    for text in sample_texts:
        result = detect_emotion(text)
        print(f"Text: {text!r}")
        print(f"Top Emotion: {result['emotion']} ({result['score']})")
        print("-" * 50)