import { convertServingToInt, parsePostgreSQLArray } from '@/app/lib/parsers';
import Script from 'next/script';

const GoogleRecipeScript = ({ recipe }: { recipe: Recipe }) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  const recipeIngredients = parsePostgreSQLArray(recipe.recipe_ingredients);
  const recipeInstructions = parsePostgreSQLArray(recipe.recipe_instructions);
  const recipeInstructionsScript = recipeInstructions.map((instruction) => ({
    '@type': 'HowToStep',
    text: instruction,
  }));

  const jsonLdScriptContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    image: [`${imageBaseUrl}${recipe.meal_image}`],
    datePublished: recipe.created_at,
    description: recipe.description,
    prepTime: recipe.prep_time,
    cookTime: recipe.cook_time,
    totalTime: recipe.total_time,
    keywords: recipe.keywords,
    recipeYield: convertServingToInt(recipe.recipe_yield),
    recipeCategory: recipe.recipe_category,
    recipeCuisine: recipe.recipe_cuisine,
    nutrition: {
      '@type': 'NutritionInformation',
      calories: convertServingToInt(recipe.calories),
    },
    recipeIngredient: recipeIngredients,
    recipeInstructions: recipeInstructionsScript,
  });
  return (
    <Script id='recipe' type='application/ld+json' strategy='lazyOnload'>
      {jsonLdScriptContent}
    </Script>
  );
};

export default GoogleRecipeScript;
