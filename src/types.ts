export interface QuestionOption {
  text: string;
  value: number;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  text: string;
  options: QuestionOption[];
}

export interface CategoryWeights {
  lifestyle: number;
  academic_work: number;
  cognitive_social: number;
  physical_emotional: number;
  [key: string]: number; // index signature to allow flexible indexing
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  answers: Record<string, number>; // questionId -> selectedOptionValue
  scores: {
    overall: number; // overall percentage (0-100) or score
    byCategory: Record<string, { value: number; max: number; percentage: number }>;
  };
  highestStressCategory: string;
}
