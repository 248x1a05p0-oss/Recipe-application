export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Desserts';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export interface InstructionStep {
  stepNumber: number;
  instruction: string;
  timerMinutes?: number;
  tip?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: RecipeCategory;
  imageUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewsCount: number;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  isFavorite?: boolean;
  isCustom?: boolean;
  author?: string;
  createdAt: string;
}

export type ViewMode = 'all' | 'favorites' | 'create' | 'flutter-code';
