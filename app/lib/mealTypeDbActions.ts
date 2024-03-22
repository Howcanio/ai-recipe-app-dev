'use server';

import { sql } from '@vercel/postgres';

export const getCuisineImages = async () => {
  try {
    const result = await sql`
     SELECT DISTINCT ON (recipe_cuisine) recipe_cuisine, meal_image, search_count
     FROM recipe
     ORDER BY recipe_cuisine, search_count DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching cuisine images: ', error);
    return [];
  }
};

export const getCategoryImages = async () => {
  try {
    const result = await sql`
     SELECT DISTINCT ON (recipe_category) recipe_category, meal_image, search_count
     FROM recipe
     ORDER BY recipe_category, search_count DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching category images: ', error);
    return [];
  }
};

export const getAllCuisinesByPopularity = async () => {
  try {
    const result = await sql`
     SELECT recipe_cuisine, SUM(search_count) AS total_search_count
     FROM recipe
     GROUP BY recipe_cuisine
     ORDER BY total_search_count DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching cuisines by popularity:', error);
    return [];
  }
};

export const getAllCuisinesByRecency = async () => {
  try {
    const result = await sql`
     SELECT recipe_cuisine, MAX(created_at) AS most_recent_creation_date
     FROM recipe
     GROUP BY recipe_cuisine
     ORDER BY most_recent_creation_date DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching cuisines by recency:', error);
    return [];
  }
};

export const getAllCategoriesByPopularity = async () => {
  try {
    const result = await sql`
     SELECT recipe_category, SUM(search_count) AS total_search_count
     FROM recipe
     GROUP BY recipe_category
     ORDER BY total_search_count DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories by popularity:', error);
    return [];
  }
};

export const getAllCategoriesByRecency = async () => {
  try {
    const result = await sql`
     SELECT recipe_category, MAX(created_at) AS most_recent_creation_date
     FROM recipe
     GROUP BY recipe_category
     ORDER BY most_recent_creation_date DESC;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories by recency:', error);
    return [];
  }
};

export const getLimitedCategoriesByPopularity = async () => {
  try {
    const result = await sql`
     SELECT recipe_category, SUM(search_count) AS total_search_count
     FROM recipe
     GROUP BY recipe_category
     ORDER BY total_search_count DESC
     LIMIT 5;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching limited categories by popularity:', error);
    return [];
  }
};

export const getLimitedCuisinesByPopularity = async () => {
  try {
    const result = await sql`
     SELECT recipe_cuisine, SUM(search_count) AS total_search_count
     FROM recipe
     GROUP BY recipe_cuisine
     ORDER BY total_search_count DESC
     LIMIT 5;`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching limited cuisines by popularity:', error);
    return [];
  }
};

export const getAllCuisinesByCategory = async (category: string) => {
  try {
    const result = await sql`
     SELECT DISTINCT recipe_cuisine FROM recipe WHERE recipe_category = ${category};`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching cuisines by category:', error);
    return [];
  }
};

export const getAllCategoriesByCuisine = async (cuisine: string) => {
  try {
    const result = await sql`
     SELECT DISTINCT recipe_category FROM recipe WHERE recipe_cuisine = ${cuisine};`;
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories by cuisine:', error);
    return [];
  }
};
