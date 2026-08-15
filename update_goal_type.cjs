const fs = require('fs');
let data = fs.readFileSync('src/types/index.ts', 'utf8');

data = data.replace(
  `export interface Goal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  deadline: string;
}`,
  `export interface Goal {
  id: string;
  title: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
  deadline: string;
  frequency?: 'Daily' | 'Weekly';
  createdAt?: string;
  completedAt?: string;
}`
);

fs.writeFileSync('src/types/index.ts', data);
