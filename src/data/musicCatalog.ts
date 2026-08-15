export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  language: 'English' | 'తెలుగు' | 'हिन्दी' | 'தமிழ்';
  mood: 'Happy' | 'Calm' | 'Relaxed' | 'Focus' | 'Energetic' | 'Sad' | 'Stressed' | 'Sleep' | 'Meditation';
  duration: string;
  coverUrl: string;
  audioUrl: string;
  favorite?: boolean;
}

const SAMPLE_AUDIOS = [
  'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db32497645.mp3?filename=ambient-piano-logo-16538.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=meditation-zen-garden-11211.mp3',
  'https://cdn.pixabay.com/download/audio/2021/09/06/audio_2472d2427a.mp3?filename=lofi-study-112191.mp3',
  'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=relaxing-chill-out-125039.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c365b404.mp3?filename=sleep-meditation-ambient-10656.mp3',
  'https://cdn.pixabay.com/download/audio/2022/08/03/audio_145025a47e.mp3?filename=positive-motivation-117714.mp3',
  'https://cdn.pixabay.com/download/audio/2022/04/27/audio_1306b95b8d.mp3?filename=peaceful-garden-11124.mp3',
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf756.mp3?filename=soft-rain-ambient-111154.mp3'
];

const COVERS = [
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=80'
];

// Generate 30+ songs per language (Total 128 songs)
export const MUSIC_CATALOG: Song[] = [];

const englishTitles = [
  'Ocean Breeze', 'Starlight Meditation', 'Infinite Focus', 'Ethereal Sleep', 
  'Morning Awakening', 'Inner Peace', 'Gentle Rain', 'Cosmic Drift', 
  'Solitude Waves', 'Zen Garden', 'Amber Sunset', 'Whispering Pines',
  'Astral Harmony', 'Silent Reflection', 'Dreamer Awakening', 'Pure Serenity',
  'Golden Horizon', 'Vibrant Pulse', 'Celestial Echo', 'Breathe Deep',
  'Healing Frequencies', 'Floating Clouds', 'Moonlit path', 'Deep Relaxation',
  'Awaken Spirit', 'Harmonic Resonance', 'Quietude', 'Sacred Space',
  'Tidal Calm', 'Infinite Sky', 'Evergreen Peace', 'Solar Radiance'
];

const englishArtists = [
  'Aria Vance', 'Celeste Ray', 'Echo Valley', 'Lunar Dreams', 'Solstice Sound',
  'Nova Harmonic', 'Zenith Aura', 'Kiran Sound', 'Soren Vibe', 'Amara Skye'
];

const hindiTitles = [
  'Sukoon', 'Ruhani Shanti', 'Prana Flow', 'Himalayan Echo', 'Sandhya Deep',
  'Nirvana', 'Monsoon Melody', 'Ganga Calm', 'Divine Rhythm', 'Anand Dhwani',
  'Kiran Kiran', 'Sangeet Dhyan', 'Prashanti', 'Pavan Leela', 'Tarana',
  'Amrit Dhara', 'Chaitanya', 'Madhur Milan', 'Sanjhi Raat', 'Tejasvi',
  'Udaan', 'Bansuri Peace', 'Sitar Breeze', 'Anant Jyoti', 'Mridang Calm',
  'Tarang', 'Bhajanam', 'Samarpan', 'Shanti Mantra', 'Yog Nidra', 'Pranayam', 'Divya Dhyan'
];

const hindiArtists = [
  'Aarav Sharma', 'Meera Iyer', 'Rohan Verma', 'Ananya Sen', 'Kabir Das',
  'Priya Nair', 'Devansh Roy', 'Neha Kapoor', 'Vikramaditya', 'Siddharth Rao'
];

const teluguTitles = [
  'Prashanthi', 'Mounam', 'Vasantha Veyi', 'Gamyam', 'Sandram', 'Chiguru',
  'Velugu', 'Pavithra', 'Anandam', 'Pranam', 'Madhura Smruthi', 'Gagana Vihari',
  'Tholi Velugu', 'Manasu Palike', 'Sagara Sangamam', 'Vana Lahari', 'Chandra Kiranam',
  'Prema Jyothi', 'Swarna Yugam', 'Nimmalam', 'Tejo Murthy', 'Aalaya Vani',
  'Bhoomika', 'Ganga Pravaham', 'Shanti Sandesham', 'Divya Vanam', 'Vasantha Geetham',
  'Amrutha Varsham', 'Sneha Spandana', 'Maha Prana', 'Yoga Vahini', 'Ananta Swaram'
];

const teluguArtists = [
  'Kiran Kumar', 'Swathi Reddy', 'Vamsi Krishna', 'Divya Rao', 'Nikhil Varma',
  'Anusha Raju', 'Sandeep Goud', 'Haritha Priya', 'Tarun Chakravarthy', 'Bhavana Devi'
];

const tamilTitles = [
  'Amirtham', 'Mounali', 'Vaanavil', 'Nila Oru', 'Uyir Mozhi', 'Isai',
  'Thendral', 'Anbu', 'Santhosham', 'Marutham', 'Kavithai', 'Iniya Iravu',
  'Devathaigal', 'Azhagiya Naal', 'Kaatrin Mozhi', 'Snegithane', 'Yazh Isai',
  'Pon Maalai', 'Aanandham', 'Malarum', 'Nilavu', 'Thendral Kaatru',
  'Uyirin Geetham', 'Siva Dhyanam', 'Bhakthi Lahari', 'Mouna Ragam', 'Isai Gnanam',
  'Kannaana Kaney', 'Thamarai', 'Velli Nilave', 'Senthamizh', 'Anbin Alai'
];

const tamilArtists = [
  'Karthik Sundar', 'Priya Raman', 'Arun Vijay', 'Deepika Ramesh', 'Siva Kumar',
  'Lavanya Suresh', 'Vijay Prakash', 'Gayathri Nambiar', 'Raghavan', 'Subhashini'
];

const MOODS: Array<Song['mood']> = ['Calm', 'Happy', 'Relaxed', 'Focus', 'Energetic', 'Sad', 'Stressed', 'Sleep', 'Meditation'];

// Helper to push items
let globalId = 1;

// Populate English (32 songs)
englishTitles.forEach((title, idx) => {
  MUSIC_CATALOG.push({
    id: `eng-${globalId++}`,
    title,
    artist: englishArtists[idx % englishArtists.length],
    album: `Mindful Horizons Vol. ${(idx % 5) + 1}`,
    language: 'English',
    mood: MOODS[idx % MOODS.length],
    duration: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 50) + 10}`,
    coverUrl: COVERS[idx % COVERS.length],
    audioUrl: SAMPLE_AUDIOS[idx % SAMPLE_AUDIOS.length],
    favorite: idx === 0 || idx === 4
  });
});

// Populate Hindi (32 songs)
hindiTitles.forEach((title, idx) => {
  MUSIC_CATALOG.push({
    id: `hin-${globalId++}`,
    title,
    artist: hindiArtists[idx % hindiArtists.length],
    album: `Ruhani Safar Vol. ${(idx % 5) + 1}`,
    language: 'हिन्दी',
    mood: MOODS[idx % MOODS.length],
    duration: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 50) + 10}`,
    coverUrl: COVERS[(idx + 2) % COVERS.length],
    audioUrl: SAMPLE_AUDIOS[(idx + 1) % SAMPLE_AUDIOS.length],
    favorite: idx === 2
  });
});

// Populate Telugu (32 songs)
teluguTitles.forEach((title, idx) => {
  MUSIC_CATALOG.push({
    id: `tel-${globalId++}`,
    title,
    artist: teluguArtists[idx % teluguArtists.length],
    album: `Prashanthi Lahari Vol. ${(idx % 5) + 1}`,
    language: 'తెలుగు',
    mood: MOODS[idx % MOODS.length],
    duration: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 50) + 10}`,
    coverUrl: COVERS[(idx + 4) % COVERS.length],
    audioUrl: SAMPLE_AUDIOS[(idx + 2) % SAMPLE_AUDIOS.length],
    favorite: idx === 1
  });
});

// Populate Tamil (32 songs)
tamilTitles.forEach((title, idx) => {
  MUSIC_CATALOG.push({
    id: `tam-${globalId++}`,
    title,
    artist: tamilArtists[idx % tamilArtists.length],
    album: `Isai Santhosham Vol. ${(idx % 5) + 1}`,
    language: 'தமிழ்',
    mood: MOODS[idx % MOODS.length],
    duration: `${Math.floor(Math.random() * 2) + 3}:${Math.floor(Math.random() * 50) + 10}`,
    coverUrl: COVERS[(idx + 6) % COVERS.length],
    audioUrl: SAMPLE_AUDIOS[(idx + 3) % SAMPLE_AUDIOS.length],
    favorite: idx === 3
  });
});
