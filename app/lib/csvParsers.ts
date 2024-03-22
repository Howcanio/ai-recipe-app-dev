'use server';

import fs from 'fs/promises';
import path from 'path';

export async function parseRecipesCsv(): Promise<string[]> {
  try {
    // Adjust the CSV file path according to your project structure
    const csvFilePath = path.join(process.cwd(), 'public', 'recipe-list.csv');
    const csvContent = await fs.readFile(csvFilePath, { encoding: 'utf-8' });

    // Split the CSV content by new lines to get each recipe name
    const recipeNames = csvContent.split('\n').map((line) => line.trim());

    return recipeNames.filter((name) => name !== '');
  } catch (err) {
    console.error('Error processing the CSV file:', err);
    return [];
  }
}
