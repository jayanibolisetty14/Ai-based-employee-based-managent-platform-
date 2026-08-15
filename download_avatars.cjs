const https = require('https');
const fs = require('fs');

const avatars = [
  { id: 'avatar-01', seed: 'Maya' },
  { id: 'avatar-02', seed: 'Arjun' },
  { id: 'avatar-03', seed: 'Chloe' },
  { id: 'avatar-04', seed: 'Leo' },
  { id: 'avatar-05', seed: 'Sophia' },
  { id: 'avatar-06', seed: 'Noah' },
  { id: 'avatar-07', seed: 'Emma' },
  { id: 'avatar-08', seed: 'Elias' },
  { id: 'avatar-09', seed: 'Mia' },
  { id: 'avatar-10', seed: 'Lucas' },
  { id: 'avatar-11', seed: 'Ava' },
  { id: 'avatar-12', seed: 'Oliver' },
  { id: 'avatar-13', seed: 'Isabella' },
  { id: 'avatar-14', seed: 'Ethan' },
  { id: 'avatar-15', seed: 'Zoe' },
  { id: 'avatar-16', seed: 'Aiden' },
  { id: 'avatar-17', seed: 'Lily' },
  { id: 'avatar-18', seed: 'Jackson' },
  { id: 'avatar-19', seed: 'Aria' },
  { id: 'avatar-20', seed: 'Mason' },
  { id: 'avatar-21', seed: 'Grace' },
  { id: 'avatar-22', seed: 'Logan' },
  { id: 'avatar-23', seed: 'Nora' },
  { id: 'avatar-24', seed: 'Caleb' },
  { id: 'avatar-25', seed: 'Hazel' },
  { id: 'avatar-26', seed: 'Mateo' },
  { id: 'avatar-27', seed: 'Stella' },
  { id: 'avatar-28', seed: 'Levi' },
  { id: 'avatar-29', seed: 'Aurora' },
  { id: 'avatar-30', seed: 'Owen' }
];

async function downloadAvatar(id, seed) {
  const url = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;
  const dest = `src/assets/avatars/${id}.svg`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(dest, data);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${id}:`, err);
      reject(err);
    });
  });
}

async function downloadAll() {
  for (const {id, seed} of avatars) {
    console.log(`Downloading ${id}...`);
    await downloadAvatar(id, seed);
  }
  console.log('All avatars downloaded.');
}

downloadAll();
