'use server';

import {
  getPopularRecipesForCategoryByCuisine,
  getPopularRecipesForCuisineByCategory,
  getRecentRecipesForCategoryByCuisine,
  getRecentRecipesForCuisineByCategory,
} from './dbActions';
import {
  getAllCategoriesByCuisine,
  getAllCategoriesByPopularity,
  getAllCuisinesByCategory,
  getAllCuisinesByPopularity,
  getCategoryImages,
  getCuisineImages,
  getLimitedCategoriesByPopularity,
  getLimitedCuisinesByPopularity,
} from './mealTypeDbActions';

export const getSectionCuisines = async () => {
  const [popularCuisines, cuisineImages] = await Promise.all([
    getLimitedCuisinesByPopularity(),
    getCuisineImages(),
  ]);
  if (popularCuisines.length > 0 && cuisineImages.length > 0) {
    const cuisines = [
      ...popularCuisines.map((recipe) => ({
        name: recipe.recipe_cuisine,
        image_url: cuisineImages.find(
          (cuisine) => cuisine.recipe_cuisine === recipe.recipe_cuisine
        )?.meal_image,
      })),
    ];
    return cuisines;
  } else {
    return [];
  }
};

export const getSectionCategories = async () => {
  const [popularCategories, categoryImages] = await Promise.all([
    getLimitedCategoriesByPopularity(),
    getCategoryImages(),
  ]);
  if (popularCategories.length > 0 && categoryImages.length > 0) {
    const categories = [
      ...popularCategories.map((recipe) => ({
        name: recipe.recipe_category,
        image_url: categoryImages.find(
          (category) => category.recipe_category === recipe.recipe_category
        )?.meal_image,
      })),
    ];
    return categories;
  } else {
    return [];
  }
};

export const getAllCategories = async () => {
  const [popularCategories, categoryImages] = await Promise.all([
    getAllCategoriesByPopularity(),
    getCategoryImages(),
  ]);
  if (popularCategories.length > 0 && categoryImages.length > 0) {
    const categories = [
      ...popularCategories.map((recipe) => ({
        name: recipe.recipe_category,
        image_url: categoryImages.find(
          (category) => category.recipe_category === recipe.recipe_category
        )?.meal_image,
      })),
    ];
    return categories;
  } else {
    return [];
  }
};

export const getAllCuisines = async () => {
  const [popularCuisines, cuisineImages] = await Promise.all([
    getAllCuisinesByPopularity(),
    getCuisineImages(),
  ]);
  if (popularCuisines.length > 0 && cuisineImages.length > 0) {
    const cuisines = [
      ...popularCuisines.map((recipe) => ({
        name: recipe.recipe_cuisine,
        image_url: cuisineImages.find(
          (cuisine) => cuisine.recipe_cuisine === recipe.recipe_cuisine
        )?.meal_image,
      })),
    ];
    return cuisines;
  } else {
    return [];
  }
};

export async function getRecipesByCategoryAndCuisine(category: string) {
  try {
    // Get distinct cuisines for the category
    const cuisines = await getAllCuisinesByCategory(category);

    const recipesByCuisine = await Promise.all(
      cuisines.map(async ({ recipe_cuisine }) => {
        // Fetch most popular recipes for this cuisine within the category
        const popularRecipes = await getPopularRecipesForCategoryByCuisine(
          category,
          recipe_cuisine
        );

        // Fetch most recent recipes for this cuisine within the category
        const recentRecipes = await getRecentRecipesForCategoryByCuisine(
          category,
          recipe_cuisine
        );

        // Combine and filter out duplicates
        const allRecipes = [...popularRecipes, ...recentRecipes];
        const uniqueRecipes = allRecipes.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );

        // Optionally, you can further slice the array to ensure only 4 recipes per cuisine if needed
        // This step depends on how you want to handle more than 4 recipes after deduplication
        const slicedRecipes = uniqueRecipes.slice(0, 4);

        return {
          cuisine: recipe_cuisine,
          recipes: slicedRecipes,
        };
      })
    );

    // Filter out cuisines that do not meet the recipe count criteria if needed
    const filteredRecipesByCuisine = recipesByCuisine.filter(
      (cuisine) => cuisine.recipes.length === 4 // or whatever your criteria is
    );

    return filteredRecipesByCuisine;
  } catch (error) {
    console.error(`Error fetching recipes by category and cuisine:`, error);
    return [];
  }
}

export async function getRecipesByCuisineAndCategory(cuisine: string) {
  try {
    const categories = await getAllCategoriesByCuisine(cuisine);

    const recipesByCategory = await Promise.all(
      categories.map(async ({ recipe_category }) => {
        const popularRecipes = await getPopularRecipesForCuisineByCategory(
          cuisine,
          recipe_category
        );
        const recentRecipes = await getRecentRecipesForCuisineByCategory(
          cuisine,
          recipe_category
        );

        const allRecipes = [...popularRecipes, ...recentRecipes];
        const uniqueRecipes = allRecipes.filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );

        const slicedRecipes = uniqueRecipes.slice(0, 4);

        return {
          category: recipe_category,
          recipes: slicedRecipes,
        };
      })
    );
    const filteredRecipesByCategory = recipesByCategory.filter(
      (category) => category.recipes.length === 4
    );

    return filteredRecipesByCategory;
  } catch (error) {
    console.error(`Error fetching recipes by cuisine and category:`, error);
    return [];
  }
}
