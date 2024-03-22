'use server';

import { getOrCreateRecipePreview, processRecipeDetails } from './gptActions';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processRecipeQuery(meal: string) {
  console.log(`Processing recipe meal: ${meal}`);
  const result = await getOrCreateRecipePreview(meal, false);
  console.log(result.message);
  const recipe = result.recipe;
  const res = await processRecipeDetails(recipe, undefined);
  console.log(res.message);
}

export async function processQueriesWithDelay(queries: string[]) {
  console.log('STARTED!');
  for (const query of queries) {
    await processRecipeQuery(query);
    await delay(60000);
  }
  console.log('All queries have been processed.');
}
