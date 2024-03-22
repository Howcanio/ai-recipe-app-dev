import LandingPage from '@/app/components/LandingPage';
import {
  getRecipesByCategoryAndCuisine,
  getRecipesByCuisineAndCategory,
  getSectionCategories,
  getSectionCuisines,
} from '@/app/lib/mealTypeActions';
import {
  capitalizeFirstLetterOfEveryWord,
  slugToString,
} from '@/app/lib/parsers';

export const dynamic = 'force-dynamic';

type Params = {
  params: {
    cuisine: string;
  };
};

export default async function Cuisine({ params: { cuisine } }: Params) {
  const categories = (await getSectionCategories()) as Category[] | [];
  const cuisines = (await getSectionCuisines()) as Cuisine[] | [];
  const cuisineRecipes = await getRecipesByCuisineAndCategory(
    capitalizeFirstLetterOfEveryWord(slugToString(cuisine))
  );
  const sortedRecipes = cuisineRecipes.flatMap(
    (category) => category.recipes
  ) as Recipe[] | [];
  return (
    <LandingPage
      categories={categories}
      cuisines={cuisines}
      recipes={sortedRecipes}
    />
  );
}
