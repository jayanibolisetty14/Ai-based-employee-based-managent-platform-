import { WellnessActivity } from '../types';

export const WELLNESS_CATALOG: WellnessActivity[] = [
  // --- Meditation ---
  {
    id: 'med-1',
    title: 'Mindful Breathing',
    description: 'Sit comfortably and anchor your attention to the natural flow of your breath.',
    duration: 5,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🧘',
    benefits: ['Deep relaxation', 'Enhanced focus', 'Nervous system regulation'],
    steps: [
      { title: 'Posture', desc: 'Find a comfortable seated upright posture with hands resting gently.' },
      { title: 'Anchor', desc: 'Bring your full awareness to the sensation of air entering and leaving.' },
      { title: 'Observe', desc: 'When your mind wanders, gently guide it back without judgment.' },
      { title: 'Integrate', desc: 'Notice the calm stillness before opening your eyes.' }
    ],
    safetyNote: 'Maintain an upright but relaxed posture to prevent tension.'
  },
  {
    id: 'med-2',
    title: 'Body Scan Meditation',
    description: 'Systematically release physical tension from head to toe through mindful awareness.',
    duration: 10,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '👤',
    benefits: ['Physical tension release', 'Body awareness', 'Better sleep quality'],
    steps: [
      { title: 'Lie Down', desc: 'Lie flat on your back in a comfortable, quiet space.' },
      { title: 'Crown to Toes', desc: 'Bring awareness to the top of your head, slowly moving down through your face and neck.' },
      { title: 'Release', desc: 'Notice any tightness in shoulders or chest and exhale it away.' },
      { title: 'Complete', desc: 'Feel your entire body heavy and completely relaxed.' }
    ],
    safetyNote: 'Ensure you are warm and comfortable.'
  },
  {
    id: 'med-3',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion and warmth toward yourself and others.',
    duration: 7,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '💜',
    benefits: ['Emotional warmth', 'Empathy', 'Inner peace'],
    steps: [
      { title: 'Self-Love', desc: 'Repeat mentally: May I be happy, may I be healthy, may I live with ease.' },
      { title: 'Loved Ones', desc: 'Extend these wishes to someone you cherish deeply.' },
      { title: 'All Beings', desc: 'Gradually expand the circle of compassion to all living beings.' }
    ]
  },
  {
    id: 'med-4',
    title: 'Guided Calm Meditation',
    description: 'A soothing journey into inner tranquility and mental quietude.',
    duration: 5,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🌊',
    benefits: ['Mental clarity', 'Stress reduction', 'Emotional balance'],
    steps: [
      { title: 'Settle In', desc: 'Close your eyes and take three deep breaths.' },
      { title: 'Visualize', desc: 'Imagine a serene mountain lake reflecting the clear sky.' },
      { title: 'Let Go', desc: 'Let passing thoughts ripple across the surface without disturbing the depth.' }
    ]
  },
  {
    id: 'med-5',
    title: 'Morning Meditation',
    description: 'Start your day with positive intention and grounded energy.',
    duration: 5,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '☀️',
    benefits: ['Positive mindset', 'Clear daily intention', 'Energized focus'],
    steps: [
      { title: 'Wakeful Awareness', desc: 'Sit upright and embrace the freshness of a new day.' },
      { title: 'Set Intention', desc: 'Choose one word or quality to anchor your day.' },
      { title: 'Breathe In Energy', desc: 'Inhale clarity, exhale sleepiness.' }
    ]
  },
  {
    id: 'med-6',
    title: 'Sleep Meditation',
    description: 'Drift into restorative slumber with gentle relaxation cues.',
    duration: 10,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🌙',
    benefits: ['Faster sleep onset', 'Deep relaxation', 'Calming restless thoughts'],
    steps: [
      { title: 'Bedtime Posture', desc: 'Lie comfortably in bed under warm covers.' },
      { title: 'Progressive Release', desc: 'Soften your jaw, shoulders, arms, and legs.' },
      { title: 'Surrender', desc: 'Release the day completely into the quiet night.' }
    ]
  },
  {
    id: 'med-7',
    title: 'Stress Relief Meditation',
    description: 'Dissolve acute mental pressure and acute tension.',
    duration: 6,
    category: 'Stress Relief',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🍃',
    benefits: ['Cortisol reduction', 'Mental ease', 'Nervous system reset'],
    steps: [
      { title: 'Pause', desc: 'Stop what you are doing and take a grounded seat.' },
      { title: 'Exhale Long', desc: 'Make exhales twice as long as inhales.' },
      { title: 'Let Go', desc: 'Visualize tension melting off your shoulders like warm water.' }
    ]
  },
  {
    id: 'med-8',
    title: 'Focus Meditation',
    description: 'Sharpen concentration by anchoring on a single steady point.',
    duration: 5,
    category: 'Focus',
    difficulty: 'Intermediate',
    xpReward: 20,
    icon: '🎯',
    benefits: ['Improved attention span', 'Reduced distractibility', 'Mental sharpness'],
    steps: [
      { title: 'Single Point', desc: 'Focus entirely on the tip of your nose or breath anchor.' },
      { title: 'Hold Steady', desc: 'Maintain unbroken attention without forcing.' },
      { title: 'Return Gently', desc: 'Whenever distracted, return immediately with kindness.' }
    ]
  },
  {
    id: 'med-9',
    title: 'Gratitude Meditation',
    description: 'Open your heart through deep appreciation for life’s gifts.',
    duration: 5,
    category: 'Meditation',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '✨',
    benefits: ['Increased joy', 'Emotional resilience', 'Abundance mindset'],
    steps: [
      { title: 'Reflect', desc: 'Think of three simple things you are grateful for today.' },
      { title: 'Feel It', desc: 'Allow the feeling of appreciation to warm your chest.' },
      { title: 'Send Thanks', desc: 'Quietly express gratitude for your breath and body.' }
    ]
  },
  {
    id: 'med-10',
    title: '5-Minute Quiet Meditation',
    description: 'Pure silent stillness to reset your mind anytime.',
    duration: 5,
    category: 'Meditation',
    difficulty: 'Intermediate',
    xpReward: 20,
    icon: '🕊️',
    benefits: ['Deep quietude', 'Mental clarity', 'Inner sanctuary'],
    steps: [
      { title: 'Silence', desc: 'Sit in comfortable silence with zero distractions.' },
      { title: 'Rest', desc: 'Allow awareness to rest without any specific object.' }
    ]
  },

  // --- Breathing Exercises ---
  {
    id: 'breath-1',
    title: 'Box Breathing',
    description: 'Regulate your nervous system with a balanced 4-4-4-4 rhythm used by Navy SEALs.',
    duration: 3,
    category: 'Breathing',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🫁',
    benefits: ['Stress reduction', 'Calm alertness', 'Emotional control'],
    steps: [
      { title: 'Inhale', desc: 'Breathe in slowly through your nose for 4 seconds.' },
      { title: 'Hold', desc: 'Hold your breath gently for 4 seconds.' },
      { title: 'Exhale', desc: 'Release air smoothly through your mouth for 4 seconds.' },
      { title: 'Hold Empty', desc: 'Hold with empty lungs for 4 seconds.' }
    ],
    safetyNote: 'Stop if you feel lightheaded.'
  },
  {
    id: 'breath-2',
    title: '4-7-8 Breathing',
    description: 'Natural tranquilizer for the nervous system to promote deep calm and sleep.',
    duration: 4,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🌙',
    benefits: ['Anxiety relief', 'Deep sleep preparation', 'Heart rate soothing'],
    steps: [
      { title: 'Inhale 4s', desc: 'Quietly inhale through the nose for 4 seconds.' },
      { title: 'Hold 7s', desc: 'Retain the breath comfortably for 7 seconds.' },
      { title: 'Exhale 8s', desc: 'Make a gentle whoosh sound exhaling for 8 seconds.' }
    ]
  },
  {
    id: 'breath-3',
    title: 'Calm Breathing',
    description: 'Gentle rhythmic breathing to instantly lower heart rate.',
    duration: 3,
    category: 'Breathing',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🍃',
    benefits: ['Immediate soothing', 'Relaxed shoulders', 'Mental ease'],
    steps: [
      { title: 'Soft Inhale', desc: 'Breathe in smoothly through the nose.' },
      { title: 'Long Exhale', desc: 'Let go completely with a relaxed sigh.' }
    ]
  },
  {
    id: 'breath-4',
    title: 'Equal Breathing (Sama Vritti)',
    description: 'Equalizing inhales and exhales to bring equilibrium and focus.',
    duration: 3,
    category: 'Breathing',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '⚖️',
    benefits: ['Mental balance', 'Calm focus', 'Centered awareness'],
    steps: [
      { title: 'Inhale 4s', desc: 'Inhale deeply for 4 steady seconds.' },
      { title: 'Exhale 4s', desc: 'Exhale evenly for 4 steady seconds.' }
    ]
  },
  {
    id: 'breath-5',
    title: 'Deep Belly Breathing',
    description: 'Diaphragmatic breathing to activate the vagus nerve and release tension.',
    duration: 5,
    category: 'Breathing',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🌊',
    benefits: ['Vagus nerve stimulation', 'Lowered blood pressure', 'Deep relaxation'],
    steps: [
      { title: 'Hand on Belly', desc: 'Place one hand on your belly and one on your chest.' },
      { title: 'Expand Belly', desc: 'Breathe in so your belly rises while your chest stays still.' },
      { title: 'Slow Release', desc: 'Gently contract your abdomen to push air out.' }
    ]
  },
  {
    id: 'breath-6',
    title: 'Coherent Breathing',
    description: 'Breathing at a rate of 5 breaths per minute for heart-brain synchrony.',
    duration: 5,
    category: 'Breathing',
    difficulty: 'Intermediate',
    xpReward: 15,
    icon: '💫',
    benefits: ['Heart rate variability optimization', 'Emotional stability'],
    steps: [
      { title: '5s Inhale', desc: 'Inhale smoothly for 5 seconds.' },
      { title: '5s Exhale', desc: 'Exhale smoothly for 5 seconds without pausing.' }
    ]
  },
  {
    id: 'breath-7',
    title: 'Energizing Breath',
    description: 'Quick rhythmic breaths to wake up body and mind.',
    duration: 2,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '⚡',
    benefits: ['Alertness boost', 'Cleared brain fog', 'Renewed vitality'],
    steps: [
      { title: 'Quick In', desc: 'Take brisk, energizing inhales through the nose.' },
      { title: 'Active Out', desc: 'Exhale actively to awaken your energy centers.' }
    ]
  },

  // --- Yoga & Stretching ---
  {
    id: 'yoga-1',
    title: 'Mountain Pose (Tadasana)',
    description: 'The foundation of all standing poses for posture and grounding.',
    duration: 2,
    category: 'Yoga',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🏔️',
    benefits: ['Improved posture', 'Body awareness', 'Grounded stability'],
    steps: [
      { title: 'Stand Tall', desc: 'Stand with feet together or hip-width apart, arms by your sides.' },
      { title: 'Engage', desc: 'Lift through your kneecaps, lengthen your spine, and relax shoulders.' },
      { title: 'Breathe', desc: 'Breathe steadily while feeling anchored to the floor.' }
    ],
    safetyNote: 'Keep knees soft and avoid locking joints.'
  },
  {
    id: 'yoga-2',
    title: "Child's Pose (Balasana)",
    description: 'A deeply restorative resting posture to release lower back and shoulder tension.',
    duration: 3,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🧘',
    benefits: ['Back relief', 'Mental rest', 'Hip opening'],
    steps: [
      { title: 'Kneel', desc: 'Kneel on the mat with big toes touching and knees wide.' },
      { title: 'Fold', desc: 'Sit back onto your heels and extend your arms forward on the floor.' },
      { title: 'Rest Forehead', desc: 'Rest your forehead gently on the mat and breathe into your back.' }
    ],
    safetyNote: 'Place a blanket under knees or hips if sensitive.'
  },
  {
    id: 'yoga-3',
    title: 'Cat-Cow Stretch',
    description: 'Gentle spinal flow to improve flexibility and release back stiffness.',
    duration: 3,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🐈',
    benefits: ['Spine mobility', 'Neck relief', 'Core engagement'],
    steps: [
      { title: 'Tabletop', desc: 'Start on hands and knees with wrists under shoulders.' },
      { title: 'Cow', desc: 'Inhale as you drop your belly and look up gently.' },
      { title: 'Cat', desc: 'Exhale as you round your spine toward the ceiling and tuck chin.' }
    ]
  },
  {
    id: 'yoga-4',
    title: 'Seated Forward Fold',
    description: 'Calming stretch for hamstrings and lower back.',
    duration: 3,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🧘',
    benefits: ['Hamstring flexibility', 'Calming nervous system', 'Lower back release'],
    steps: [
      { title: 'Sit Tall', desc: 'Extend legs straight in front of you with flexed feet.' },
      { title: 'Hinge', desc: 'Inhale arms up, then hinge from hips folding forward.' },
      { title: 'Relax Neck', desc: 'Hold shins or feet while letting your head relax down.' }
    ]
  },
  {
    id: 'yoga-5',
    title: 'Neck Stretch',
    description: 'Relieve tight neck muscles from desk work and phone posture.',
    duration: 2,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '💆',
    benefits: ['Neck tension relief', 'Jaw relaxation', 'Headache prevention'],
    steps: [
      { title: 'Tilt Head', desc: 'Gently drop your right ear toward your right shoulder.' },
      { title: 'Hold & Breathe', desc: 'Breathe into the left side of your neck for 30 seconds.' },
      { title: 'Switch Sides', desc: 'Repeat gently on the left.' }
    ],
    safetyNote: 'Never force the stretch; keep movements slow.'
  },
  {
    id: 'yoga-6',
    title: 'Shoulder Rolls',
    description: 'Release accumulated shoulder and upper back tightness.',
    duration: 2,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '🔄',
    benefits: ['Shoulder mobility', 'Upper back ease', 'Posture reset'],
    steps: [
      { title: 'Roll Backward', desc: 'Slowly roll your shoulders up toward your ears and back down in circles.' },
      { title: 'Reverse', desc: 'Repeat in the forward direction.' }
    ]
  },
  {
    id: 'yoga-7',
    title: 'Standing Side Stretch',
    description: 'Open your side body and ribs for deeper breath capacity.',
    duration: 2,
    category: 'Stretching',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '🧍',
    benefits: ['Ribcage opening', 'Side body flexibility', 'Deepened breath'],
    steps: [
      { title: 'Reach Up', desc: 'Inhale and reach your right arm up toward the ceiling.' },
      { title: 'Arc Over', desc: 'Exhale and gently bend to your left side.' },
      { title: 'Switch', desc: 'Repeat on the opposite side.' }
    ]
  },
  {
    id: 'yoga-8',
    title: 'Butterfly Pose',
    description: 'Gentle hip opener and soothing posture for inner calm.',
    duration: 3,
    category: 'Yoga',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🦋',
    benefits: ['Hip flexibility', 'Inner thigh stretch', 'Calming effect'],
    steps: [
      { title: 'Soles Together', desc: 'Sit tall and bring the soles of your feet together.' },
      { title: 'Hold Feet', desc: 'Hold ankles or feet gently, letting knees open outward.' },
      { title: 'Fold Forward', desc: 'Optionally fold forward with a flat back.' }
    ]
  },
  {
    id: 'yoga-9',
    title: 'Easy Seated Pose (Sukhasana)',
    description: 'Comfortable cross-legged seat for centering and meditation.',
    duration: 3,
    category: 'Yoga',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🧘',
    benefits: ['Spine alignment', 'Calm centering', 'Grounding'],
    steps: [
      { title: 'Cross Legs', desc: 'Sit cross-legged on a cushion with tall spine.' },
      { title: 'Rest Hands', desc: 'Rest palms facing up or down on knees.' }
    ]
  },
  {
    id: 'yoga-10',
    title: 'Legs-Up-the-Wall Pose',
    description: 'Ultimate restorative inversion for tired legs and nervous system reset.',
    duration: 5,
    category: 'Relaxation',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🧱',
    benefits: ['Circulation boost', 'Leg fatigue relief', 'Deep relaxation'],
    steps: [
      { title: 'Lie Near Wall', desc: 'Lie on your back with your hips close to a wall.' },
      { title: 'Extend Legs', desc: 'Extend your legs vertically up against the wall.' },
      { title: 'Rest & Breathe', desc: 'Close your eyes and breathe deeply for 5 minutes.' }
    ],
    safetyNote: 'Avoid if you have certain eye or blood pressure conditions.'
  },

  // --- Focus & Mental Wellness ---
  {
    id: 'focus-1',
    title: 'One-Minute Focus',
    description: 'Laser-sharp mental reset in just 60 seconds.',
    duration: 1,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '⏱️',
    benefits: ['Instant alertness', 'Mental clutter clearing', 'Quick reset'],
    steps: [
      { title: 'Zero Distractions', desc: 'Close all tabs and focus on a single dot or breath.' },
      { title: 'Hold Attention', desc: 'Keep your mind entirely locked on the anchor for 60 seconds.' }
    ]
  },
  {
    id: 'focus-2',
    title: 'Breath Counting',
    description: 'Count breaths from 1 to 10 to train concentration.',
    duration: 3,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🔢',
    benefits: ['Attention training', 'Mind wandering awareness', 'Calm focus'],
    steps: [
      { title: 'Count 1 to 10', desc: 'Count "1" on inhale, "2" on exhale, up to 10.' },
      { title: 'Restart', desc: 'If your mind wanders or exceeds 10, gently restart at 1.' }
    ]
  },
  {
    id: 'focus-3',
    title: 'Mindful Observation',
    description: 'Pick an object nearby and observe every detail mindfully.',
    duration: 3,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '👁️',
    benefits: ['Present moment grounding', 'Heightened observation', 'Curiosity'],
    steps: [
      { title: 'Choose Object', desc: 'Select a pen, plant, or cup.' },
      { title: 'Examine Details', desc: 'Notice colors, textures, shadows, and contours without labeling.' }
    ]
  },
  {
    id: 'focus-4',
    title: '5-4-3-2-1 Grounding',
    description: 'Sensory grounding exercise for anxiety and hyper-focus.',
    duration: 4,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🌳',
    benefits: ['Anxiety grounding', 'Sensory awareness', 'Mental stability'],
    steps: [
      { title: '5 Things', desc: 'Acknowledge 5 things you can see.' },
      { title: '4 Things', desc: 'Acknowledge 4 things you can touch.' },
      { title: '3 Things', desc: 'Acknowledge 3 things you can hear.' },
      { title: '2 Things', desc: 'Acknowledge 2 things you can smell.' },
      { title: '1 Thing', desc: 'Acknowledge 1 thing you can taste.' }
    ]
  },
  {
    id: 'focus-5',
    title: 'Visual Focus Grid',
    description: 'Train spatial and visual attention stability.',
    duration: 2,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '👁️',
    benefits: ['Visual attention', 'Eye muscle relaxation', 'Brain sharpness'],
    steps: [
      { title: 'Fix Gaze', desc: 'Fix your gaze on the center point.' },
      { title: 'Peripheral Awareness', desc: 'Expand awareness to the edges without moving eyes.' }
    ]
  },
  {
    id: 'focus-6',
    title: 'Gratitude Reflection',
    description: 'Quick mental check-in on positive life anchors.',
    duration: 2,
    category: 'Gratitude',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '📔',
    benefits: ['Mood uplift', 'Positive reinforcement', 'Mental clarity'],
    steps: [
      { title: 'Recall', desc: 'Recall one wonderful moment from the past 24 hours.' },
      { title: 'Savory', desc: 'Savor the feeling for 60 seconds.' }
    ]
  },
  {
    id: 'focus-7',
    title: 'Positive Affirmation',
    description: 'Reinforce mental resilience with supportive internal statements.',
    duration: 2,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '💬',
    benefits: ['Self-confidence', 'Resilience', 'Calm reassurance'],
    steps: [
      { title: 'Repeat', desc: 'Silently repeat: "I am calm, capable, and centered."' },
      { title: 'Internalize', desc: 'Feel the truth of the statement in your body.' }
    ]
  },
  {
    id: 'focus-8',
    title: 'Digital Detox Timer',
    description: 'Unplug and rest your eyes and mind from screens.',
    duration: 5,
    category: 'Focus',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '📵',
    benefits: ['Eye strain relief', 'Mental rest', 'Unplugged peace'],
    steps: [
      { title: 'Step Away', desc: 'Look away from all screens and close your eyes.' },
      { title: 'Breathe', desc: 'Take 10 slow, deep breaths in total silence.' }
    ]
  },

  // --- Sleep & Relaxation ---
  {
    id: 'sleep-1',
    title: 'Sleep Breathing',
    description: 'Rhythmic breath pattern to signal sleep to your brain.',
    duration: 5,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🛏️',
    benefits: ['Sleep onset', 'Heart rate slowing', 'Mental quiet'],
    steps: [
      { title: 'Lie Comfortably', desc: 'Lie in bed and relax all muscles.' },
      { title: 'Slow Breath', desc: 'Inhale for 4s, exhale for 6s.' }
    ]
  },
  {
    id: 'sleep-2',
    title: 'Body Relaxation',
    description: 'Release daytime tension muscle by muscle.',
    duration: 5,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🌙',
    benefits: ['Muscle relaxation', 'Deep rest', 'Stress purge'],
    steps: [
      { title: 'Tension & Release', desc: 'Tense your feet for 5 seconds, then let go completely.' },
      { title: 'Move Up', desc: 'Repeat for legs, torso, arms, and face.' }
    ]
  },
  {
    id: 'sleep-3',
    title: 'Night Reflection',
    description: 'Quietly process the day and let go of lingering thoughts.',
    duration: 3,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🌌',
    benefits: ['Mind clearing', 'Peaceful transition to sleep', 'Closure'],
    steps: [
      { title: 'Review', desc: 'Acknowledge the day is done and cannot be changed.' },
      { title: 'Release', desc: 'Put all tasks and worries in an imaginary box until tomorrow.' }
    ]
  },
  {
    id: 'sleep-4',
    title: '5-Minute Wind Down',
    description: 'Gentle transition from active day to restful evening.',
    duration: 5,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🕯️',
    benefits: ['Evening calm', 'Relaxed breathing', 'Peaceful mood'],
    steps: [
      { title: 'Dim Lights', desc: 'Lower lighting and sit in a comfortable chair.' },
      { title: 'Soft Breath', desc: 'Breathe slowly while letting thoughts drift away.' }
    ]
  },
  {
    id: 'sleep-5',
    title: 'Calm Visualization',
    description: 'Mental journey to a peaceful beach or starlit forest.',
    duration: 5,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🌲',
    benefits: ['Escapism', 'Deep relaxation', 'Comforting imagery'],
    steps: [
      { title: 'Imagine', desc: 'Picture a safe, serene sanctuary in nature.' },
      { title: 'Immerse', desc: 'Feel the gentle breeze or soft moss beneath you.' }
    ]
  },
  {
    id: 'sleep-6',
    title: 'Sleep Countdown',
    description: 'Count backward from 100 with each breath to induce sleep.',
    duration: 5,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🔢',
    benefits: ['Cognitive distraction', 'Drowsiness induction', 'Peaceful drift'],
    steps: [
      { title: 'Count Down', desc: 'Count 100... 99... 98... matching each number with an exhale.' }
    ]
  },
  {
    id: 'sleep-7',
    title: 'Gentle Evening Stretch',
    description: 'Light bedtime stretching to loosen limbs before sleep.',
    duration: 4,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🌙',
    benefits: ['Stiff joint relief', 'Body relaxation', 'Better sleep posture'],
    steps: [
      { title: 'Gentle Reach', desc: 'Reach arms overhead and stretch softly.' },
      { title: 'Twist', desc: 'Take a gentle seated spinal twist.' }
    ]
  },
  {
    id: 'sleep-8',
    title: 'Gratitude Before Sleep',
    description: 'End your day on a warm, positive note of thankfulness.',
    duration: 3,
    category: 'Sleep',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '✨',
    benefits: ['Positive dreams', 'Warm heart', 'Peaceful mind'],
    steps: [
      { title: 'One Gift', desc: 'Think of one good thing that happened today.' },
      { title: 'Smile', desc: 'Let a quiet smile relax your face as you drift off.' }
    ]
  },

  // --- Energy & Morning Wellness ---
  {
    id: 'energy-1',
    title: 'Morning Stretch',
    description: 'Awaken your muscles and increase blood flow to start the day.',
    duration: 5,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '🌅',
    benefits: ['Morning vitality', 'Circulation', 'Flexibility'],
    steps: [
      { title: 'Full Body Reach', desc: 'Reach your arms high toward the ceiling and stretch.' },
      { title: 'Side Bends', desc: 'Take gentle side bends left and right.' }
    ]
  },
  {
    id: 'energy-2',
    title: 'Energizing Breathing',
    description: 'Dynamic breathwork to oxygenate cells and spark alertness.',
    duration: 3,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '⚡',
    benefits: ['Oxygen boost', 'Mental alertness', 'Energy surge'],
    steps: [
      { title: 'Brisk Inhale', desc: 'Take quick, full breaths in through the nose.' },
      { title: 'Confident Exhale', desc: 'Exhale with energy and vitality.' }
    ]
  },
  {
    id: 'energy-3',
    title: '2-Minute Movement',
    description: 'Quick active reset to shake off lethargy.',
    duration: 2,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🏃',
    benefits: ['Lethargy bust', 'Heart rate lift', 'Body awakening'],
    steps: [
      { title: 'Shake Out', desc: 'Gently shake out your hands, arms, and legs.' },
      { title: 'Jumping Jacks / March', desc: 'March in place or do light arm circles.' }
    ]
  },
  {
    id: 'energy-4',
    title: 'Posture Reset',
    description: 'Correct slouching and align your spine for high performance.',
    duration: 2,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 10,
    icon: '🧍',
    benefits: ['Spine alignment', 'Chest opening', 'Confident posture'],
    steps: [
      { title: 'Shoulders Back', desc: 'Pull shoulders down and back, lifting your chest.' },
      { title: 'Chin Tuck', desc: 'Tuck chin slightly to align neck with spine.' }
    ]
  },
  {
    id: 'energy-5',
    title: 'Wake-Up Routine',
    description: 'A complete sequence to activate body and mind.',
    duration: 5,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 20,
    icon: '☀️',
    benefits: ['Full activation', 'Positive energy', 'Morning readiness'],
    steps: [
      { title: 'Deep Breaths', desc: 'Take 5 invigorating breaths.' },
      { title: 'Gentle Twists', desc: 'Rotate torso gently to wake up spine.' }
    ]
  },
  {
    id: 'energy-6',
    title: 'Quick Focus Reset',
    description: 'Banish afternoon slump with a targeted mental refresh.',
    duration: 3,
    category: 'Energy',
    difficulty: 'Beginner',
    xpReward: 15,
    icon: '🎯',
    benefits: ['Afternoon slump cure', 'Renewed concentration', 'Clarity'],
    steps: [
      { title: 'Hydrate & Breathe', desc: 'Drink a glass of water and take 3 deep breaths.' },
      { title: 'Reset Intention', desc: 'Prioritize your next task with a clear mind.' }
    ]
  }
];
