from transformers import pipeline
from sample_texts import sample_texts
from text_cleaning import clean_text, is_valid_text

sentiment_classifier = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

def analyze_sentiment(text: str):
    if not is_valid_text(text):
        return {"label": "NEUTRAL", "score": 0.0, "note": "empty or invalid input"}
    
    cleaned = clean_text(text)
    result = sentiment_classifier(cleaned)[0]
    return result

if __name__ == "__main__":
    for text in sample_texts:
        result = analyze_sentiment(text)
        print(f"Text: {text!r}")
        print(f"Result: {result}")
        print("-" * 50)