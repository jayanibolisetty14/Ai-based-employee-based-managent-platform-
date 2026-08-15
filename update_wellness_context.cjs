const fs = require('fs');
let data = fs.readFileSync('src/context/WellnessContext.tsx', 'utf8');

if (!data.includes('deleteGoal: (goalId: string) => void;')) {
  data = data.replace(
    "updateGoal: (goalId: string, value: number) => void;",
    "updateGoal: (goalId: string, value: number) => void;\n  deleteGoal: (goalId: string) => void;"
  );
}

if (!data.includes('const deleteGoal =')) {
  data = data.replace(
    "const updateGoal = (goalId: string, value: number) => {",
    `const deleteGoal = (goalId: string) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
  };

  const updateGoal = (goalId: string, value: number) => {`
  );
}

if (!data.includes('deleteGoal,')) {
  data = data.replace(
    "updateGoal,",
    "updateGoal,\n    deleteGoal,"
  );
}

fs.writeFileSync('src/context/WellnessContext.tsx', data);
