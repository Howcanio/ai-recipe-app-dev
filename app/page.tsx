import { getMostRecentRecipes } from './lib/dbActions';
import LandingPage from './components/LandingPage';
import {
  getSectionCategories,
  getSectionCuisines,
} from './lib/mealTypeActions';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const recipes = (await getMostRecentRecipes()) as Recipe[] | [];
  const categories = (await getSectionCategories()) as Category[] | [];
  const cuisines = (await getSectionCuisines()) as Cuisine[] | [];
  return (
    <LandingPage
      cuisines={cuisines}
      categories={categories}
      recipes={recipes}
    />
  );
}
