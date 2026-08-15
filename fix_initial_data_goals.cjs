const fs = require('fs');
let data = fs.readFileSync('src/data/initialData.ts', 'utf8');

data = data.replace(/goals:\s*\[[\s\S]*?\],\s*achievements/m, "goals: [],\n  achievements");

fs.writeFileSync('src/data/initialData.ts', data);
