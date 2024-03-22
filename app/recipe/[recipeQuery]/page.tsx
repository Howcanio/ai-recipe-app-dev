import {
  getMostPopularRecipes,
  getMostRecentRecipes,
  getRecipeByQuery,
  updateSearchCount,
} from '@/app/lib/dbActions';
import Recipe from './components/Recipe';
import { Metadata, ResolvingMetadata } from 'next';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

type Params = {
  params: {
    recipeQuery: string;
  };
};

export async function generateMetadata(
  { params: { recipeQuery } }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  const recipe = (await getRecipeByQuery(recipeQuery)) as Recipe | undefined;
  const previousImages = (await parent).openGraph?.images || [];
  const images = recipe?.meal_image
    ? [imageBaseUrl + recipe.meal_image, ...previousImages]
    : [...previousImages];

  return {
    title: recipe?.name,
    description: recipe?.description,
    openGraph: {
      images: images,
    },
  };
}

export default async function RecipePage({ params: { recipeQuery } }: Params) {
  const recipe = (await getRecipeByQuery(recipeQuery)) as Recipe | undefined;
  const mostRecentRecipes = (await getMostRecentRecipes()) as Recipe[] | [];
  const mostPopularRecipes = (await getMostPopularRecipes()) as Recipe[] | [];
  if (recipe) await updateSearchCount(recipe.id);
  return (
    <Recipe
      recipe={recipe}
      mostRecentRecipes={mostRecentRecipes}
      mostPopularRecipes={mostPopularRecipes}
      recipeQuery={recipeQuery}
    />
  );
}
