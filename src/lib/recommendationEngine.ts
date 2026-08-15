import { UserData } from '../types';
import { JOKES } from '../data/jokes';
import { getUserRarity } from './progression';
import { 
  Wind, 
  Music, 
  BookOpen, 
  Brain, 
  Zap, 
  Smile, 
  Target,
  Layout,
  LucideIcon,
  Moon,
  Droplets
} from 'lucide-react';

export type Recommendation = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
  bg: string;
  actionLabel: string;
  category?: string;
  why?: string;
};

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    recommendedForYou: "Recommended for You",
    basedOnLatest: "Based on your latest {mood} mood check-in",
    personalizedSuggestions: "Personalized suggestions for your wellbeing",
    lockedTitle: "Personalized recommendations are locked",
    lockedDesc: "Complete today's mood check-in to receive personalized wellness suggestions tailored to your current emotional state.",
    checkInNow: "Check In Now",
    openFeature: "Open Feature",
    start: "Start",
    play: "Play",
    tryIt: "Try It",
    breathe: "Breathe",
    calmBreathing: "Calm Breathing",
    calmBreathingDesc: "Regulate your nervous system with a short breathing practice.",
    grounding: "Grounding Exercise",
    groundingDesc: "A simple activity to help you pause and refocus your senses.",
    calmMusic: "Calm Music",
    calmMusicDesc: "Relaxing track for your current mood.",
    quickJournal: "Quick Journal",
    quickJournalDesc: "Write down what is on your mind.",
    smileBreak: "Smile Break",
    smileBreakDesc: "Keep the positive energy going.",
    energyActivity: "Energy Activity",
    energyActivityDesc: "A quick activity to stay energized.",
    upliftingMusic: "Uplifting Music",
    upliftingMusicDesc: "Music matching your current mood.",
    gentleMed: "Gentle Meditation",
    gentleMedDesc: "Soft guidance for your mind.",
    mindfulness: "Mindfulness",
    mindfulnessDesc: "Stay present and enjoy your calm.",
    focus: "Quick Focus",
    focusDesc: "Sharpen your mind for productivity.",
    liveInsight: "Live Insight",
    stayHydrated: "Stay Hydrated",
    hydrationProgress: "You've had {current} of {goal} glasses today.",
    logSleep: "Log Sleep",
    sleepHelp: "Tracking sleep helps us provide better recommendations.",
    deepRest: "Deep Rest",
    sleepRecover: "Guided meditation to help recover from a short night.",
    goalProgress: "Goal Progress",
    goalDesc: "Make progress on your {category} goal today.",
    mindfulBreak: "Mindful Break",
    mindfulBreakDesc: "Step away for a moment of pure awareness.",
    mentorGreeting: "Hi {name}! I'm your Mood Mentor. 🌱",
    mentorNewUser: "I'm still getting to know your wellness routine. Start with a mood check-in and I'll personalize your suggestions.",
    mentorGoodMorning: "Good morning",
    mentorGoodAfternoon: "Good afternoon",
    mentorGoodEvening: "Good evening",
    mentorStatus: "Your latest check-in shows you're feeling **{mood}**.",
    mentorActivityDone: "You've already completed **{count} wellness activity** today.",
    mentorActivityNone: "You haven't started your wellness routine yet today.",
    mentorHydrationDone: "Nice job staying hydrated today! 💧",
    mentorHydrationPending: "Your hydration goal is still in progress ({current}/{goal} glasses).",
    mentorStreak: "You're on a **{count}-day streak**.",
    whyMood: "Recommended because you're feeling {mood}.",
    whyHydration: "Recommended because your hydration goal is incomplete.",
    whyGoal: "Recommended because you have an active goal.",
    whySleep: "Recommended because you logged less sleep recently.",
    whyHistory: "Recommended because you haven't tried this recently.",
    whyDefault: "Try this to enhance your wellbeing today.",
    mindGym: "Mind Gym",
    mindGymDesc: "Brain exercises to stay sharp."
  },
  te: {
    recommendedForYou: "మీ కోసం సిఫార్సులు",
    basedOnLatest: "మీ తాజా {mood} మూడ్ చెక్-ఇన్ ఆధారంగా",
    personalizedSuggestions: "మీ ఆరోగ్యం కోసం వ్యక్తిగతీకరించిన సూచనలు",
    lockedTitle: "వ్యక్తిగతీకరించిన సిఫార్సులు లాక్ చేయబడ్డాయి",
    lockedDesc: "మీ ప్రస్తుత మానసిక స్థితికి అనుగుణంగా వ్యక్తిగతీకరించిన సూచనలను పొందడానికి నేటి మూడ్ చెక్-ఇన్‌ను పూర్తి చేయండి.",
    checkInNow: "ఇప్పుడే చెక్-ఇన్ చేయండి",
    openFeature: "ఓపెన్ ఫీచర్",
    start: "ప్రారంభించండి",
    play: "ప్లే చేయండి",
    tryIt: "ప్రయత్నించండి",
    breathe: "శ్వాస తీసుకోండి",
    calmBreathing: "ప్రశాంతమైన శ్వాస",
    calmBreathingDesc: "చిన్న శ్వాస అభ్యాసంతో మీ నాడీ వ్యవస్థను నియంత్రించండి.",
    grounding: "గ్రౌండింగ్ వ్యాయామం",
    groundingDesc: "మీ ఇంద్రియాలను కేంద్రీకరించడంలో సహాయపడే ఒక సాధారణ కార్యాచరణ.",
    calmMusic: "ప్రశాంతమైన సంగీతం",
    calmMusicDesc: "మీ ప్రస్తుత మూడ్ కోసం రిలాక్సింగ్ ట్రాక్.",
    quickJournal: "త్వరిత జర్నల్",
    quickJournalDesc: "మీ మనస్సులో ఉన్నదాన్ని వ్రాసుకోండి.",
    smileBreak: "స్మైల్ బ్రేక్",
    smileBreakDesc: "సానుకూల శక్తిని కొనసాగించండి.",
    energyActivity: "శక్తి కార్యాచరణ",
    energyActivityDesc: "శక్తివంతంగా ఉండటానికి త్వరిత కార్యాచరణ.",
    upliftingMusic: "ఉత్తేజకరమైన సంగీతం",
    upliftingMusicDesc: "మీ ప్రస్తుత మూడ్‌కి సరిపోయే సంగీతం.",
    gentleMed: "సున్నితమైన ధ్యానం",
    gentleMedDesc: "మీ మనస్సుకు మృదువైన మార్గదర్శకత్వం.",
    mindfulness: "మైండ్‌ఫుల్‌నెస్",
    mindfulnessDesc: "ప్రస్తుత క్షణంలో ఉండండి మరియు ప్రశాంతతను ఆస్వాదించండి.",
    focus: "త్వరిత ఫోకస్",
    focusDesc: "ఉత్పాదకత కోసం మీ మనస్సును పదును పెట్టండి.",
    liveInsight: "లైవ్ ఇన్సైట్",
    stayHydrated: "హైడ్రేటెడ్ గా ఉండండి",
    hydrationProgress: "మీరు ఈ రోజు {goal} గ్లాసులలో {current} తాగారు.",
    logSleep: "నిద్రను నమోదు చేయండి",
    sleepHelp: "నిద్రను ట్రాక్ చేయడం మంచి సిఫార్సులను అందించడంలో మాకు సహాయపడుతుంది.",
    deepRest: "గాఢమైన విశ్రాంతి",
    sleepRecover: "తక్కువ నిద్ర నుండి కోలుకోవడానికి మార్గదర్శక ధ్యానం.",
    goalProgress: "లక్ష్య పురోగతి",
    goalDesc: "ఈ రోజు మీ {category} లక్ష్యంపై పురోగతి సాధించండి.",
    mindfulBreak: "మైండ్‌ఫుల్ బ్రేక్",
    mindfulBreakDesc: "పూర్తి అవగాహన కోసం ఒక క్షణం విరామం తీసుకోండి.",
    mentorGreeting: "హాయ్ {name}! నేను మీ మూడ్ మెంటర్. 🌱",
    mentorNewUser: "నేను ఇంకా మీ వెల్నెస్ రొటీన్ గురించి తెలుసుకుంటున్నాను. మూడ్ చెక్-ఇన్‌తో ప్రారంభించండి మరియు నేను మీ సూచనలను వ్యక్తిగతీకరిస్తాను.",
    mentorGoodMorning: "శుభోదయం",
    mentorGoodAfternoon: "శుభ మధ్యాహ్నం",
    mentorGoodEvening: "శుభ సాయంత్రం",
    mentorStatus: "మీ తాజా చెక్-ఇన్ మీరు **{mood}** గా ఉన్నట్లు చూపిస్తుంది.",
    mentorActivityDone: "మీరు ఈ రోజు ఇప్పటికే **{count} వెల్నెస్ కార్యాచరణ** పూర్తి చేసారు.",
    mentorActivityNone: "మీరు ఈ రోజు ఇంకా మీ వెల్నెస్ రొటీన్ ప్రారంభించలేదు.",
    mentorHydrationDone: "ఈ రోజు హైడ్రేటెడ్ గా ఉన్నందుకు మంచి పని! 💧",
    mentorHydrationPending: "మీ హైడ్రేషన్ లక్ష్యం ఇంకా పురోగతిలో ఉంది ({current}/{goal} గ్లాసులు).",
    mentorStreak: "మీరు **{count}-రోజుల స్ట్రీక్** లో ఉన్నారు.",
    whyMood: "మీరు {mood} గా ఉన్నందున సిఫార్సు చేయబడింది.",
    whyHydration: "మీ హైడ్రేషన్ లక్ష్యం అసంపూర్తిగా ఉన్నందున సిఫార్సు చేయబడింది.",
    whyGoal: "మీకు క్రియాశీల లక్ష్యం ఉన్నందున సిఫార్సు చేయబడింది.",
    whySleep: "మీరు ఇటీవల తక్కువ నిద్రపోయినందున సిఫార్సు చేయబడింది.",
    whyHistory: "మీరు ఇటీవల దీనిని ప్రయత్నించనందున సిఫార్సు చేయబడింది.",
    whyDefault: "నేడు మీ ఆరోగ్యాన్ని మెరుగుపరుచుకోవడానికి దీన్ని ప్రయత్నించండి.",
    mindGym: "మైండ్ జిమ్",
    mindGymDesc: "తెలివిగా ఉండటానికి మెదడు వ్యాయామాలు."
  }
};

export const getLocalizedStrings = (lang: string = 'en') => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};

export const generateRecommendations = (userData: UserData): Recommendation[] => { const lang = userData.languagePreference || "en"; const t = getLocalizedStrings(lang);
  const latestMoodEntry = userData.moodHistory[0];
  
  
  
  const recommendations: Recommendation[] = [];
  const mood = latestMoodEntry?.mood || 'Neutral';
  const stress = latestMoodEntry?.stressLevel || 5;

  const recentActivityIds = userData.activities
    .filter(a => {
      if (!a.completedAt) return false;
      const completedAt = new Date(a.completedAt);
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      return completedAt > oneHourAgo;
    })
    .map(a => a.id);

  const addRec = (rec: Recommendation) => {
    if (recommendations.length >= 3) return; // Limit to 3 as requested/implied
    if (recentActivityIds.includes(rec.id)) return;
    if (recommendations.some(r => r.id === rec.id)) return;
    
    // Clone the recommendation to avoid mutating shared fallback objects
    const newRec = { ...rec };
    
    // Add dynamic joke preview for Smile Break
    if (newRec.id === 'smile-1') {
      const moodPool = JOKES.filter(j => j.language === lang && j.moodTags.some(m => mood.toLowerCase().includes(m.toLowerCase())));
      const pool = moodPool.length > 0 ? moodPool : JOKES.filter(j => j.language === lang);
      const randomJoke = pool[Math.floor(Math.random() * pool.length)];
      if (randomJoke) {
        newRec.description = `"${randomJoke.setup.substring(0, 45)}${randomJoke.setup.length > 45 ? '...' : ''}"`;
      }
    }
    
    // Improve 'why' for new users (if no mood history)
    if (!latestMoodEntry && newRec.why === t.whyHistory) {
      newRec.why = t.whyDefault || "Highly recommended for you today.";
    }
    
    recommendations.push(newRec);
  };

  // 1. Priority: Hydration Goal (if incomplete)
  const today = new Date().toDateString();
  const hydrationLog = userData.hydration.logs.find(l => new Date(l.timestamp).toDateString() === today);
  const currentWater = hydrationLog ? hydrationLog.amount : 0;
  const waterGoal = userData.hydration.dailyGoal;
  
  if (currentWater < waterGoal) {
    addRec({
      id: 'water-1',
      title: t.stayHydrated,
      description: t.hydrationProgress.replace('{current}', currentWater.toString()).replace('{goal}', waterGoal.toString()),
      icon: Droplets,
      path: '/wellness',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      actionLabel: t.start,
      category: 'Health',
      why: t.whyHydration
    });
  }

  // 2. Mood-Based Recommendations
  const moodTranslated = mood; // In a real app we'd translate the mood string too
  const whyMood = t.whyMood.replace('{mood}', moodTranslated);

  if (['Stressed', 'Anxious', 'Frustrated'].includes(mood) || stress > 7) {
    addRec({ id: 'breath-1', title: t.calmBreathing, description: t.calmBreathingDesc, icon: Wind, path: '/wellness', color: 'text-primary', bg: 'bg-primary/10', actionLabel: t.breathe, category: 'Breathing', why: whyMood });
    addRec({ id: 'music-calm', title: t.calmMusic, description: t.calmMusicDesc, icon: Music, path: '/music', color: 'text-secondary', bg: 'bg-secondary/10', actionLabel: t.play, category: 'Music', why: whyMood });
    addRec({ id: 'grounding-1', title: t.grounding, description: t.groundingDesc, icon: Target, path: '/wellness', color: 'text-accent', bg: 'bg-accent/10', actionLabel: t.start, category: 'Mindfulness', why: whyMood });
  } else if (['Happy', 'Great', 'Excited', 'Excellent'].includes(mood)) {
    addRec({ id: 'smile-1', title: t.smileBreak, description: t.smileBreakDesc, icon: Smile, path: '/smile-break', color: 'text-yellow-400', bg: 'bg-yellow-500/10', actionLabel: t.tryIt, category: 'Humor', why: whyMood });
    addRec({ id: 'mind-gym-1', title: t.mindGym, description: t.mindGymDesc, icon: Brain, path: '/mind-gym', color: 'text-accent', bg: 'bg-accent/10', actionLabel: t.start, category: 'Cognitive', why: whyMood });
    addRec({ id: 'energy-2', title: t.energyActivity, description: t.energyActivityDesc, icon: Zap, path: '/wellness', color: 'text-orange-400', bg: 'bg-orange-500/10', actionLabel: t.start, category: 'Movement', why: whyMood });
  } else if (['Sad', 'Low', 'Lonely'].includes(mood)) {
    addRec({ id: 'med-4', title: t.gentleMed, description: t.gentleMedDesc, icon: Brain, path: '/wellness', color: 'text-primary', bg: 'bg-primary/10', actionLabel: t.start, category: 'Meditation', why: whyMood });
    addRec({ id: 'smile-1', title: t.smileBreak, description: t.smileBreakDesc, icon: Smile, path: '/smile-break', color: 'text-yellow-400', bg: 'bg-yellow-500/10', actionLabel: t.tryIt, category: 'Humor', why: whyMood });
    addRec({ id: 'mind-gym-1', title: t.mindGym, description: t.mindGymDesc, icon: Brain, path: '/mind-gym', color: 'text-accent', bg: 'bg-accent/10', actionLabel: t.start, category: 'Cognitive', why: whyMood });
    addRec({ id: 'journal-1', title: t.quickJournal, description: t.quickJournalDesc, icon: BookOpen, path: '/journal', color: 'text-emerald-400', bg: 'bg-emerald-500/10', actionLabel: t.start, category: 'Journal', why: whyMood });
  }

  // 3. Sleep Context
  const lastSleep = userData.sleep.logs[0];
  if (lastSleep) {
    if (lastSleep.hours < 6) {
      addRec({
        id: 'sleep-1',
        title: t.deepRest,
        description: t.sleepRecover,
        icon: Moon,
        path: '/wellness',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
        actionLabel: t.start,
        category: 'Meditation',
        why: t.whySleep
      });
    }
  } else {
    addRec({
      id: 'sleep-log',
      title: t.logSleep,
      description: t.sleepHelp,
      icon: Moon,
      path: '/analytics',
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      actionLabel: t.start,
      category: 'Analytics',
      why: t.whyHistory
    });
  }

  // 4. Goal Progress
  const incompleteGoals = userData.goals.filter(g => !g.completed);
  if (incompleteGoals.length > 0) {
    const goal = incompleteGoals[0];
    addRec({
      id: `goal-${goal.id}`,
      title: goal.title,
      description: t.goalDesc.replace('{category}', goal.category),
      icon: Target,
      path: '/goals',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      actionLabel: t.start,
      category: 'Goals',
      why: t.whyGoal
    });
  }

  // 5. Time of Day Context
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) { // Morning
    addRec({ id: 'energy-1', title: t.morningEnergy, description: t.morningEnergyDesc, icon: Zap, path: '/wellness', color: 'text-orange-400', bg: 'bg-orange-500/10', actionLabel: t.start, category: 'Energy', why: t.whyMorning });
  } else if (hour >= 20 || hour < 5) { // Night
    addRec({ id: 'med-2', title: t.sleepMed, description: t.sleepMedDesc, icon: Moon, path: '/wellness', color: 'text-indigo-400', bg: 'bg-indigo-500/10', actionLabel: t.start, category: 'Sleep', why: t.whyNight });
  }

  // Fallbacks
  const fallbacks = [
    { id: 'med-1', title: t.mindfulness, description: t.mindfulnessDesc, icon: Layout, path: '/wellness', color: 'text-primary', bg: 'bg-primary/10', actionLabel: t.start, category: 'Mindfulness', why: t.whyHistory },
    { id: 'focus-1', title: t.focus, description: t.focusDesc, icon: Target, path: '/wellness', color: 'text-accent', bg: 'bg-accent/10', actionLabel: t.start, category: 'Mindfulness', why: t.whyHistory },
    { id: 'smile-1', title: t.smileBreak, description: t.smileBreakDesc, icon: Smile, path: '/smile-break', color: 'text-yellow-400', bg: 'bg-yellow-500/10', actionLabel: t.tryIt, category: 'Humor', why: t.whyHistory },
    { id: 'mind-gym-1', title: t.mindGym, description: t.mindGymDesc, icon: Brain, path: '/mind-gym', color: 'text-accent', bg: 'bg-accent/10', actionLabel: t.start, category: 'Cognitive', why: t.whyHistory }
  ];

  for (const f of fallbacks) {
    if (recommendations.length >= 3) break;
    addRec(f);
  }

  return recommendations;
};

export const getMentorSummary = (userData: UserData): string => {
  const lang = userData.languagePreference || "en";
  const t = getLocalizedStrings(lang);
  
  const rawName = userData?.profile?.name || '';
  const name = rawName.trim().split(' ')[0] || rawName.trim() || 'there';
  const latestMoodEntry = userData?.moodHistory && userData.moodHistory.length > 0 ? userData.moodHistory[0] : null;
  const hour = new Date().getHours();
  
  let greeting = t.mentorGoodMorning || "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = t.mentorGoodAfternoon || "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    greeting = t.mentorGoodEvening || "Good evening";
  } else if (hour >= 21 || hour < 5) {
    greeting = lang === 'te' ? "శుభరాత్రి" : "Good night";
  }

  const today = new Date().toDateString();
  const completedToday = (userData?.activities || []).filter(a => a.completed && a.completedAt && new Date(a.completedAt).toDateString() === today).length;
  
  const hydrationLog = (userData?.hydration?.logs || []).find(l => new Date(l.timestamp).toDateString() === today);
  const currentWater = hydrationLog ? hydrationLog.amount : 0;
  const waterGoal = userData?.hydration?.dailyGoal || 8;
  const streak = userData?.profile?.currentStreak || 0;

  if (!latestMoodEntry) {
    let summary = `${greeting}, ${name} 👋\n\n`;
    summary += `I'm still getting to know your wellness routine. Start with a mood check-in and I'll personalize your suggestions. `;
    
    if (completedToday > 0) {
      summary += `You've already completed ${completedToday} wellness ${completedToday === 1 ? 'activity' : 'activities'} today. `;
    } else {
      summary += `You haven't started your wellness routine yet today. `;
    }

    if (currentWater < waterGoal) {
      summary += `Your hydration goal is still in progress (${currentWater}/${waterGoal} glasses). `;
    } else if (waterGoal > 0) {
      summary += `Nice job staying hydrated today! 💧 `;
    }

    if (streak > 0) {
      summary += `You're on a ${streak}-day streak.`;
    }

    return summary.trim();
  }

  const mood = latestMoodEntry.mood;
  let summary = `${greeting}, ${name} 👋\n\n`;
  summary += `Your latest check-in shows you're feeling ${mood.toLowerCase()}. `;

  if (completedToday > 0) {
    summary += `You've already completed ${completedToday} wellness ${completedToday === 1 ? 'activity' : 'activities'} today. `;
  } else {
    summary += `You haven't started your wellness routine yet today. `;
  }

  if (currentWater < waterGoal) {
    summary += `Your hydration goal is still in progress (${currentWater}/${waterGoal} glasses). `;
  } else if (waterGoal > 0) {
    summary += `Nice job staying hydrated today! 💧 `;
  }

  if (streak > 0) {
    summary += `You're on a ${streak}-day streak.`;
  }

  return summary.trim();
};

export const getChatResponse = (input: string, userData: UserData): { content: string, action?: Recommendation } => { 
  const text = input.toLowerCase().trim();
  
  const rawName = userData?.profile?.name || '';
  const name = rawName.trim().split(' ')[0] || rawName.trim() || 'there';
  const latestMood = userData?.moodHistory && userData.moodHistory.length > 0 ? userData.moodHistory[0] : null;
  const mood = latestMood?.mood || 'Neutral';
  const stress = latestMood?.stressLevel || 5;
  const sleepLogs = userData?.sleep?.logs || [];
  const sleep = sleepLogs.length > 0 ? sleepLogs[0].hours : 8;
  const today = new Date().toDateString();
  const currentWater = (userData?.hydration?.logs || []).find(l => new Date(l.timestamp).toDateString() === today)?.amount || 0;
  const waterGoal = userData?.hydration?.dailyGoal || 8;
  const streak = userData?.profile?.currentStreak || 0;
  const level = userData?.profile?.level || 1;
  const xp = userData?.profile?.xp || 0;
  const completedToday = (userData?.activities || []).filter(a => a.completed && a.completedAt && new Date(a.completedAt).toDateString() === today).length;
  const recommendations = generateRecommendations(userData);

  // Personalized Greeting / Help
  if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('help') || text === 'good morning' || text === 'good afternoon' || text === 'good evening' || text === 'good night') {
    let response = `Hello ${name}! I'm right here with you. `;
    
    if (streak > 1) {
      response += `You're holding strong on an active ${streak}-day wellness streak! 🔥 `;
    }

    if (latestMood) {
      response += `In your latest check-in, you reported feeling ${mood.toLowerCase()}. `;
      if (stress >= 7) {
        response += `I also noted your stress level was somewhat elevated (${stress}/10). `;
      }
    } else {
      response += `You haven't logged a mood check-in yet today. `;
    }

    response += "\n\nHow can I support you right now? We can explore guided breathing, check your goals, play a cognitive challenge in Mind Gym, or reflect together.";
    
    return { 
      content: response,
      action: recommendations[0]
    };
  }

  // Summary / Status / Overview
  if (text.includes('summary') || text.includes('status') || text.includes('how am i') || text.includes('overview') || text.includes('report') || text.includes('today')) {
    let summaryText = `Here is your current wellness snapshot, ${name}:\n\n`;
    if (latestMood) {
      summaryText += `• Mood: You are feeling **${mood}** (Stress: ${stress}/10).\n`;
    } else {
      summaryText += `• Mood: No check-in logged yet today.\n`;
    }
    summaryText += `• Activities: ${completedToday} completed today.\n`;
    summaryText += `• Hydration: ${currentWater}/${waterGoal} glasses consumed.\n`;
    summaryText += `• Streak & Level: ${streak} day streak • Level ${level} (${xp} XP).\n\n`;
    summaryText += `Keep taking intentional steps towards your wellbeing!`;

    return {
      content: summaryText,
      action: recommendations[0]
    };
  }

  // Stress, Anxiety & Calming
  if (text.includes('stress') || text.includes('anxious') || text.includes('anxiety') || text.includes('calm') || text.includes('breathe') || text.includes('panic') || text.includes('overwhelm') || text.includes('relax')) {
    let content = "I hear you, and it is completely okay to feel this way. ";
    if (stress > 6) {
      content += `With your reported stress level at ${stress}/10, pausing for just a few minutes can significantly regulate your autonomic nervous system. `;
    } else {
      content += "Taking a deliberate moment to center yourself can restore mental balance. ";
    }

    if (sleep < 6) {
      content += `Since you logged ${sleep} hours of sleep recently, your emotional resilience might be lower than usual today. `;
    }

    const breathing = recommendations.find(r => r.category === 'Breathing' || r.id === 'breath-1') || recommendations[0];
    return { 
      content: content + "\n\nI recommend starting with a slow, diaphragmatic breathing exercise:",
      action: breathing
    };
  }

  // Energy, Fatigue & Sleep
  if (text.includes('tired') || text.includes('exhausted') || text.includes('energy') || text.includes('sleep') || text.includes('fatigue') || text.includes('rest') || text.includes('burnout')) {
    let content = "";
    if (sleep < 7) {
      content = `You logged ${sleep} hours of sleep recently. When sleep is short, physical and cognitive fatigue naturally sets in. `;
    } else if (currentWater < Math.floor(waterGoal / 2)) {
      content = `You're currently at ${currentWater}/${waterGoal} glasses of water today. Even mild dehydration can drain your stamina and focus. `;
    } else {
      content = "Energy naturally ebbs and flows throughout the day. Listening to what your body needs is essential. ";
    }

    const rec = recommendations.find(r => r.category === 'Meditation' || r.category === 'Energy' || r.category === 'Sleep') || recommendations[0];
    return { 
      content: content + "\n\nHere is a restorative practice tailored to help recharge your mind and body:",
      action: rec
    };
  }

  // Hydration inquiries
  if (text.includes('water') || text.includes('drink') || text.includes('hydrat')) {
    let content = `You've logged ${currentWater} of your ${waterGoal} glasses goal today. `;
    if (currentWater >= waterGoal) {
      content += "Fantastic job! You've already reached your daily hydration goal. Staying consistently hydrated aids focus, skin health, and energy levels. 💧";
    } else {
      const remaining = waterGoal - currentWater;
      content += `You have ${remaining} more ${remaining === 1 ? 'glass' : 'glasses'} to hit your target. Try keeping a full glass or water bottle within arm's reach!`;
    }
    return {
      content,
      action: {
        id: 'water-nav',
        title: "Wellness Hub (Hydration)",
        description: "Log your water intake.",
        icon: recommendations[0].icon,
        path: '/wellness',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        actionLabel: 'Log Water'
      }
    };
  }

  // Mind Gym / Cognitive training
  if (text.includes('mind gym') || text.includes('brain') || text.includes('focus') || text.includes('memory') || text.includes('exercise') || text.includes('puzzle') || text.includes('game')) {
    const mindStats = userData?.mindGymStats;
    const gamesCompleted = mindStats?.gamesCompleted || 0;
    const accuracy = mindStats?.focusAccuracy || 0;
    let content = `Your Mind Gym training is coming along well! You've finished ${gamesCompleted} cognitive exercise sessions with an overall accuracy of ${accuracy > 0 ? `${accuracy}%` : 'N/A'}.\n\n`;
    content += "Neuroplasticity thrives on short, consistent daily workouts like Focus Tap, Memory Match, and Pattern sequences.";

    return {
      content,
      action: {
        id: 'mind-gym-nav',
        title: "Mind Gym Exercises",
        description: "Play cognitive resilience workouts.",
        icon: recommendations.find(r => r.id === 'mind-gym-1')?.icon || recommendations[0].icon,
        path: '/mind-gym',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        actionLabel: 'Enter Mind Gym'
      }
    };
  }

  // Humor / Smile Break
  if (text.includes('joke') || text.includes('laugh') || text.includes('smile') || text.includes('funny') || text.includes('humor')) {
    return {
      content: "Laughter triggers the release of endorphins and reduces cortisol levels! Let's take a quick Smile Break to brighten up your mood.",
      action: {
        id: 'smile-break-nav',
        title: "Smile Break",
        description: "Enjoy mindful humor and witty jokes.",
        icon: recommendations.find(r => r.id === 'smile-1')?.icon || recommendations[0].icon,
        path: '/smile-break',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        actionLabel: 'Take Smile Break'
      }
    };
  }

  // Music / Ambient
  if (text.includes('music') || text.includes('song') || text.includes('ambient') || text.includes('sound') || text.includes('tune') || text.includes('audio')) {
    return {
      content: "Soundscapes and ambient music can shift brainwave states into calm alpha/theta frequencies, helping you focus or unwind.",
      action: {
        id: 'music-nav',
        title: "Calm Music & Soundscapes",
        description: "Listen to tracks suited to your mood.",
        icon: recommendations.find(r => r.category === 'Music')?.icon || recommendations[0].icon,
        path: '/music',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        actionLabel: 'Open Music Player'
      }
    };
  }

  // Journaling & Reflection
  if (text.includes('journal') || text.includes('write') || text.includes('diary') || text.includes('reflect') || text.includes('thought')) {
    const entriesCount = (userData?.journal || []).length;
    return {
      content: `Writing out your thoughts externalizes emotional weight and helps identify triggers. You currently have ${entriesCount} journal entries recorded.`,
      action: {
        id: 'journal-nav',
        title: "Personal Journal",
        description: "Express and organize your thoughts.",
        icon: recommendations.find(r => r.id === 'journal-1')?.icon || recommendations[0].icon,
        path: '/journal',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        actionLabel: 'Write Entry'
      }
    };
  }

  // Achievement & Progress
  if (text.includes('progress') || text.includes('achievement') || text.includes('xp') || text.includes('level') || text.includes('rarity') || text.includes('rank')) {
    const unlocked = (userData?.achievements || []).filter(a => !!a.unlockedAt).length;
    const rarity = getUserRarity(xp);
    const content = `You are doing inspiring work, ${name}! You are currently Level ${level} with a ${rarity} rank (${xp} XP). You've unlocked ${unlocked} achievements so far, and your ${streak}-day streak reflects consistent discipline.`;
    
    return { 
      content,
      action: {
        id: 'ach-nav',
        title: "View Achievements",
        description: "Check your hall of wellness achievements.",
        icon: recommendations[0].icon,
        path: '/achievements',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        actionLabel: 'View Hall'
      }
    };
  }

  // Goal Specifics
  if (text.includes('goal') || text.includes('target') || text.includes('habit')) {
    const incomplete = (userData?.goals || []).filter(g => !g.completed);
    if (incomplete.length > 0) {
      const g = incomplete[0];
      const percent = Math.min(100, Math.round((g.currentValue / Math.max(1, g.targetValue)) * 100));
      return {
        content: `You're currently ${percent}% of the way through your goal: "${g.title}" (${g.currentValue}/${g.targetValue} ${g.unit || 'units'}). Consistent small actions create lasting transformation!`,
        action: recommendations.find(r => r.id.includes('goal')) || {
          id: 'goal-nav',
          title: "Goal Tracker",
          description: "Manage and complete your daily goals.",
          icon: recommendations[0].icon,
          path: '/goals',
          color: 'text-rose-400',
          bg: 'bg-rose-500/10',
          actionLabel: 'View Goals'
        }
      };
    }
    return { 
      content: "You've successfully completed all your active goals! Setting new gradual milestones keeps your momentum going.",
      action: {
        id: 'goal-nav-new',
        title: "Create New Goal",
        description: "Set your next milestone.",
        icon: recommendations[0].icon,
        path: '/goals',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        actionLabel: 'Set Goal'
      }
    };
  }

  // Mood Trends & History
  if (text.includes('mood') || text.includes('feeling') || text.includes('history') || text.includes('emotion')) {
    const history = userData?.moodHistory || [];
    if (history.length === 0) {
      return {
        content: `You haven't logged any mood entries yet, ${name}. Completing a daily check-in takes only 30 seconds and unlocks rich personalized insights.`,
        action: {
          id: 'checkin-nav',
          title: "Mood Check-In",
          description: "Log your current emotional state.",
          icon: recommendations[0].icon,
          path: '/mood-checkin',
          color: 'text-primary',
          bg: 'bg-primary/10',
          actionLabel: 'Check In Now'
        }
      };
    }

    const moodCounts: Record<string, number> = {};
    history.slice(0, 7).forEach(m => {
      moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
    });
    
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
    let content = "Looking at your recent check-ins, ";
    if (topMood) {
      content += `you have most frequently felt **${topMood[0]}** (${topMood[1]} times in recent logs). `;
    }
    content += "Reviewing these emotional patterns helps discover daily habits that enhance your mood.";
    
    return { 
      content,
      action: {
        id: 'mood-nav',
        title: "Mood History & Trends",
        description: "Explore your emotional graph.",
        icon: recommendations[0].icon,
        path: '/mood-history',
        color: 'text-primary',
        bg: 'bg-primary/10',
        actionLabel: 'View Trends'
      }
    };
  }

  // Default / Catch-all empathetic guidance
  return { 
    content: `I'm here to support your journey, ${name}. Based on your profile (Level ${level}, ${streak}-day streak), aligning with your current ${mood.toLowerCase()} mood is a great place to start. Here is a recommended activity for you right now:`,
    action: recommendations[0]
  };
};
