export interface Joke {
  id: string;
  language: 'en' | 'te' | 'hi' | 'ta' | 'kn' | string;
  category: string;
  setup: string;
  punchline: string;
  moodTags: string[];
  emoji?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  // Aliases for backward compatibility
  text?: string;
  moodCategories?: string[];
}

export const JOKES: Joke[] = [
  // ================= ENGLISH JOKES (30+) =================
  {
    id: "en-coding-01",
    language: "en",
    category: "coding",
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! 😄",
    moodTags: ["stressed", "anxious", "frustrated", "happy", "neutral"],
    emoji: "💻"
  },
  {
    id: "en-coding-02",
    language: "en",
    category: "coding",
    setup: "Why was the JavaScript developer so bad at relationships?",
    punchline: "They couldn't handle the callbacks! 😂",
    moodTags: ["frustrated", "bored", "neutral"],
    emoji: "⚡"
  },
  {
    id: "en-coding-03",
    language: "en",
    category: "coding",
    setup: "What did the programmer say when they couldn't find the bug?",
    punchline: "'Maybe it's not a bug... maybe it's a feature!' 😭",
    moodTags: ["stressed", "frustrated", "low"],
    emoji: "🐛"
  },
  {
    id: "en-coding-04",
    language: "en",
    category: "coding",
    setup: "Why do Python programmers wear glasses?",
    punchline: "Because they can't C#! 🤓",
    moodTags: ["bored", "neutral", "happy"],
    emoji: "🐍"
  },
  {
    id: "en-coding-05",
    language: "en",
    category: "coding",
    setup: "How many programmers does it take to change a lightbulb?",
    punchline: "None. That's a hardware problem! 💡",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🛠️"
  },
  {
    id: "en-coding-06",
    language: "en",
    category: "coding",
    setup: "Why did the developer go broke?",
    punchline: "Because they used up all their cache! 💸",
    moodTags: ["frustrated", "low", "neutral"],
    emoji: "💰"
  },
  {
    id: "en-coding-07",
    language: "en",
    category: "coding",
    setup: "There are 10 types of people in the world...",
    punchline: "Those who understand binary, and those who don't! 🤖",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🔢"
  },
  {
    id: "en-coding-08",
    language: "en",
    category: "coding",
    setup: "Why did the CSS developer walk away from the group?",
    punchline: "They couldn't find the center! 📍",
    moodTags: ["frustrated", "bored", "neutral"],
    emoji: "🎨"
  },
  {
    id: "en-coding-09",
    language: "en",
    category: "coding",
    setup: "What is a programmer's favorite hangout place?",
    punchline: "The Foo Bar! 🍻",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍺"
  },
  {
    id: "en-coding-10",
    language: "en",
    category: "coding",
    setup: "Why did the AI cross the road?",
    punchline: "To optimize the path to the other side! 🐔🤖",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🤖"
  },
  {
    id: "en-college-01",
    language: "en",
    category: "college",
    setup: "What is the fastest way to make a college student run?",
    punchline: "Say: 'The professor is checking attendance!' 🏃😂",
    moodTags: ["stressed", "anxious", "frustrated", "neutral"],
    emoji: "🎓"
  },
  {
    id: "en-college-02",
    language: "en",
    category: "college",
    setup: "Why did the student bring a ladder to class?",
    punchline: "Because they wanted to reach the next level! 😭",
    moodTags: ["stressed", "tired", "neutral"],
    emoji: "🪜"
  },
  {
    id: "en-college-03",
    language: "en",
    category: "college",
    setup: "What is a college student's favorite type of tea?",
    punchline: "Deadline-tea! ☕😂",
    moodTags: ["stressed", "anxious", "tired", "low"],
    emoji: "☕"
  },
  {
    id: "en-college-04",
    language: "en",
    category: "college",
    setup: "How does a college student prepare for an 8 AM exam?",
    punchline: "By setting 14 alarms and sleeping through 15 of them! 😴",
    moodTags: ["tired", "stressed", "bored"],
    emoji: "⏰"
  },
  {
    id: "en-college-05",
    language: "en",
    category: "college",
    setup: "Why do students love group projects?",
    punchline: "Because 1 person does the work and 3 people do emotional support! 🤝",
    moodTags: ["frustrated", "neutral", "happy"],
    emoji: "📝"
  },
  {
    id: "en-college-06",
    language: "en",
    category: "college",
    setup: "What happens when you study for 4 hours straight?",
    punchline: "You realize you've been staring at page 1 the entire time! 📖",
    moodTags: ["tired", "bored", "stressed"],
    emoji: "📚"
  },
  {
    id: "en-college-07",
    language: "en",
    category: "college",
    setup: "Why did the college student cross the road?",
    punchline: "To get to the library... for a 4-hour nap! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "🚶"
  },
  {
    id: "en-college-08",
    language: "en",
    category: "college",
    setup: "What is the most accurate definition of a semester?",
    punchline: "15 weeks of procrastination followed by 1 week of panic! 😱",
    moodTags: ["anxious", "stressed", "frustrated"],
    emoji: "🗓️"
  },
  {
    id: "en-college-09",
    language: "en",
    category: "college",
    setup: "Why do college students always drink coffee?",
    punchline: "Because 'sleep' is just a myth told by graduates! ☕",
    moodTags: ["tired", "stressed", "energetic"],
    emoji: "☕"
  },
  {
    id: "en-college-10",
    language: "en",
    category: "college",
    setup: "How do you know if a college student is in final week?",
    punchline: "They start talking to the library walls and the walls reply! 🫠",
    moodTags: ["stressed", "low", "tired"],
    emoji: "🏢"
  },
  {
    id: "en-tech-01",
    language: "en",
    category: "technology",
    setup: "Why did the phone go to therapy?",
    punchline: "It had too many unresolved notifications! 😂",
    moodTags: ["stressed", "anxious", "neutral"],
    emoji: "📱"
  },
  {
    id: "en-tech-02",
    language: "en",
    category: "technology",
    setup: "Why did the Wi-Fi router break up with the laptop?",
    punchline: "There was no connection! 😭",
    moodTags: ["sad", "lonely", "low"],
    emoji: "📶"
  },
  {
    id: "en-tech-03",
    language: "en",
    category: "technology",
    setup: "Why was the computer cold at its desk?",
    punchline: "It left its Windows open! 🪟",
    moodTags: ["happy", "calm", "neutral"],
    emoji: "💻"
  },
  {
    id: "en-tech-04",
    language: "en",
    category: "technology",
    setup: "What did the smartphone say to the charger?",
    punchline: "'You give me so much energy, I'm at 100%!' 🔌",
    moodTags: ["happy", "energetic", "calm"],
    emoji: "⚡"
  },
  {
    id: "en-tech-05",
    language: "en",
    category: "technology",
    setup: "Why did the keyboard get arrested?",
    punchline: "Because it was involved in too many 'strokes'! ⌨️",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "⌨️"
  },
  {
    id: "en-daily-life-01",
    language: "en",
    category: "daily-life",
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything! ⚛️",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "🔬"
  },
  {
    id: "en-daily-life-02",
    language: "en",
    category: "daily-life",
    setup: "Why did the scarecrow win an award?",
    punchline: "Because he was outstanding in his field! 🌾",
    moodTags: ["calm", "neutral", "happy"],
    emoji: "🏆"
  },
  {
    id: "en-daily-life-03",
    language: "en",
    category: "daily-life",
    setup: "What did one elevator say to the other elevator?",
    punchline: "'I think I'm coming down with something!' 🛗",
    moodTags: ["tired", "low", "bored"],
    emoji: "🏢"
  },
  {
    id: "en-one-liner-01",
    language: "en",
    category: "one-liner",
    setup: "I'm on a seafood diet.",
    punchline: "I see food and I eat it! 🍕",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍕"
  },
  {
    id: "en-one-liner-02",
    language: "en",
    category: "one-liner",
    setup: "My wife told me to stop impersonating a flamingo.",
    punchline: "I had to put my foot down! 🦩",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🦩"
  },
  {
    id: "en-wordplay-01",
    language: "en",
    category: "wordplay",
    setup: "What do you call a fake noodle?",
    punchline: "An impasta! 🍝",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍜"
  },
  {
    id: "en-wordplay-02",
    language: "en",
    category: "wordplay",
    setup: "I'm reading a book on anti-gravity...",
    punchline: "It's impossible to put down! 📚",
    moodTags: ["bored", "calm", "neutral"],
    emoji: "📖"
  },
  {
    id: "en-sleep-01",
    language: "en",
    category: "sleep",
    setup: "Why did the guy sit on his alarm clock?",
    punchline: "He wanted to be on time! ⏰",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "⏰"
  },
  {
    id: "en-sleep-02",
    language: "en",
    category: "sleep",
    setup: "What do you call a person who is happy on Monday mornings?",
    punchline: "Retired! 😂",
    moodTags: ["tired", "frustrated", "neutral"],
    emoji: "😴"
  },

  // ================= TELUGU JOKES (30+) =================
  {
    id: "te-relatable-01",
    language: "te",
    category: "daily-life",
    setup: "హాస్టల్ పప్పుకి, రోడ్డు పక్కన కాల్వ నీళ్లకి తేడా ఏంటో తెలుసా?",
    punchline: "కాల్వ నీళ్లలో కొంచెం మట్టి ఉంటుంది... హాస్టల్ పప్పులో కొంచెం పప్పు వెతకాలి! 😂",
    moodTags: ["stressed", "frustrated", "low"],
    emoji: "🍱"
  },
  {
    id: "te-college-01",
    language: "te",
    category: "college",
    setup: "ప్రొఫెసర్ క్లాస్‌లో 'అటెండెన్స్ తీస్తున్నా' అనగానే ఏం జరుగుతుంది?",
    punchline: "క్యాంటీన్‌లో ఉన్న ఫ్రెండ్స్ కూడా విమానం స్పీడ్‌తో పరుగెత్తుకొస్తారు! 🏃😭",
    moodTags: ["anxious", "stressed", "neutral"],
    emoji: "🏃"
  },
  {
    id: "te-coding-01",
    language: "te",
    category: "coding",
    setup: "కోడర్ రాత్రి 3 గంటలకి ఆనందంతో ఎందుకు డాన్స్ చేస్తాడు?",
    punchline: "4 గంటలు వెతికిన తర్వాత ఒక్క మిస్సింగ్ సెమీకోలన్ (;) దొరికినందుకు! 💻",
    moodTags: ["frustrated", "stressed", "neutral"],
    emoji: "💻"
  },
  {
    id: "te-food-01",
    language: "te",
    category: "food",
    setup: "కాలేజ్ లంచ్ బ్రేక్‌లో అత్యంత వేగంగా మాయమయ్యేది ఏమిటి?",
    punchline: "ఫ్రెండ్ ఇంటి నుంచి తెచ్చిన వేడి వేడి చికెన్ ఫ్రై టిఫిన్ బాక్స్! 🍗",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍱"
  },
  {
    id: "te-college-02",
    language: "te",
    category: "college",
    setup: "టీచర్: రోజూ క్లాస్‌కి లేట్‌గా ఎందుకు వస్తున్నావ్?",
    punchline: "స్టూడెంట్: రోడ్డు మీద 'Go Slow' అని రాసి ఉంటే మాటకు కట్టుబడి వచ్చా సార్! 🚗",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🚗"
  },
  {
    id: "te-friendship-01",
    language: "te",
    category: "friendship",
    setup: "వై-ఫై కి, నిజమైన ఫ్రెండ్‌కి ఉన్న పోలిక ఏంటి?",
    punchline: "సిగ్నల్ దొరికితే చాలు... రోజంతా హ్యాపీగా గడిచిపోతుంది! 📱",
    moodTags: ["happy", "calm", "neutral"],
    emoji: "🤝"
  },
  {
    id: "te-relatable-02",
    language: "te",
    category: "daily-life",
    setup: "రాత్రి నిద్రపోయే ముందు దోమ చెవి దగ్గరికి వచ్చి ఏం పాడుతుంది?",
    punchline: "'ఏరా ఇంకా నిద్రపోలేదా... నేను కుట్టమంటావా లేక ఆల్-అవుట్ ఆన్ చేస్తావా?' 🦟",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦟"
  },
  {
    id: "te-exam-01",
    language: "te",
    category: "exam",
    setup: "ఎగ్జామ్ హాల్‌లో మన రోల్ నంబర్ పక్కన కూర్చున్న ఫ్రెండ్ ఎవరు?",
    punchline: "ఆ రెండు గంటలకి సాక్షాత్ కాపాడే దేవుడు! 😇",
    moodTags: ["stressed", "anxious", "frustrated"],
    emoji: "✍️"
  },
  {
    id: "te-college-03",
    language: "te",
    category: "college",
    setup: "ఉదయాన్నే 8 గంటల క్లాస్ కి వెళ్ళడం అంటే ఏమిటి?",
    punchline: "7:58 కి కళ్ళు తెరిచి, ఫ్రెష్ అవ్వకుండా అటెండెన్స్ కోసం పరుగెత్తడమే! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "⏰"
  },
  {
    id: "te-tech-01",
    language: "te",
    category: "technology",
    setup: "ఫోన్ బ్యాటరీ 1% ఉన్నప్పుడు మనిషి ఫీలింగ్ ఏంటి?",
    punchline: "ఐసీయూ బయట నిలబడిన బంధువు ఫీలింగ్! 🔋😭",
    moodTags: ["anxious", "frustrated", "stressed"],
    emoji: "🪫"
  },
  {
    id: "te-daily-life-01",
    language: "te",
    category: "daily-life",
    setup: "మనం ఏదైనా ముఖ్యమైన పనిలో ఉన్నప్పుడు వాట్సాప్ మెసేజ్ వస్తే?",
    punchline: "పని పక్కన పెట్టి, రిప్లై ఇచ్చి, మళ్ళీ రీల్స్ చూడటం మొదలు పెడతాం! 😂",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "📱"
  },
  {
    id: "te-food-02",
    language: "te",
    category: "food",
    setup: "అమ్మ: ఏంట్రా కర్రీలో ఉప్పు తక్కువైందా?",
    punchline: "కొడుకు: లేదు మమ్మీ... కూరలో ఉప్పు ఉంది కానీ, ఉప్పులో కూర లేదు! 😭",
    moodTags: ["frustrated", "low", "neutral"],
    emoji: "🍲"
  },
  {
    id: "te-friendship-02",
    language: "te",
    category: "friendship",
    setup: "ఫ్రెండ్: అరేయ్, నా పెళ్లికి వస్తావా?",
    punchline: "నేను: కచ్చితంగా వస్తా... కానీ భోజనం మెనూ ముందే చెప్పు, దాన్ని బట్టి గిఫ్ట్ ప్లాన్ చేస్తా! 🎁",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍛"
  },
  {
    id: "te-work-01",
    language: "te",
    category: "work",
    setup: "బాస్: ఎందుకు ఆఫీస్ కి లేట్ గా వచ్చావు?",
    punchline: "ఎంప్లాయీ: మా ఇంటి దగ్గర ట్రాఫిక్ జామ్ సార్... ఏనుగు నడుచుకుంటూ వెళ్తోంది! 🐘",
    moodTags: ["frustrated", "neutral", "bored"],
    emoji: "🏢"
  },
  {
    id: "te-family-01",
    language: "te",
    category: "family",
    setup: "చిన్నప్పుడు మనం దెబ్బ తగిలి ఏడుస్తుంటే నాన్న ఏమనేవారు?",
    punchline: "'అది దెబ్బ కాదురా, నువ్వు చేసిన తప్పుకి దేవుడు ఇచ్చిన ప్రసాదం' అనేవారు! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "👨‍👦"
  },
  {
    id: "te-one-liner-01",
    language: "te",
    category: "one-liner",
    setup: "ప్రేమ అనేది ఒక కల అయితే...",
    punchline: "పెళ్లి అనేది అలారం లాంటిది, వెంటనే నిద్ర లేపుతుంది! ⏰",
    moodTags: ["neutral", "calm", "bored"],
    emoji: "💍"
  },
  {
    id: "te-silly-01",
    language: "te",
    category: "silly",
    setup: "మొదటి సారి విమానం ఎక్కిన వాడు కిటికీ బయట చూసి ఏమన్నాడు?",
    punchline: "కింద ఉన్న వాళ్ళని చూసి... 'అరేయ్, అందరూ ఎందుకు చీమల్లా ఉన్నారు' అన్నాడు! 🐜",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "✈️"
  },
  {
    id: "te-wordplay-01",
    language: "te",
    category: "wordplay",
    setup: "మనిషికి, కంప్యూటర్ కి ఉన్న తేడా ఏంటి?",
    punchline: "మనిషికి నిద్ర వస్తే కళ్ళు మూసుకుంటాడు, కంప్యూటర్ కి నిద్ర వస్తే స్లీప్ మోడ్ లోకి వెళ్తుంది! 💻",
    moodTags: ["tired", "neutral", "calm"],
    emoji: "💤"
  },
  {
    id: "te-college-04",
    language: "te",
    category: "college",
    setup: "ఎగ్జామ్ పేపర్ చూసిన స్టూడెంట్ రియాక్షన్ ఏంటి?",
    punchline: "క్వశ్చన్స్ అన్ని చూసి... 'ఓరి దేవుడా, ఇవన్నీ సిలబస్ లో ఉన్నాయా?' అని! 📄",
    moodTags: ["stressed", "anxious", "frustrated"],
    emoji: "📝"
  },
  {
    id: "te-sleep-01",
    language: "te",
    category: "sleep",
    setup: "నిద్ర పట్టడం లేదు అని డాక్టర్ దగ్గరికి వెళ్తే ఏం చెప్పారు?",
    punchline: "'మ్యాథ్స్ టెక్స్ట్ బుక్ తీసి 10 పేజీలు చదువు, 5 నిమిషాల్లో నిద్ర వస్తుంది' అన్నారు! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "📕"
  },
  {
    id: "te-phone-01",
    language: "te",
    category: "phone",
    setup: "మనం ఫోన్ చూస్తుంటే అమ్మ ఏమంటుంది?",
    punchline: "'ఆ ఫోన్ నీ తల కింద పెట్టుకుని పడుకో, అప్పుడైనా నిద్ర వస్తుందేమో చూద్దాం!' 📱",
    moodTags: ["frustrated", "neutral", "low"],
    emoji: "📵"
  },
  {
    id: "te-social-media-01",
    language: "te",
    category: "social-media",
    setup: "ఇన్‌స్టాగ్రామ్ లో 1000 మంది ఫాలోవర్స్ ఉంటే ఏం లాభం?",
    punchline: "మనం బజార్ కి వెళ్తే ఒక్కడు కూడా పలకరించడు! 🤳",
    moodTags: ["lonely", "low", "neutral"],
    emoji: "📸"
  },
  {
    id: "te-friendship-03",
    language: "te",
    category: "friendship",
    setup: "ఫ్రెండ్షిప్ డే నాడు ఫ్రెండ్ కి మెసేజ్ చేస్తే ఏమన్నాడు?",
    punchline: "'అరేయ్, రోజు ఫోన్ చేసి విసిగిస్తావ్ కదా, ఈ ఒక్క రోజైనా ప్రశాంతంగా ఉండనివ్వు' అన్నాడు! 😂",
    moodTags: ["happy", "neutral", "bored"],
    emoji: "👬"
  },
  {
    id: "te-ai-01",
    language: "te",
    category: "AI",
    setup: "AI చాట్ బాట్ కి గర్ల్ ఫ్రెండ్ ఉంటే ఎలా ఉంటుంది?",
    punchline: "ఆమె ఏది అడిగినా 'As an AI model, I cannot provide an emotional answer' అని చెబుతుంది! 🤖",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🤖"
  },
  {
    id: "te-student-01",
    language: "te",
    category: "student",
    setup: "స్టూడెంట్ లైఫ్ లో మ్యాజిక్ అంటే ఏంటో తెలుసా?",
    punchline: "రాత్రంతా చదివినా, పొద్దున్న ఎగ్జామ్ పేపర్ చూశాక ఏమీ గుర్తు రాకపోవడమే! ✨",
    moodTags: ["frustrated", "stressed", "low"],
    emoji: "🪄"
  },
  {
    id: "te-family-02",
    language: "te",
    category: "family",
    setup: "నాన్న ఫోన్ లో పాస్‌వర్డ్ మార్చినప్పుడు ఏం జరిగింది?",
    punchline: "అమ్మ పేరుకి బదులు తన పేరు పెట్టుకున్నారు, అమ్మకి తెలిసి యుద్ధం మొదలైంది! ⚔️",
    moodTags: ["neutral", "calm", "happy"],
    emoji: "👪"
  },
  {
    id: "te-daily-life-02",
    language: "te",
    category: "daily-life",
    setup: "జీవితంలో అతి పెద్ద అబద్ధం ఏంటో తెలుసా?",
    punchline: "'నేను 5 నిమిషాల్లో అక్కడ ఉంటాను' అని ఫ్రెండ్ చెప్పే మాట! ⏳",
    moodTags: ["neutral", "frustrated", "calm"],
    emoji: "⌚"
  },
  {
    id: "te-food-03",
    language: "te",
    category: "food",
    setup: "హోటల్ లో బిర్యానీ ఆర్డర్ ఇస్తే ఏం వచ్చింది?",
    punchline: "ప్లేట్ నిండా అన్నం ఉంది కానీ, ముక్క వెతకడానికి భూతద్దం కావాలి! 🍛",
    moodTags: ["frustrated", "low", "neutral"],
    emoji: "🔍"
  },
  {
    id: "te-silly-02",
    language: "te",
    category: "silly",
    setup: "బద్ధకం అంటే ఏంటి అని అడిగితే ఒకాయన ఏమన్నాడో తెలుసా?",
    punchline: "సమాధానం చెప్పడానికి బద్ధకం వేసి సైలెంట్ గా ఉండిపోయాడు! 🥱",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦥"
  },
  {
    id: "te-one-liner-02",
    language: "te",
    category: "one-liner",
    setup: "డబ్బుతో ఆనందాన్ని కొనలేము అని ఎందుకు అంటారు?",
    punchline: "ఎందుకంటే ఆనందం షాప్ లో దొరకదు, వై-ఫై సిగ్నల్ లో దొరుకుతుంది కాబట్టి! 📶",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "💰"
  },

  // ================= HINDI JOKES (30+) =================
  {
    id: "hi-college-01",
    language: "hi",
    category: "college",
    setup: "हॉस्टल की दाल और नल के पानी में क्या अंतर है?",
    punchline: "नल के पानी में थोड़ा ज़ंग होता है... और हॉस्टल की दाल में कभी-कभार दाल! 😂",
    moodTags: ["stressed", "frustrated", "low"],
    emoji: "🎓"
  },
  {
    id: "hi-college-02",
    language: "hi",
    category: "college",
    setup: "प्रोफेसर ने जैसे ही कहा 'अटेंडेंस ले रहा हूँ', क्या हुआ?",
    punchline: "कैंटीन में बैठे दोस्त भी राफेल की स्पीड से क्लास की तरफ भागे! 🏃😭",
    moodTags: ["stressed", "anxious", "neutral"],
    emoji: "🏃"
  },
  {
    id: "hi-coding-01",
    language: "hi",
    category: "coding",
    setup: "प्रोग्रामर रात को 3 बजे अचानक मुस्कुराने क्यों लगता है?",
    punchline: "क्योंकि 5 घंटे के सिरदर्द के बाद एक फालतू ब्रैकेट ( } ) मिल गया! 💻",
    moodTags: ["stressed", "frustrated", "neutral"],
    emoji: "💻"
  },
  {
    id: "hi-food-01",
    language: "hi",
    category: "food",
    setup: "कॉलेज में लंच टाइम में सबसे जल्दी क्या गायब होता है?",
    punchline: "दोस्त का घर से लाया हुआ पराठा और अचार! 🍕",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍕"
  },
  {
    id: "hi-college-03",
    language: "hi",
    category: "college",
    setup: "टीचर: तुम रोज़ क्लास में लेट क्यों आते हो?",
    punchline: "छात्र: सर, रास्ते में लिखा था 'धीरे चलें', मैं तो बस नियमों का पालन कर रहा था! 🚗",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🚗"
  },
  {
    id: "hi-friendship-01",
    language: "hi",
    category: "friendship",
    setup: "वाई-फाई और पक्के दोस्त में क्या समानता है?",
    punchline: "कनेक्शन स्ट्रांग हो तो लाइफ एकदम smooth चलती है! 📱",
    moodTags: ["happy", "calm", "neutral"],
    emoji: "🤝"
  },
  {
    id: "hi-relatable-01",
    language: "hi",
    category: "daily-life",
    setup: "रात को कान के पास आकर मच्छर क्या फुसफुसाता है?",
    punchline: "'भाई सो गया या गुड नाइट ऑल-आउट लगाऊं?' 🦟",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦟"
  },
  {
    id: "hi-exam-01",
    language: "hi",
    category: "exam",
    setup: "एग्जाम हॉल में बगल वाली सीट पर बैठा दोस्त कौन होता है?",
    punchline: "उस 3 घंटे के लिए साक्षात भगवान का अवतार! 😇",
    moodTags: ["stressed", "anxious", "frustrated"],
    emoji: "✍️"
  },
  {
    id: "hi-college-04",
    language: "hi",
    category: "college",
    setup: "सुबह 8 बजे की क्लास का असली सच क्या है?",
    punchline: "7:58 पर आँख खुलना और बिना मुँह धोए हाज़िरी लगाने भागना! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "⏰"
  },
  {
    id: "hi-tech-01",
    language: "hi",
    category: "technology",
    setup: "फ़ोन की बैटरी 2% रहने पर इंसान का रिएक्शन क्या होता है?",
    punchline: "जैसे ऑक्सीजन सिलिंडर का पाइप छूट गया हो! 🔋😭",
    moodTags: ["anxious", "frustrated", "stressed"],
    emoji: "🪫"
  },
  {
    id: "hi-daily-life-01",
    language: "hi",
    category: "daily-life",
    setup: "मम्मी: बेटा ज़रा धनिया ले आ।",
    punchline: "बेटा: धनिया नहीं मिला मम्मी, ये पुदीना ले लो, दोनों हरे ही तो हैं! 🌿",
    moodTags: ["frustrated", "neutral", "calm"],
    emoji: "🥗"
  },
  {
    id: "hi-family-01",
    language: "hi",
    category: "family",
    setup: "पापा जब भी न्यूज़ चैनल देखते हैं तो क्या होता है?",
    punchline: "रिमोट उनके हाथ में होता है और घर के बाकी लोग मोबाइल पर! 📺",
    moodTags: ["neutral", "calm", "bored"],
    emoji: "📺"
  },
  {
    id: "hi-social-media-01",
    language: "hi",
    category: "social-media",
    setup: "फेसबुक पर 5000 फ्रेंड्स होने का असली फायदा क्या है?",
    punchline: "कि आपकी पोस्ट पर कम से कम 5 लोग तो 'Nice DP' लिख ही देते हैं! 😂",
    moodTags: ["neutral", "happy", "calm"],
    emoji: "📸"
  },
  {
    id: "hi-work-01",
    language: "hi",
    category: "work",
    setup: "बॉस: तुम ऑफिस में सो रहे हो?",
    punchline: "कर्मचारी: नहीं सर, मैं तो बस ये देख रहा था कि कीबोर्ड का स्पेस बटन ठीक काम कर रहा है या नहीं! ⌨️",
    moodTags: ["tired", "neutral", "bored"],
    emoji: "😴"
  },
  {
    id: "hi-student-01",
    language: "hi",
    category: "student",
    setup: "एक छात्र की सबसे बड़ी दुविधा क्या है?",
    punchline: "पढ़ने बैठूं तो नींद आती है, और सोने जाऊं तो सिलेबस याद आता है! 🫠",
    moodTags: ["stressed", "low", "tired"],
    emoji: "📚"
  },
  {
    id: "hi-clever-01",
    language: "hi",
    category: "clever",
    setup: "इतिहास और भूगोल में क्या अंतर है?",
    punchline: "इतिहास में सब मर चुके होते हैं, और भूगोल में सब मरने वाले होते हैं! 🌍",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🗺️"
  },
  {
    id: "hi-silly-01",
    language: "hi",
    category: "silly",
    setup: "चिंटू: पापा, न्यूज़पेपर वाले सब झूठ लिखते हैं।",
    punchline: "पापा: क्यों बेटा? चिंटू: क्योंकि इसमें लिखा है 'कल धूप निकलेगी' और आज तो बारिश हो रही है! 🌧️",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "📰"
  },
  {
    id: "hi-food-02",
    language: "hi",
    category: "food",
    setup: "शादी में गए दोस्त से पूछा: खाना कैसा है?",
    punchline: "दोस्त: खाना तो अच्छा है, पर लिफाफे के पैसे वसूल नहीं हुए! 🍛",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🥘"
  },
  {
    id: "hi-phone-01",
    language: "hi",
    category: "phone",
    setup: "फ़ोन पर 2 घंटे बात करने के बाद मम्मी क्या बोलती हैं?",
    punchline: "'बाकी बातें बाद में करेंगे, अभी काम बहुत है!' 😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "📱"
  },
  {
    id: "hi-procrastination-01",
    language: "hi",
    category: "daily-life",
    setup: "कल का काम आज करो, आज का काम अभी...",
    punchline: "ये तो पुरानी बात है, असली बात है 'अभी का काम बाद में करेंगे'! 😴",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦥"
  },
  {
    id: "hi-friendship-02",
    language: "hi",
    category: "friendship",
    setup: "दोस्त: भाई, उधार देगा क्या?",
    punchline: "मैं: भाई, दोस्ती और पैसे के बीच में मैं कभी नहीं आता, इसलिए दोस्ती पक्की, पैसे नहीं! 🚫💰",
    moodTags: ["neutral", "calm", "happy"],
    emoji: "🤝"
  },
  {
    id: "hi-ai-01",
    language: "hi",
    category: "AI",
    setup: "AI अगर भारतीय मम्मी बन जाए तो क्या होगा?",
    punchline: "चैट बॉक्स में लिखकर आएगा: 'पूरा दिन फ़ोन में लगे रहो, खाना कौन बनाएगा?' 🤖",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🤖"
  },
  {
    id: "hi-one-liner-01",
    language: "hi",
    category: "one-liner",
    setup: "दुनिया का सबसे कठिन काम क्या है?",
    punchline: "सर्दियों में सुबह-सुबह नहाना! ❄️🛀",
    moodTags: ["tired", "low", "neutral"],
    emoji: "🚿"
  },
  {
    id: "hi-wordplay-01",
    language: "hi",
    category: "wordplay",
    setup: "बैंक में गया तो मैनेजर ने कहा: कैश नहीं है।",
    punchline: "मैंने कहा: तो मैनेजर क्यों बने, कैशियर बन जाते! 😂",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🏦"
  },
  {
    id: "hi-family-02",
    language: "hi",
    category: "family",
    setup: "मम्मी से पूछा: खाना क्या है?",
    punchline: "मम्मी: जो कल बना था वही, बस आज उसका नाम बदल गया है! 🍲",
    moodTags: ["frustrated", "neutral", "low"],
    emoji: "🍳"
  },
  {
    id: "hi-social-media-02",
    language: "hi",
    category: "social-media",
    setup: "व्हाट्सएप ग्रुप का असली मतलब क्या है?",
    punchline: "जहाँ 50 लोग होते हैं और सिर्फ 2 लोग ही गुड मॉर्निंग बोलते हैं! 🤳",
    moodTags: ["lonely", "low", "neutral"],
    emoji: "📲"
  },
  {
    id: "hi-sleep-01",
    language: "hi",
    category: "sleep",
    setup: "रात को 2 बजे प्यास लगे तो क्या होता है?",
    punchline: "किचन में पानी पीने जाते समय भूत दिखने लगते हैं! 👻",
    moodTags: ["tired", "anxious", "low"],
    emoji: "🌑"
  },
  {
    id: "hi-clever-02",
    language: "hi",
    category: "clever",
    setup: "इंसान और परिंदे में क्या समानता है?",
    punchline: "दोनों ही सुबह उठते ही दाना-पानी की तलाश में निकल पड़ते हैं! 🐦",
    moodTags: ["neutral", "calm", "happy"],
    emoji: "🌾"
  },
  {
    id: "hi-silly-02",
    language: "hi",
    category: "silly",
    setup: "पागल: डॉक्टर साहब, सब मुझे नज़रअंदाज़ कर रहे हैं।",
    punchline: "डॉक्टर: अगला मरीज़ भेजिये! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🏥"
  },
  {
    id: "hi-one-liner-02",
    language: "hi",
    category: "one-liner",
    setup: "खुशी का असली राज़ क्या है?",
    punchline: "दोस्त का मोबाइल डिस्चार्ज हो जाना! 🪫😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "✨"
  },

  // ================= TAMIL JOKES (30+) =================
  {
    id: "ta-college-01",
    language: "ta",
    category: "college",
    setup: "ஹாஸ்டல் சாம்பாருக்கும் குழாய் தண்ணிக்கும் என்ன வித்தியாசம்?",
    punchline: "குழாய் தண்ணில கொஞ்சம் உப்பு இருக்கும்... ஹாஸ்டல் சாம்பார்ல தேடுனா தான் பருப்பு இருக்கும்! 😂",
    moodTags: ["stressed", "frustrated", "low"],
    emoji: "🎓"
  },
  {
    id: "ta-college-02",
    language: "ta",
    category: "college",
    setup: "ப்ரொஃபஸர் 'அட்டெண்டன்ஸ் எடுக்குறேன்'னு சொன்னதும் என்ன நடக்கும்?",
    punchline: "கேன்டீன்ல இருந்த பிரண்ட்ஸ் புல்லட் வேகத்துல கிளாஸுக்கு ஓடி வருவாங்க! 🏃😭",
    moodTags: ["stressed", "anxious", "neutral"],
    emoji: "🏃"
  },
  {
    id: "ta-coding-01",
    language: "ta",
    category: "coding",
    setup: "கோடிங் பண்றவன் ராத்திரி 3 மணிக்கு ஏன் திடீர்னு சிரிக்கிறான்?",
    punchline: "4 மணி நேர தேடலுக்கு அப்புறம் ஒரு மிஸ்ஸிங் செமிகோலன் (;) கிடைச்சிருச்சு! 💻",
    moodTags: ["stressed", "frustrated", "neutral"],
    emoji: "💻"
  },
  {
    id: "ta-food-01",
    language: "ta",
    category: "food",
    setup: "காலேஜ்ல லஞ்ச் பிரேக்ல ரொம்ப வேகமா மாயமாற விஷயம் எது?",
    punchline: "பிரண்ட் வீட்ல இருந்து கொண்டுவந்த சிக்கன் ஃப்ரை டிபன் பாக்ஸ்! 🍗",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍗"
  },
  {
    id: "ta-college-03",
    language: "ta",
    category: "college",
    setup: "டீச்சர்: ஏன் தினமும் கிளாஸுக்கு லேட்டா வர்ற?",
    punchline: "ஸ்டூடண்ட்: வழியில 'மெதுவாக செல்லவும்' போர்டு பார்த்தேன் சார்! 🚗",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🚗"
  },
  {
    id: "ta-friendship-01",
    language: "ta",
    category: "friendship",
    setup: "வைஃபைக்கும் நல்ல நண்பனுக்கும் என்ன சம்பந்தம்?",
    punchline: "சிக்னல் கிடைச்சா போதும், நாள் முழுக்க ஜாலியா இருக்கும்! 📱",
    moodTags: ["happy", "calm", "neutral"],
    emoji: "🤝"
  },
  {
    id: "ta-relatable-01",
    language: "ta",
    category: "daily-life",
    setup: "ராத்திரி தூங்கும் போது கொசு காதுகிட்ட வந்து என்ன பாட்டு பாடும்?",
    punchline: "'மச்சி தூங்கிட்டியா இல்லை கடிக்கவா?' 🦟",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦟"
  },
  {
    id: "ta-exam-01",
    language: "ta",
    category: "exam",
    setup: "எக்ஸாம் ஹால்ல பக்கத்து சீட்ல உக்காந்துருக்க நண்பன் யாரு?",
    punchline: "அந்த 3 மணி நேரத்துக்கு நம்மள காப்பாத்த வந்த கடவுள்! 😇",
    moodTags: ["stressed", "anxious", "frustrated"],
    emoji: "✍️"
  },
  {
    id: "ta-college-04",
    language: "ta",
    category: "college",
    setup: "காலைல 8 மணி கிளாஸ்னா என்ன அர்த்தம்?",
    punchline: "7:58-க்கு கண்ண முழிச்சு அட்டெண்டன்ஸ் போட ஓடுறது! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "⏰"
  },
  {
    id: "ta-tech-01",
    language: "ta",
    category: "technology",
    setup: "போன் பேட்டரி 1% இருக்கும் போது நம்ம ஃபீலிங் என்ன?",
    punchline: "வெண்டிலேட்டர்ல இருக்குற மாதிரி ஒரு தவிப்பு! 🔋😭",
    moodTags: ["anxious", "frustrated", "stressed"],
    emoji: "🪫"
  },
  {
    id: "ta-daily-life-01",
    language: "ta",
    category: "daily-life",
    setup: "பஸ்ல ஜன்னல் சீட் கிடைக்கலனா என்ன பண்ணுவோம்?",
    punchline: "பக்கத்துல இருக்குறவர் எப்ப இறங்குவார்னு பார்த்துட்டே இருப்போம்! 😂",
    moodTags: ["frustrated", "neutral", "calm"],
    emoji: "🚌"
  },
  {
    id: "ta-family-01",
    language: "ta",
    category: "family",
    setup: "அம்மா: தம்பி, அந்த மிளகாய் தூள் டப்பாவை எடுத்துட்டு வா.",
    punchline: "மகன்: அம்மா, இதுல மிளகாய் தூள் இல்லையே, பருப்பு தான் இருக்கு! 😂",
    moodTags: ["neutral", "calm", "bored"],
    emoji: "🌶️"
  },
  {
    id: "ta-one-liner-01",
    language: "ta",
    category: "one-liner",
    setup: "வாழ்க்கையில ஒரு தடவையாவது நாம யோசிக்கிற விஷயம் என்ன தெரியுமா?",
    punchline: "நாம ஏன் பொறந்தோம்னு இல்ல, இன்னைக்கு என்ன குழம்பு வச்சிருக்காங்கனு தான்! 🥘",
    moodTags: ["neutral", "low", "calm"],
    emoji: "🤔"
  },
  {
    id: "ta-social-media-01",
    language: "ta",
    category: "social-media",
    setup: "வாட்ஸ்அப் ஸ்டேட்டஸ் போடுறதோட உண்மையான காரணம் என்ன?",
    punchline: "நாம நல்லா இருக்கோம்னு காட்டுறது இல்ல, நாம என்ன பண்றோம்னு ஒருத்தர் பாக்கணும்னு தான்! 🤳",
    moodTags: ["neutral", "happy", "calm"],
    emoji: "📲"
  },
  {
    id: "ta-work-01",
    language: "ta",
    category: "work",
    setup: "ஆபீஸ்ல லேட்டா வர்றதுக்கு சொல்லப்படுற மிக பெரிய பொய் எது?",
    punchline: "'சிக்னல் விழுந்துருச்சு சார்' - ஆனா நாம அப்ப தான் பெட்ல இருந்து எந்திரிச்சிருப்போம்! 😂",
    moodTags: ["tired", "neutral", "bored"],
    emoji: "🏢"
  },
  {
    id: "ta-student-01",
    language: "ta",
    category: "student",
    setup: "ஸ்டூடண்ட் லைஃப்ல மிக பெரிய பயம் எது?",
    punchline: "ரிசல்ட் வர்றது இல்ல, ரிசல்ட் வர்ற அன்னைக்கு அப்பாவோட முகத்தை பாக்குறது தான்! 😰",
    moodTags: ["stressed", "anxious", "low"],
    emoji: "👨"
  },
  {
    id: "ta-clever-01",
    language: "ta",
    category: "clever",
    setup: "ஏன் வௌவால் தலைகீழா தொங்குது தெரியுமா?",
    punchline: "ஏன்னா அதுக்கு தரையில படுக்க பாய் இல்லையாம்! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🦇"
  },
  {
    id: "ta-silly-01",
    language: "ta",
    category: "silly",
    setup: "டாக்டர்: ஏன் மாத்திரை போடல?",
    punchline: "நோயாளி: மாத்திரை மேல 'காலாவதி'னு எழுதி இருந்துச்சு சார்! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "💊"
  },
  {
    id: "ta-food-02",
    language: "ta",
    category: "food",
    setup: "ஹோட்டல்ல இட்லி ஆர்டர் பண்ணா என்ன கேப்பாங்க?",
    punchline: "'சாம்பார் வேணுமா இல்ல சட்னி வேணுமா?' - ஆனா ரெண்டும் ஒரே தண்ணியா தான் இருக்கும்! 🥣",
    moodTags: ["frustrated", "neutral", "low"],
    emoji: "🥣"
  },
  {
    id: "ta-friendship-02",
    language: "ta",
    category: "friendship",
    setup: "நண்பன்: மச்சி, 100 ரூபாய் கடன் கொடு.",
    punchline: "நான்: மச்சி, காசு இல்ல, ஆனா என்கிட்ட 100 ஐடியா இருக்கு, வேணுமா? 😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "🤝"
  },
  {
    id: "ta-ai-01",
    language: "ta",
    category: "AI",
    setup: "AI தமிழ்ல கவிதை எழுதுனா எப்படி இருக்கும்?",
    punchline: "'உன் கண்ணில் மை உள்ளது, என் மெமரியில் டேட்டா உள்ளது'னு பாடும்! 🤖",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🤖"
  },
  {
    id: "ta-phone-01",
    language: "ta",
    category: "phone",
    setup: "போன்ல பாஸ்வேர்ட் போடறதோட உண்மையான நோக்கம் என்ன?",
    punchline: "நம்ம போனை யாரும் பாக்க கூடாதுனு இல்ல, நம்ம சேட்ஸை யாராவது பாத்துட்டா என்ன ஆகுமோனு தான்! 📱",
    moodTags: ["anxious", "neutral", "calm"],
    emoji: "🔐"
  },
  {
    id: "ta-sleep-01",
    language: "ta",
    category: "sleep",
    setup: "ஏன் தூக்கம் வரமாட்டேங்குதுனு யோசிச்சா என்ன ஆகும்?",
    punchline: "தூக்கம் வரதுக்கு பதிலா, பழைய கவலைகள் எல்லாம் தான் வரும்! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "🌑"
  },
  {
    id: "ta-wordplay-01",
    language: "ta",
    category: "wordplay",
    setup: "மீன் ஏன் தண்ணிலயே இருக்கு தெரியுமா?",
    punchline: "ஏன்னா அதுக்கு கரண்ட் பில் கட்ட பிடிக்காதாம்! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🐟"
  },
  {
    id: "ta-family-02",
    language: "ta",
    category: "family",
    setup: "அப்பா: தம்பி, என்ன படிக்கிற?",
    punchline: "மகன்: அப்பா, நான் இன்ஜினியரிங் படிக்கிறேன், ஆனா என்ன படிக்கிறேன்னு எனக்கே தெரியல! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "📖"
  },
  {
    id: "ta-social-media-02",
    language: "ta",
    category: "social-media",
    setup: "இன்ஸ்டாகிராம்ல போட்டோ போடுறதோட கஷ்டம் என்ன தெரியுமா?",
    punchline: "நல்ல போட்டோ எடுக்குறது இல்ல, அதுக்கு ஏத்த கேப்ஷன் யோசிக்கிறது தான்! 🤳",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "📸"
  },
  {
    id: "ta-one-liner-02",
    language: "ta",
    category: "one-liner",
    setup: "வாழ்க்கை ஒரு வட்டம்னு ஏன் சொல்றாங்க?",
    punchline: "ஏன்னா நாம எங்க ஆரம்பிச்சோமோ அங்கயே தான் நிக்கிறோம்! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "⭕"
  },
  {
    id: "ta-silly-02",
    language: "ta",
    category: "silly",
    setup: "ஏன் நிலா பகல்ல வரமாட்டேங்குது தெரியுமா?",
    punchline: "ஏன்னா அதுக்கு வெயில்ல கருப்பாக பிடிக்காதாம்! 🌕",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🌕"
  },
  {
    id: "ta-food-03",
    language: "ta",
    category: "food",
    setup: "தோசைக்கும் ஆப்பத்துக்கும் என்ன வித்தியாசம்?",
    punchline: "தோசைக்கு நடுவுல ஓட்டை இருக்காது, ஆப்பத்துக்கு நடுவுல தான் இருக்கும்! 😂",
    moodTags: ["neutral", "calm", "happy"],
    emoji: "🥞"
  },
  {
    id: "ta-daily-life-02",
    language: "ta",
    category: "daily-life",
    setup: "ஏன் நாம தினமும் காலையில எந்திரிக்கிறோம் தெரியுமா?",
    punchline: "நாம எந்திரிக்கலனா வீட்ல திட்டுவாங்கனு தான்! 😂",
    moodTags: ["tired", "neutral", "calm"],
    emoji: "⏰"
  },

  // ================= KANNADA JOKES (30+) =================
  {
    id: "kn-college-01",
    language: "kn",
    category: "college",
    setup: "ಹಾಸ್ಟೆಲ್ ಸಾಂಬಾರ್‌ಗೂ ನಳ್ಳಿ ನೀರಿಗೂ ಏನು ವ್ಯತ್ಯಾಸ?",
    punchline: "ನಳ್ಳಿ ನೀರಿನಲ್ಲಿ ಸ್ವಲ್ಪ ಉಪ್ಪು ಇರುತ್ತೆ... ಹಾಸ್ಟೆಲ್ ಸಾಂಬಾರ್‌ನಲ್ಲಿ ಹುಡುಕಿದ್ರೆ ಬೇಳೆ ಸಿಗುತ್ತೆ! 😂",
    moodTags: ["stressed", "frustrated", "low"],
    emoji: "🎓"
  },
  {
    id: "kn-college-02",
    language: "kn",
    category: "college",
    setup: "ಪ್ರೊಫೆಸರ್ 'ಅಟೆಂಡೆನ್ಸ್ ತೆಗಿತಿದ್ದೀನಿ' ಅಂದ ತಕ್ಷಣ ಏನಾಗುತ್ತೆ?",
    punchline: "ಕ್ಯಾಂಟೀನ್‌ನಲ್ಲಿದ್ದ ಫ್ರೆಂಡ್ಸ್ ರಾಕೆಟ್ ಸ್ಪೀಡ್‌ನಲ್ಲಿ ಕ್ಲಾಸ್‌ಗೆ ಓಡಿ ಬರ್ತಾರೆ! 🏃😭",
    moodTags: ["stressed", "anxious", "neutral"],
    emoji: "🏃"
  },
  {
    id: "kn-coding-01",
    language: "kn",
    category: "coding",
    setup: "ಕೋಡರ್ ರಾತ್ರಿ 3 ಗಂಟೆಗೆ ಯಾಕೆ ಖುಷಿಯಿಂದ ಕುಣಿತಾನೆ?",
    punchline: "4 ಗಂಟೆ ಹುಡುಕಾಟದ ನಂತರ ಒಂದು ಸೆಮಿಕೋಲನ್ (;) ಸಿಕ್ತು ಅಂತ! 💻",
    moodTags: ["stressed", "frustrated", "neutral"],
    emoji: "💻"
  },
  {
    id: "kn-food-01",
    language: "kn",
    category: "food",
    setup: "ಕಾಲೇಜಿನಲ್ಲಿ ಲಂಚ್ ಬ್ರೇಕ್‌ನಲ್ಲಿ ಅತಿ ವೇಗವಾಗಿ ಮಾಯವಾಗುವ ವಸ್ತು ಯಾವುದು?",
    punchline: "ಫ್ರೆಂಡ್ ಮನೆನಿಂದ ತಂದಿದ್ದ ಚಿಕನ್ ಫ್ರೈ ಟಿಫಿನ್ ಬಾಕ್ಸ್! 🍗",
    moodTags: ["happy", "energetic", "neutral"],
    emoji: "🍗"
  },
  {
    id: "kn-college-03",
    language: "kn",
    category: "college",
    setup: "ಟೀಚರ್: ದಿನಾ ಯಾಕೆ ಲೇಟಾಗಿ ಬರ್ತಿಯಾ?",
    punchline: "ಸ್ಟೂಡೆಂಟ್: ದಾರಿಯಲ್ಲಿ 'Go Slow' ಅಂತ ಬೋರ್ಡ್ ಇತ್ತು ಸರ್! 🚗",
    moodTags: ["bored", "neutral", "calm"],
    emoji: "🚗"
  },
  {
    id: "kn-friendship-01",
    language: "kn",
    category: "friendship",
    setup: "ವೈ-ಫೈಗೂ ಒಳ್ಳೆ ಗೆಳೆಯನಿಗೂ ಏನು ಸಂಬಂಧ?",
    punchline: "ಕನೆಕ್ಷನ್ ಸಿಕ್ಕರೆ ಸಾಕು, ದಿನವೆಲ್ಲಾ ಹ್ಯಾಪಿ! 📱",
    moodTags: ["happy", "calm", "neutral"],
    emoji: "🤝"
  },
  {
    id: "kn-everyday-01",
    language: "kn",
    category: "daily-life",
    setup: "ರಾತ್ರಿ ಮಲಗುವಾಗ ಸೊಳ್ಳೆ ಕಿವಿ ಹತ್ತಿರ ಬಂದು ಏನು ಹೇಳುತ್ತೆ?",
    punchline: "'ಮಲಗಿದ್ದೀಯಾ ಅಥವಾ ಕಚ್ಚಲಾ?' 🦟",
    moodTags: ["tired", "bored", "neutral"],
    emoji: "🦟"
  },
  {
    id: "kn-exam-01",
    language: "kn",
    category: "exam",
    setup: "ಎಕ್ಸಾಮ್ ಹಾಲ್‌ನಲ್ಲಿ ಪಕ್ಕದಲ್ಲಿ ಕೂತಿರೋ ಫ್ರೆಂಡ್ ಯಾರು?",
    punchline: "ಆ 3 ಗಂಟೆಗೆ ನಮ್ಗೆ ಸಾಕ್ಷಾತ್ ದೇವರು! 😇",
    moodTags: ["stressed", "anxious", "frustrated"],
    emoji: "✍️"
  },
  {
    id: "kn-college-04",
    language: "kn",
    category: "college",
    setup: "ಬೆಳಗ್ಗೆ 8 ಗಂಟೆ ಕ್ಲಾಸ್ ಅಂದ್ರೆ ಏನು ಅರ್ಥ?",
    punchline: "7:58ಕ್ಕೆ ಕಣ್ಣು ಬಿಟ್ಟು ಅಟೆಂಡೆನ್ಸ್ ಹಾಕೋಕೆ ಓಡೋದು! 😴",
    moodTags: ["tired", "low", "neutral"],
    emoji: "⏰"
  },
  {
    id: "kn-tech-01",
    language: "kn",
    category: "technology",
    setup: "ಫೋನ್ ಬ್ಯಾಟರಿ 1% ಇದ್ದಾಗ ನಮ್ ಫೀಲಿಂಗ್ ಏನು?",
    punchline: "ಐಸಿಯು ಹೊರಗಡೆ ಕಾಯೋ ಫೀಲಿಂಗ್! 🔋😭",
    moodTags: ["anxious", "frustrated", "stressed"],
    emoji: "🪫"
  },
  {
    id: "kn-daily-life-01",
    language: "kn",
    category: "daily-life",
    setup: "ಟ್ರಾಫಿಕ್‌ನಲ್ಲಿ ಸಿಕ್ಕಿಕೊಂಡಾಗ ಕನ್ನಡಿಗ ಏನು ಯೋಚಿಸ್ತಾನೆ?",
    punchline: "'ಈ ಸಿಗ್ನಲ್ ಬಿಡೋಕು ಮುಂಚೆ ನನ್ನ ಮದುವೆ ಆಗ್ಬಿಡುತ್ತೇನೋ' ಅಂತ! 😂",
    moodTags: ["frustrated", "neutral", "calm"],
    emoji: "🚦"
  },
  {
    id: "kn-family-01",
    language: "kn",
    category: "family",
    setup: "ಅಪ್ಪ: ಮಗನೇ, ಫೋನಿನಲ್ಲಿ ಏನು ಮಾಡ್ತಿದೀಯಾ?",
    punchline: "ಮಗ: ಅಪ್ಪ, ನಾನು ಆನ್‌ಲೈನ್ ಕ್ಲಾಸ್ ಕೇಳ್ತಿದ್ದೀನಿ. ಅಪ್ಪ: ಹಾಗಾದ್ರೆ ಆ ಪಬ್‌ಜಿ ಸೌಂಡ್ ಎಲ್ಲಿಂದ ಬರ್ತಿದೆ? 😂",
    moodTags: ["neutral", "calm", "bored"],
    emoji: "🎮"
  },
  {
    id: "kn-one-liner-01",
    language: "kn",
    category: "one-liner",
    setup: "ಬದುಕು ಅನ್ನೋದು ಒಂತರ ದೋಸೆ ಇದ್ದಂಗೆ...",
    punchline: "ಒಂದು ಕಡೆ ಬೆಂದ್ರೆ ಸಾಲದು, ಇನ್ನೊಂದು ಕಡೆನೂ ತಿರುಗಿಸಿ ಹಾಕಬೇಕು! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "🥞"
  },
  {
    id: "kn-social-media-01",
    language: "kn",
    category: "social-media",
    setup: "ವಾಟ್ಸಾಪ್ ಸ್ಟೇಟಸ್ ಹಾಕೋದ್ರಿಂದ ಏನು ಲಾಭ?",
    punchline: "ನಮ್ಮ ಶತ್ರುಗಳು ನಾವು ಎಷ್ಟು ಚೆನ್ನಾಗಿದ್ದೀವಿ ಅಂತ ನೋಡಿ ಹೊಟ್ಟೆ ಉರ್ಕೋತಾರೆ! 😂",
    moodTags: ["neutral", "happy", "calm"],
    emoji: "📲"
  },
  {
    id: "kn-work-01",
    language: "kn",
    category: "work",
    setup: "ಆಫೀಸ್‌ನಲ್ಲಿ ಬಾಸ್ ಎದುರಿಗೆ ಕೆಲಸ ಮಾಡೋದು ಹೇಗೆ?",
    punchline: "ಟೈಪಿಂಗ್ ಸೌಂಡ್ ಜೋರಾಗಿ ಬರಬೇಕು, ಆದರೆ ಸ್ಕ್ರೀನ್ ಮೇಲೆ ಏನೂ ಇರಬಾರದು! 😂",
    moodTags: ["tired", "neutral", "bored"],
    emoji: "🏢"
  },
  {
    id: "kn-student-01",
    language: "kn",
    category: "student",
    setup: "ಎಕ್ಸಾಮ್ ಮುಗಿದ ಮೇಲೆ ಸ್ಟೂಡೆಂಟ್ ಏನು ಮಾಡ್ತಾನೆ?",
    punchline: "ಪುಸ್ತಕಗಳನ್ನೆಲ್ಲಾ ಮೂಟೆಗೆ ಹಾಕಿ ಬೆಡ್ ಕೆಳಗೆ ತಳ್ತಾನೆ! 😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "🛌"
  },
  {
    id: "kn-clever-01",
    language: "kn",
    category: "clever",
    setup: "ಆಕಾಶಕ್ಕೆ ಏಣಿ ಹಾಕೋದು ಅಂದ್ರೆ ಏನು?",
    punchline: "ನಮ್ಮ ಅಮ್ಮನ ಹತ್ತಿರ ಹೊಸ ಬಟ್ಟೆ ಕೊಡಿಸಿ ಅಂತ ಕೇಳೋದು! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "👗"
  },
  {
    id: "kn-silly-01",
    language: "kn",
    category: "silly",
    setup: "ಯಾಕೆ ಸೊಳ್ಳೆಗಳು ನಮ್ಮ ಕಿವಿಯಲ್ಲೇ ಬಂದು ಹಾಡ್ತಾವೆ?",
    punchline: "ಏಕೆಂದರೆ ಅವುಗಳಿಗೆ ನಮ್ಮ ಮೈಕ್ ಮೇಲೆ ನಂಬಿಕೆ ಇಲ್ಲವಂತೆ! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🦟"
  },
  {
    id: "kn-food-02",
    language: "kn",
    category: "food",
    setup: "ಮನೆಯಲ್ಲಿ ಉಪ್ಪಿಟ್ಟು ಮಾಡಿದಾಗ ಮಕ್ಕಳು ಏನು ಮಾಡ್ತಾರೆ?",
    punchline: "ತಟ್ಟೆ ಹಿಡ್ಕೊಂಡು ಹೊರಗಡೆ ಇರೋ ಕುక్కೆಗೆ ಹಾಕೋಕೆ ಚಾನ್ಸ್ ಹುಡುಕ್ತಾರೆ! 😂",
    moodTags: ["frustrated", "neutral", "low"],
    emoji: "🥣"
  },
  {
    id: "kn-friendship-02",
    language: "kn",
    category: "friendship",
    setup: "ಗೆಳೆಯ: ಅಳಿಯ, ಒಂದು ಸಾವಿರ ರೂಪಾಯಿ ಸಾಲ ಕೊಡೋ.",
    punchline: "ನಾನು: ಗೆಳೆತನದಲ್ಲಿ ಸಾಲ ಅನ್ನೋ ಪದಾನೇ ಬರಬಾರದು ಮಚ್ಚಾ, ಅದಕ್ಕೆ ನಾನು ಕೊಡಲ್ಲ! 😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "🤝"
  },
  {
    id: "kn-ai-01",
    language: "kn",
    category: "AI",
    setup: "ಕಂಪ್ಯೂಟರ್‌ಗೆ ಜ್ವರ ಬಂದ್ರೆ ಏನಾಗುತ್ತೆ?",
    punchline: "ಅದಕ್ಕೆ ವಿಂಡೋಸ್ ಚೇಂಜ್ ಮಾಡಬೇಕಾಗುತ್ತೆ! 😂",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🤖"
  },
  {
    id: "kn-phone-01",
    language: "kn",
    category: "phone",
    setup: "ಫೋನ್ ಚಾರ್ಜಿಂಗ್ ಇಟ್ಟಾಗ ನಮ್ ಫೀಲಿಂಗ್ ಏನು?",
    punchline: "ದೇವಸ್ಥಾನದಲ್ಲಿ ದೀಪ ಹಚ್ಚಿ ಬಂದ ಫೀಲಿಂಗ್! 😂",
    moodTags: ["happy", "neutral", "calm"],
    emoji: "🔋"
  },
  {
    id: "kn-sleep-01",
    language: "kn",
    category: "sleep",
    setup: "ಮಧ್ಯಾಹ್ನ ನಿದ್ರೆ ಮಾಡೋದ್ರಿಂದ ಏನು ಸಿಗುತ್ತೆ?",
    punchline: "ರಾತ್ರಿ ನಿದ್ರೆ ಬರೋದಿಲ್ಲ ಅಷ್ಟೇ! 😂",
    moodTags: ["tired", "low", "neutral"],
    emoji: "😴"
  },
  {
    id: "kn-wordplay-01",
    language: "kn",
    category: "wordplay",
    setup: "ಆನೆ ಮದುವೆ ಆದ್ರೆ ಏನಾಗುತ್ತೆ?",
    punchline: "ಅದಕ್ಕೆ ಒಂದು ದೊಡ್ಡ ಮನೆ ಬೇಕಾಗುತ್ತೆ! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "🐘"
  },
  {
    id: "kn-family-02",
    language: "kn",
    category: "family",
    setup: "ಅಮ್ಮ: ಅಡುಗೆ ಮನೆಯಲ್ಲಿ ಏನೋ ಶಬ್ದ ಬರ್ತಿದೆ.",
    punchline: "ಮಗ: ಅಮ್ಮ, ಅದು ಇಲಿ ಅಲ್ಲ, ನಾನು ಫ್ರಿಡ್ಜ್ ಓಪನ್ ಮಾಡಿದ್ದು! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "🐀"
  },
  {
    id: "kn-social-media-02",
    language: "kn",
    category: "social-media",
    setup: "ಫೇಸ್‌ಬುಕ್‌ನಲ್ಲಿ ಲೈಕ್ ಕೊಡೋದ್ರಿಂದ ಪುಣ್ಯ ಬರುತ್ತಾ?",
    punchline: "ಪುಣ್ಯ ಬರಲ್ಲ, ಫ್ರೆಂಡ್ ರಿಕ್ವೆಸ್ಟ್ ಜಾಸ್ತಿ ಬರುತ್ತೆ ಅಷ್ಟೇ! 😂",
    moodTags: ["neutral", "bored", "calm"],
    emoji: "🤳"
  },
  {
    id: "kn-one-liner-02",
    language: "kn",
    category: "one-liner",
    setup: "ಪ್ರೀತಿ ಅನ್ನೋದು ಮಳೆಯ ತರ...",
    punchline: "ಬಂದಾಗ ಚೆನ್ನಾಗಿರುತ್ತೆ, ಆದ್ರೆ ನೆನೆದ ಮೇಲೆ ಜ್ವರ ಬರುತ್ತೆ! 😂",
    moodTags: ["neutral", "low", "calm"],
    emoji: "🌧️"
  },
  {
    id: "kn-silly-02",
    language: "kn",
    category: "silly",
    setup: "ಯಾಕೆ ಸೂರ್ಯನಿಗೆ ಲೈಟ್ ಬೇಕಿಲ್ಲ?",
    punchline: "ಯಾಕಂದ್ರೆ ಅವನ ಹತ್ತಿರ ಆಲ್റെಡಿ ಪವರ್ ಬಿಲ್ ಕಟ್ಟೋಕೆ ಕಾಸಿಲ್ಲ! 😂",
    moodTags: ["happy", "bored", "neutral"],
    emoji: "☀️"
  },
  {
    id: "kn-food-03",
    language: "kn",
    category: "food",
    setup: "ದೋಸೆ ಮತ್ತು ಇಡ್ಲಿ ನಡುವಿನ ಜಗಳ ಏನಾಯ್ತು?",
    punchline: "ಕೊನೆಗೆ ಸಾಂಬಾರ್ ಬಂದು ಇಬ್ಬರನ್ನೂ ಸಮಾಧಾನ ಮಾಡ್ತು! 😂",
    moodTags: ["neutral", "calm", "happy"],
    emoji: "🍛"
  },
  {
    id: "kn-daily-life-02",
    language: "kn",
    category: "daily-life",
    setup: "ಬೆಂಗಳೂರು ಟ್ರಾಫಿಕ್‌ನಲ್ಲಿ ಅತಿ ದೊಡ್ಡ ಸಾಧನೆ ಯಾವುದು?",
    punchline: "ಒಂದು ಕಿಲೋಮೀಟರ್ ದೂರವನ್ನ ಒಂದು ಗಂಟೆಗಿಂತ ಬೇಗ ಕ್ರಮಿಸೋದು! 😂",
    moodTags: ["frustrated", "neutral", "calm"],
    emoji: "🚗"
  }
];

// Enrich JOKES to provide backwards compatibility with `text` and `moodCategories`
JOKES.forEach(j => {
  if (!j.text) {
    j.text = `${j.setup}\n\n${j.punchline}`;
  }
  if (!j.moodCategories) {
    j.moodCategories = j.moodTags;
  }
});
