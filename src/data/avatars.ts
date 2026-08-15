export interface AvatarData {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'unisex';
  style: 'calm' | 'energetic' | 'friendly' | 'focused';
  description: string;
  image: string;
  tags: string[];
}

export const AVATARS: AvatarData[] = [
  { id: 'avatar-01', name: 'Maya', gender: 'female', style: 'calm', description: 'Calm Explorer', image: '/avatars/avatar-01.svg', tags: ['calm', 'wellness', 'explorer', 'women'] },
  { id: 'avatar-02', name: 'Arjun', gender: 'male', style: 'focused', description: 'Mindful Builder', image: '/avatars/avatar-02.svg', tags: ['focused', 'mindful', 'builder', 'men'] },
  { id: 'avatar-03', name: 'Devon', gender: 'male', style: 'focused', description: 'Mindful Guide', image: '/avatars/avatar-03.svg', tags: ['focused', 'mindful', 'guide', 'men'] },
  { id: 'avatar-04', name: 'Leah', gender: 'female', style: 'calm', description: 'Peaceful Mind', image: '/avatars/avatar-04.svg', tags: ['calm', 'peaceful', 'focused', 'women'] },
  { id: 'avatar-05', name: 'Sophia', gender: 'female', style: 'friendly', description: 'Serene Soul', image: '/avatars/avatar-05.svg', tags: ['friendly', 'serene', 'calm', 'women'] },
  { id: 'avatar-06', name: 'Noah', gender: 'male', style: 'calm', description: 'Steady Guide', image: '/avatars/avatar-06.svg', tags: ['calm', 'steady', 'guide', 'men'] },
  { id: 'avatar-07', name: 'Emma', gender: 'female', style: 'focused', description: 'Deep Thinker', image: '/avatars/avatar-07.svg', tags: ['focused', 'thinker', 'afro', 'women'] },
  { id: 'avatar-08', name: 'Elias', gender: 'male', style: 'energetic', description: 'Joyful Scholar', image: '/avatars/avatar-08.svg', tags: ['energetic', 'joyful', 'glasses', 'men'] },
  { id: 'avatar-09', name: 'Mia', gender: 'female', style: 'focused', description: 'Clear Vision', image: '/avatars/avatar-09.svg', tags: ['focused', 'glasses', 'vision', 'women'] },
  { id: 'avatar-10', name: 'Luna', gender: 'female', style: 'calm', description: 'Serene Spirit', image: '/avatars/avatar-10.svg', tags: ['calm', 'serene', 'spirit', 'women'] },
  { id: 'avatar-11', name: 'Amir', gender: 'male', style: 'friendly', description: 'Warm Presence', image: '/avatars/avatar-11.svg', tags: ['friendly', 'warm', 'smile', 'men'] },
  { id: 'avatar-12', name: 'Oliver', gender: 'male', style: 'focused', description: 'Steady Anchor', image: '/avatars/avatar-12.svg', tags: ['focused', 'steady', 'anchor', 'men'] },
  { id: 'avatar-13', name: 'Isaac', gender: 'male', style: 'focused', description: 'Mindful Analyst', image: '/avatars/avatar-13.svg', tags: ['focused', 'analyst', 'glasses', 'men'] },
  { id: 'avatar-14', name: 'Ethan', gender: 'male', style: 'calm', description: 'Kind Heart', image: '/avatars/avatar-14.svg', tags: ['calm', 'kind', 'heart', 'men'] },
  { id: 'avatar-15', name: 'Zion', gender: 'male', style: 'energetic', description: 'Vibrant Catalyst', image: '/avatars/avatar-15.svg', tags: ['energetic', 'vibrant', 'smile', 'men'] },
  { id: 'avatar-16', name: 'Aria', gender: 'female', style: 'friendly', description: 'Radiant Spark', image: '/avatars/avatar-16.svg', tags: ['friendly', 'radiant', 'spark', 'women'] },
  { id: 'avatar-17', name: 'Leo', gender: 'male', style: 'friendly', description: 'Kind Thinker', image: '/avatars/avatar-17.svg', tags: ['friendly', 'thinker', 'glasses', 'men'] },
  { id: 'avatar-18', name: 'Jada', gender: 'female', style: 'focused', description: 'Determined Vision', image: '/avatars/avatar-18.svg', tags: ['focused', 'determined', 'glasses', 'women'] },
  { id: 'avatar-19', name: 'Adrian', gender: 'male', style: 'calm', description: 'Harmonic Mind', image: '/avatars/avatar-19.svg', tags: ['calm', 'harmonic', 'mind', 'men'] },
  { id: 'avatar-20', name: 'Mason', gender: 'male', style: 'focused', description: 'Strong Will', image: '/avatars/avatar-20.svg', tags: ['focused', 'strong', 'will', 'men'] },
  { id: 'avatar-21', name: 'Grace', gender: 'female', style: 'calm', description: 'Graceful Being', image: '/avatars/avatar-21.svg', tags: ['calm', 'graceful', 'glasses', 'women'] },
  { id: 'avatar-22', name: 'Logan', gender: 'male', style: 'focused', description: 'Loyal Guardian', image: '/avatars/avatar-22.svg', tags: ['focused', 'loyal', 'glasses', 'men'] },
  { id: 'avatar-23', name: 'Nora', gender: 'female', style: 'energetic', description: 'Bright Scholar', image: '/avatars/avatar-23.svg', tags: ['energetic', 'bright', 'glasses', 'women'] },
  { id: 'avatar-24', name: 'Chloe', gender: 'female', style: 'friendly', description: 'Joyful Explorer', image: '/avatars/avatar-24.svg', tags: ['friendly', 'joyful', 'glasses', 'women'] },
  { id: 'avatar-25', name: 'Hugo', gender: 'male', style: 'calm', description: 'Rooted Explorer', image: '/avatars/avatar-25.svg', tags: ['calm', 'rooted', 'explorer', 'men'] },
  { id: 'avatar-26', name: 'Mira', gender: 'female', style: 'friendly', description: 'Creative Mind', image: '/avatars/avatar-26.svg', tags: ['friendly', 'creative', 'glasses', 'women'] },
  { id: 'avatar-27', name: 'Stella', gender: 'female', style: 'friendly', description: 'Star Shine', image: '/avatars/avatar-27.svg', tags: ['friendly', 'star', 'glasses', 'women'] },
  { id: 'avatar-28', name: 'Layla', gender: 'female', style: 'energetic', description: 'Bold Radiance', image: '/avatars/avatar-28.svg', tags: ['energetic', 'bold', 'afro', 'glasses', 'women'] },
  { id: 'avatar-29', name: 'Asher', gender: 'male', style: 'friendly', description: 'Bright Guide', image: '/avatars/avatar-29.svg', tags: ['friendly', 'bright', 'guide', 'men'] },
  { id: 'avatar-30', name: 'Owen', gender: 'male', style: 'friendly', description: 'Open Heart', image: '/avatars/avatar-30.svg', tags: ['friendly', 'open', 'heart', 'men'] }
];

export const getAvatarById = (id: string | undefined): AvatarData => {
  return AVATARS.find(a => a.id === id) || AVATARS[0];
};

export const getAvatarByEmojiOrId = (val: string | undefined): AvatarData => {
  if (!val) return AVATARS[0];
  // If it's an old emoji, return default
  if (val.length < 5) return AVATARS[0];
  return AVATARS.find(a => a.id === val) || AVATARS[0];
};
