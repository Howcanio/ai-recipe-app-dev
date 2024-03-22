'use server';

import { sql } from '@vercel/postgres';

export const addPrompt = async (prompt: Prompt) => {
  try {
    await sql`
     INSERT INTO prompts (name, value, description) VALUES (${prompt.name}, ${prompt.value}, ${prompt.description});`;
    console.log('Prompt added successfully');
    return { status: 'success', message: 'Prompt added successfully' };
  } catch (error) {
    console.error('Error adding prompt:', error);
    return { status: 'error', message: 'Error adding prompt' };
  }
};

export const getPromptByName = async (name: string) => {
  try {
    const result = await sql`
      SELECT * FROM prompts WHERE name = ${name};
    `;

    if (result.rows.length > 0) {
      // console.log('Prompt retrieved successfully:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log('No prompt found with the name:', name);
      return null;
    }
  } catch (error) {
    console.error('Error retrieving prompt:', error);
    return null;
  }
};

export const updatePrompt = async (prompt: Prompt) => {
  try {
    await sql`
      UPDATE prompts
      SET value = ${prompt.value}, description = ${prompt.description}
      WHERE name = ${prompt.name};`;
    console.log('Prompt updated successfully');
    return { status: 'success', message: 'Prompt updated successfully' };
  } catch (error) {
    console.error('Error updating prompt:', error);
    return { status: 'error', message: 'Error updating prompt' };
  }
};

export const getAllPrompts = async () => {
  try {
    const result = await sql`SELECT * FROM prompts;`;
    console.log('Prompts retrieved successfully');
    return result.rows;
  } catch (error) {
    console.error('Error retrieving prompts:', error);
    return [];
  }
};
