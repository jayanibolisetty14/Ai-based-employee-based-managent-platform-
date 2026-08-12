Milestone 2 - Deep Emotion Classification \& Validation



Model used: j-hartmann/emotion-english-distilroberta-base

Test set: 12 sample sentences (same as Milestone 1)



Results: 9/11 correctly classified with expected emotion and wellness category.

Neutral sentences now correctly detected as Neutral (fixed vs baseline model).



Known limitations found:

\- Ambiguous/mixed-tone text (e.g. "I'm okay I guess, could be better, could be worse")

&#x20; sometimes misclassified as disgust instead of neutral/mixed.

\- Low-confidence predictions (\~50-55%) can still occur on emotionally complex text.

&#x20; Confidence threshold of 0.50 is in place to catch the weakest cases, may need tuning.



Emotion to Wellness Category Mapping:

joy -> Happy

sadness -> Stress

fear -> Stress

anger -> Frustration

disgust -> Frustration

surprise -> Neutral

neutral -> Neutral



This mapping has been shared with frontend/analytics team members for 

dashboard and chart development.

