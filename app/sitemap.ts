import { getSitemapRecipes } from './lib/dbActions';
import { getAllCategories, getAllCuisines } from './lib/mealTypeActions';
import { stringToSlug } from './lib/parsers';

export const dynamic = 'force-dynamic';

type ChangeFrequency = 'daily' | 'weekly' | 'monthly';

// Function to determine change frequency based on the last modified date
function determineChangeFrequency(
  lastModified: string | Date
): ChangeFrequency {
  const currentDate = new Date();
  const lastModifiedDate = new Date(lastModified);
  const differenceInDays =
    (currentDate.getTime() - lastModifiedDate.getTime()) / (1000 * 3600 * 24);

  if (differenceInDays <= 7) {
    return 'daily';
  } else if (differenceInDays <= 30) {
    return 'weekly';
  } else {
    return 'monthly';
  }
}

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const recipes = await getSitemapRecipes();
  const cuisines = (await getAllCuisines()) as Category[] | [];
  const categories = (await getAllCategories()) as Category[] | [];
  if (recipes && cuisines && categories) {
    const recipesUrls = recipes.map((recipe) => ({
      url: `${baseUrl}/recipe/${recipe.query}`,
      lastModified: recipe.updated_at,
      changeFrequency: determineChangeFrequency(recipe.updated_at),
      priority: 1,
    }));
    const cuisinesUrls = cuisines.map((cuisine) => ({
      url: `${baseUrl}/cuisine/${stringToSlug(cuisine.name)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }));
    const categoriesUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${stringToSlug(category.name)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      },
      {
        url: `${baseUrl}/recipe`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...recipesUrls,
      ...cuisinesUrls,
      ...categoriesUrls,
    ];
  } else {
    return null;
  }
}
