type Recipe = {
  id: string;
  query: string;
  name: string;
  history: string;
  history_image?: string;
  meal_image?: string;
  steps_images?: string[];
  search_count: number;
  description: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  keywords: string;
  recipe_yield: string;
  recipe_category: string;
  recipe_cuisine: string;
  calories: string;
  recipe_ingredients: string[];
  recipe_instructions: string[];
  related_recipes: RelatedRecipe[];
  created_at: Date;
  updated_at: Date;
};

type RelatedRecipe = {
  name: string;
  description: string;
};

type FilteredQuery = {
  isMeal: boolean;
  inputWithoutTypos: string;
};

type IngredientUrl = {
  [ingredient: string]: string | null;
};

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html: string;
  name: string;
};

type Identifiable = {
  id: string;
  createdAt: number;
};

type Category = {
  name: string;
  image_url?: string;
};

type Cuisine = {
  name: string;
  image_url?: string;
};
type MealType = 'cuisine' | 'category';

type ImageType = 'Meal' | 'History';

type Prompt = {
  name: string;
  description: string;
  value: string;
};
