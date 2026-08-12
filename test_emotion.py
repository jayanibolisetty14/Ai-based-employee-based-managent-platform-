from transformers import pipeline

classifier = pipeline("text-classification", 
                       model="j-hartmann/emotion-english-distilroberta-base", 
                       top_k=None)

result = classifier("I'm exhausted after work.")
print(result)

