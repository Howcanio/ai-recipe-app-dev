'use server';

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export const addRecipe = async (recipe: Recipe) => {
  const generatedUUID = uuidv4();

  try {
    await sql`
      INSERT INTO recipe (
        id, query, name, history, history_image, meal_image, search_count, description, prep_time,
        cook_time, total_time, keywords, recipe_yield, recipe_category, recipe_cuisine,
        calories, recipe_ingredients, recipe_instructions, related_recipes
      )
      VALUES (
        ${generatedUUID},
        ${recipe.query},
        ${recipe.name},
        ${recipe.history},
        ${recipe.history_image},
        ${recipe.meal_image},
        ${recipe.search_count},
        ${recipe.description},
        ${recipe.prep_time},
        ${recipe.cook_time},
        ${recipe.total_time},
        ${recipe.keywords},
        ${recipe.recipe_yield},
        ${recipe.recipe_category},
        ${recipe.recipe_cuisine},
        ${recipe.calories},
        ARRAY[${recipe.recipe_ingredients as any}]::TEXT[],
        ARRAY[${recipe.recipe_instructions as any}]::TEXT[],
        ${JSON.stringify(recipe.related_recipes)}
      );`;

    console.log('Recipe added successfully');
    return generatedUUID;
  } catch (error) {
    console.error('Error adding recipe:', error);
    return null;
  }
};

export const getRecipeByQuery = async (query: string) => {
  try {
    const recipe = await sql`SELECT * FROM recipe WHERE query = ${query};`;
    console.log('Recipe received successfully');
    return recipe.rows.at(0);
  } catch (error) {
    console.error('Error receiving recipe:', error);
    return undefined;
  }
};

export const updateSearchCount = async (id: string) => {
  try {
    const recipe =
      await sql`UPDATE recipe SET search_count = search_count + 1 WHERE id = ${id};`;
    console.log('Search count updated successfully');
    return recipe.rows.at(0);
  } catch (error) {
    console.error('Error updating search count:', error);
    return null;
  }
};

export const getMostPopularRecipes = async () => {
  try {
    const recipes =
      await sql`SELECT * FROM recipe ORDER BY search_count DESC LIMIT 48;`;
    return recipes.rows;
  } catch (error) {
    console.error('Error Retrieving most popular recipes', error);
    return [];
  }
};

export const getMostRecentRecipes = async () => {
  try {
    const recipes =
      await sql`SELECT * FROM recipe ORDER BY created_at DESC LIMIT 48;`;
    return recipes.rows;
  } catch (error) {
    console.error('Error Retrieving most recent recipes', error);
    return [];
  }
};

export const getSitemapRecipes = async () => {
  try {
    const recipes = await sql`SELECT query, updated_at FROM recipe;`;
    console.log('Sitemap recipes received successfully');
    return recipes.rows;
  } catch (error) {
    console.error('Error receiving sitemap recipes:', error);
    return [];
  }
};

export const updateRecipeImages = async (
  query: string,
  historyImageUrl: string,
  mealImageUrl: string
) => {
  try {
    const result = await sql`
      UPDATE recipe
      SET history_image = ${historyImageUrl},
          meal_image = ${mealImageUrl}
      WHERE query = ${query}
      RETURNING *;`;
    if (result.rowCount === 0) {
      console.log(`No recipe found with the query ${query} to update.`);
      return { status: 'error', message: 'No recipe found to update.' };
    } else {
      console.log(`Recipe with query ${query} images updated successfully`);
      return {
        status: 'success',
        message: 'Recipe images updated successfully.',
        updatedRecipe: result.rows[0],
      };
    }
  } catch (error) {
    console.error('Error updating recipe images:', error);
    return { status: 'error', message: `Database error: ${error}` };
  }
};

export const getRecipeImagesByQuery = async (query: string) => {
  try {
    const result = await sql`
      SELECT history_image, meal_image
      FROM recipe
      WHERE query = ${query};`;
    if (result.rowCount === 0) {
      console.log(`No recipe found with the query ${query}.`);
      return {
        status: 'error',
        message: 'No recipe found with the provided query.',
      };
    } else if (!result.rows[0].history_image || !result.rows[0].meal_image) {
      console.log(`Recipe still has no images.`);
      return {
        status: 'error',
        message: 'Recipe still has no images.',
      };
    } else {
      console.log(`Recipe images retrieved successfully for query ${query}`);
      return {
        status: 'success',
        message: 'Recipe images retrieved successfully.',
        images: result.rows[0],
      };
    }
  } catch (error) {
    console.error('Error retrieving recipe images:', error);
    return { status: 'error', message: `Database error: ${error}` };
  }
};

export const getRecentCarouselRecipesByCategory = async (category: string) => {
  try {
    const recipes =
      await sql`SELECT * FROM recipe WHERE recipe_category = ${category} ORDER BY created_at DESC LIMIT 40;`;
    console.log(`${category} most recent recipes received successfully`);
    return recipes.rows;
  } catch (error) {
    console.error(`Error receiving ${category} most recent recipes:`, error);
    return [];
  }
};

export const getRecentCarouselRecipesByCuisine = async (cuisine: string) => {
  console.log(cuisine);
  try {
    const recipes =
      await sql`SELECT * FROM recipe WHERE recipe_cuisine = ${cuisine} ORDER BY created_at DESC LIMIT 40;`;
    console.log(`${cuisine} most recent recipes received successfully`);
    return recipes.rows;
  } catch (error) {
    console.error(`Error receiving ${cuisine} most recent recipes:`, error);
    return [];
  }
};

export const getRecentRecipesForCategoryByCuisine = async (
  category: string,
  cuisine: string
) => {
  try {
    const result = await sql`
    SELECT * FROM recipe WHERE recipe_category = ${category} AND recipe_cuisine = ${cuisine} ORDER BY created_at DESC LIMIT 100;`;
    return result.rows;
  } catch (error) {
    console.error(
      `Error fetching recent recipes for ${category} by ${cuisine}:`,
      error
    );
    return [];
  }
};

export const getPopularRecipesForCategoryByCuisine = async (
  category: string,
  cuisine: string
) => {
  try {
    const result = await sql`
     SELECT * FROM recipe WHERE recipe_category = ${category} AND recipe_cuisine = ${cuisine} ORDER BY search_count DESC LIMIT 100;`;
    return result.rows;
  } catch (error) {
    console.error(
      `Error fetching popular recipes for ${category} by ${cuisine}:`,
      error
    );
    return [];
  }
};

export const getRecentRecipesForCuisineByCategory = async (
  cuisine: string,
  category: string
) => {
  try {
    const result = await sql`
    SELECT * FROM recipe WHERE recipe_cuisine = ${cuisine} AND recipe_category = ${category} ORDER BY created_at DESC LIMIT 100;`;
    return result.rows;
  } catch (error) {
    console.error(
      `Error fetching recent recipes for ${cuisine} by ${category}:`,
      error
    );
    return [];
  }
};

export const getPopularRecipesForCuisineByCategory = async (
  cuisine: string,
  category: string
) => {
  try {
    const result = await sql`
     SELECT * FROM recipe WHERE recipe_cuisine = ${cuisine} AND recipe_category = ${category} ORDER BY search_count DESC LIMIT 100;`;
    return result.rows;
  } catch (error) {
    console.error(
      `Error fetching popular recipes for ${cuisine} by ${category}:`,
      error
    );
    return [];
  }
};
