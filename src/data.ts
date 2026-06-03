import { AssessmentQuestion, CategoryWeights } from "./types";

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "lfs_01",
    category: "lifestyle",
    text: "How would you rate your overall sleep quality over the past 2 weeks?",
    options: [
      { text: "Excellent & Restful", value: 0 },
      { text: "Good", value: 1 },
      { text: "Fair / Interrupted", value: 2 },
      { text: "Poor & Unrefreshing", value: 3 }
    ]
  },
  {
    id: "phy_01",
    category: "physical",
    text: "How frequently have you experienced tension headaches or muscle tightness?",
    options: [
      { text: "Never", value: 0 },
      { text: "Seldom", value: 1 },
      { text: "Frequently", value: 2 },
      { text: "Almost Constantly", value: 3 }
    ]
  },
  {
    id: "acd_01",
    category: "academic_work",
    text: "How often do you feel overwhelmed by your assignments, exams, or daily workload?",
    options: [
      { text: "Rarely or Never", value: 0 },
      { text: "Occasionally", value: 1 },
      { text: "Frequently", value: 2 },
      { text: "Almost Always", value: 3 }
    ]
  },
  {
    id: "acd_02",
    category: "academic_work",
    text: "How confident are you in managing your school/work deadlines and goals?",
    options: [
      { text: "Highly Confident", value: 0 },
      { text: "Somewhat Confident", value: 1 },
      { text: "Rarely Confident", value: 2 },
      { text: "Constantly Stressed/Unable to Cope", value: 3 }
    ]
  },
  {
    id: "cog_01",
    category: "cognitive_social",
    text: "To what extent are you experiencing concentration issues or brain fog in daily life?",
    options: [
      { text: "Not at All", value: 0 },
      { text: "Mild & Occasional", value: 1 },
      { text: "Moderate & Distracting", value: 2 },
      { text: "Severe & Constant", value: 3 }
    ]
  },
  {
    id: "cog_02",
    category: "cognitive_social",
    text: "How often have you felt irritable, reactive, or socially withdrawn from friends or family?",
    options: [
      { text: "Never", value: 0 },
      { text: "Seldom", value: 1 },
      { text: "Frequently", value: 2 },
      { text: "Almost Constantly", value: 3 }
    ]
  },
  {
    id: "lfs_02",
    category: "lifestyle",
    text: "How balanced is your daily routine in terms of regular meals, hydration, and breaks?",
    options: [
      { text: "Very Balanced", value: 0 },
      { text: "Mostly Balanced", value: 1 },
      { text: "Somewhat Neglected", value: 2 },
      { text: "Extremely Chaotic", value: 3 }
    ]
  },
  {
    id: "phy_02",
    category: "physical_emotional",
    text: "How often do you feel emotionally drained, anxious, or unmotivated when starting your day?",
    options: [
      { text: "Never or Rarely", value: 0 },
      { text: "A Few Times", value: 1 },
      { text: "Often", value: 2 },
      { text: "Nearly Every Day", value: 3 }
    ]
  }
];

export const categoryWeights: CategoryWeights = {
  lifestyle: 1.0,
  academic_work: 1.5,
  cognitive_social: 1.8,
  physical_emotional: 2.0
};

export const categoryMetadata = {
  lifestyle: {
    label: "Lifestyle Habits",
    description: "Evaluates sleep quality, nutritional habits, exercise, and stress recovery routines.",
    color: "from-teal-500 to-emerald-400 bg-teal-50 text-teal-700 dark:text-teal-400 border-teal-200",
    iconName: "Activity"
  },
  academic_work: {
    label: "Academic & Work",
    description: "Measures stress arising from demands, performance pressure, deadlines, and task-load.",
    color: "from-blue-500 to-indigo-400 bg-blue-50 text-blue-700 dark:text-blue-400 border-blue-200",
    iconName: "BookOpen"
  },
  cognitive_social: {
    label: "Cognitive & Social",
    description: "Assesses brain fog, irritability, social connection, and patience with others.",
    color: "from-amber-500 to-orange-400 bg-amber-50 text-amber-700 dark:text-amber-400 border-amber-200",
    iconName: "Users"
  },
  physical_emotional: {
    label: "Physical & Emotional",
    description: "Evaluates chronic muscle tension, headaches, body symptoms, anxiety, and dread.",
    color: "from-rose-500 to-pink-400 bg-rose-50 text-rose-700 dark:text-rose-400 border-rose-200",
    iconName: "HeartPulse"
  }
};

export function getCategoryWeightKey(category: string): string {
  // Map physical category to physical_emotional weight
  if (category === "physical") return "physical_emotional";
  return category;
}

export function getStressLevel(score: number): {
  label: string;
  description: string;
  color: string;
  badgeBg: string;
} {
  if (score < 25) {
    return {
      label: "Low Stress",
      description: "You are experiencing a healthy, manageable baseline. Keep maintaining your self-care routines!",
      color: "text-emerald-500 dark:text-emerald-400",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50"
    };
  } else if (score < 50) {
    return {
      label: "Moderate Stress",
      description: "Mild stress detected. Consider taking regular breaks, standardizing your sleep, and managing workloads.",
      color: "text-amber-500 dark:text-amber-400",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/50"
    };
  } else if (score < 75) {
    return {
      label: "High Stress",
      description: "Significant stress load identified. We recommend delegating tasks, reviewing deadlines, and prioritizing well-being routines.",
      color: "text-orange-500 dark:text-orange-400",
      badgeBg: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-900/50"
    };
  } else {
    return {
      label: "Severe Stress",
      description: "High burnout risk detected. Strongly prioritize immediate rest, adjust expectations, and seek peer or professional support.",
      color: "text-rose-500 dark:text-rose-400",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50"
    };
  }
}
