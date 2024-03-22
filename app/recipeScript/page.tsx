import { processQueriesWithDelay } from '../lib/createRecipesScript';
import { parseRecipesCsv } from '../lib/csvParsers';

export const dynamic = 'force-dynamic';

export default async function page() {
  const recipes = await parseRecipesCsv();
  await processQueriesWithDelay(recipes.slice(0, 75));
  return <div>Recipe Script running</div>;
}
