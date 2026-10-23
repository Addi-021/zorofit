const mockData = {
  user: {
    name: "Addi",
    age: 21,
    height: 171,
    weight: 97,
    targetWeight: 85,
    bmi: 33.2,
  },

  nutrition: {
    calories: 1840,
    calorieGoal: 2200,
    protein: 112,
    proteinGoal: 130,
    carbs: 210,
    fat: 58,
  },

  workout: {
    name: "Chest & Triceps",
    exercises: 6,
    duration: 45,
    status: "Planned",
  },

  recentActivity: [
    {
      title: "Workout completed",
      description: "Chest & Triceps · 1 hour ago",
    },
    {
      title: "Lunch logged",
      description: "620 kcal · 2 hours ago",
    },
    {
      title: "Weight updated",
      description: "97 kg · Yesterday",
    },
  ],

  weightHistory: [
    { date: "Sep 1", weight: 100 },
    { date: "Sep 10", weight: 99 },
    { date: "Sep 20", weight: 98 },
    { date: "Oct 1", weight: 98 },
    { date: "Oct 9", weight: 97 },
  ],


workoutPlans:[
  {
    id: 1,
    name: "Push Day",
    focus:"Chest, Triceps",
    exercises: 7,
    duration: 60,
  },
  {
    id: 2,
    name: "Pull Day",
    focus: "Back, Biceps",
    exercises: 6,
    duration: 60,
  },
  {
    id: 3,
    name: "Leg + Shoulder Day",
    focus: "Quads, Hamstrings, Glutes, Shoulders",
    exercises: 8,
    duration: 75,
  },
]}
export default mockData;
