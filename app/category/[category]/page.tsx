import LandingPage from '@/app/components/LandingPage';
import {
  getRecipesByCategoryAndCuisine,
  getSectionCategories,
  getSectionCuisines,
} from '@/app/lib/mealTypeActions';
import {
  capitalizeFirstLetterOfEveryWord,
  slugToString,
} from '@/app/lib/parsers';

type Params = {
  params: {
    category: string;
  };
};

export const dynamic = 'force-dynamic';

export default async function Category({ params: { category } }: Params) {
  const categories = (await getSectionCategories()) as Category[] | [];
  const cuisines = (await getSectionCuisines()) as Cuisine[] | [];

  const categoryRecipes = await getRecipesByCategoryAndCuisine(
    capitalizeFirstLetterOfEveryWord(slugToString(category))
  );
  const sortedRecipes = categoryRecipes.flatMap(
    (cuisine) => cuisine.recipes
  ) as Recipe[] | [];

  return (
    <LandingPage
      categories={categories}
      cuisines={cuisines}
      recipes={sortedRecipes}
    />
  );
}
