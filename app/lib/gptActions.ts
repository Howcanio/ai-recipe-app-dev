'use server';

import { openai } from './gptConfig';
import {
  addRecipe,
  getRecipeByQuery,
  updateRecipeImages,
  updateSearchCount,
} from './dbActions';
import { processImage } from './s3Actions';
import { appendIngredientsToCSV } from './s3Actions';
import { stringToSlug, substitutePlaceholders } from './parsers';
import { sendRecipeReadyEmail } from './emailActions';
import { getActiveSubscriberByEmail } from './emailDbActions';
import { getPromptByName } from './promptDbActions';

export async function filterMeals(meal: string, adjustment: boolean) {
  const prompt = adjustment
    ? ((await getPromptByName('Filter Adjusted Meals Prompt')) as Prompt | null)
    : ((await getPromptByName('Filter Meals Prompt')) as Prompt | null);
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, {
      meal: meal,
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 1000,
    });
    return response.choices[0].message.content;
  } else return '';
}

export async function weeklyNewsletterIntroText(
  recentRecipes: string[] | [],
  popularRecipes: string[] | []
) {
  const prompt = (await getPromptByName(
    'Newsletter Intro Text Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, {
      recentRecipes: recentRecipes.join(', '),
      popularRecipes: popularRecipes.join(', '),
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
  } else return '';
}

export async function recipeReadyEmailIntroText(
  generatedRecipe: string,
  recentRecipes: string[] | [],
  popularRecipes: string[] | []
) {
  const prompt = (await getPromptByName(
    'Recipe Ready Intro Text Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, {
      generatedRecipe: generatedRecipe,
      recentRecipes: recentRecipes.join(', '),
      popularRecipes: popularRecipes.join(', '),
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 1000,
    });
    return response.choices[0].message.content || '';
  } else return '';
}

async function getRecipe(meal: string) {
  const prompt = (await getPromptByName(
    'Create Recipe Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, { meal: meal });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 1000,
    });
    return response.choices[0].message.content;
  } else return '';
}

export async function getHistory(meal: string) {
  const prompt = (await getPromptByName(
    'Meal History Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, { meal: meal });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: parsedPrompt },
        { role: 'user', content: meal },
      ],
      temperature: 0,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } else return '';
}

async function getRelatedRecipes(meal: string) {
  const prompt = (await getPromptByName(
    'Related Recipes Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedPrompt = substitutePlaceholders(prompt.value, { meal: meal });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } else return '';
}

async function getImagePrompt(meal: string) {
  const prompt = (await getPromptByName(
    'Image Prompt Generation System Prompt'
  )) as Prompt | null;
  if (prompt) {
    const parsedSystemPrompt = substitutePlaceholders(prompt.value, {
      meal: meal,
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: parsedSystemPrompt },
        { role: 'user', content: meal },
      ],
      temperature: 0,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } else return '';
}

async function getImage(
  name: string,
  imageType: ImageType,
  ingredients?: string[],
  history?: string
) {
  const [imagePromptGenerationPrompt, imagePromptDetails, imagePrompt] =
    await Promise.all([
      getImagePrompt(name),
      getPromptByName('Image Prompt Details Prompt'),
      getPromptByName(`${imageType} Image Prompt`),
    ]);
  if (imagePromptGenerationPrompt && imagePromptDetails && imagePrompt) {
    const parsedImagePromptDetails = substitutePlaceholders(
      imagePromptDetails.value,
      {
        prompt: imagePromptGenerationPrompt,
      }
    );
    let parsedImagePrompt = undefined;
    if (imageType === 'Meal' && ingredients) {
      const ingredientsString = ingredients.join(', ');
      parsedImagePrompt = substitutePlaceholders(imagePrompt.value, {
        meal: name,
        promptDetails: parsedImagePromptDetails,
        ingredients: ingredientsString,
      });
    } else if (imageType === 'History' && history) {
      parsedImagePrompt = substitutePlaceholders(imagePrompt.value, {
        meal: name,
        promptDetails: parsedImagePromptDetails,
        history: history,
      });
    }
    if (parsedImagePrompt) {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: parsedImagePrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      });
      if (response.data[0].b64_json) {
        const fileName = await processImage(response.data[0].b64_json, name);
        return fileName;
      } else return null;
    } else return null;
  } else return null;
}

export async function extractMainIngredients(ingredients: string[]) {
  const prompt = (await getPromptByName(
    'Extract Main Ingredients Prompt'
  )) as Prompt | null;
  if (prompt) {
    const ingredientsString = ingredients.join(', ');
    const parsedPrompt = substitutePlaceholders(prompt.value, {
      ingredients: ingredientsString,
    });
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: parsedPrompt }],
      temperature: 0,
      max_tokens: 200,
    });
    return response.choices[0].message.content;
  } else return '';
}

export async function getOrCreateRecipePreview(
  meal: string,
  adjustment: boolean
) {
  try {
    const filterQuery = await filterMeals(meal, adjustment);
    if (filterQuery) {
      const filterQueryParsed = JSON.parse(filterQuery);
      if (filterQueryParsed.isMeal) {
        const query = filterQueryParsed.inputWithoutTypos.toLowerCase();
        const slug = stringToSlug(query);
        const existingRecipe = await getRecipeByQuery(slug);
        if (!existingRecipe) {
          const recipePromise = getRecipe(query);
          const historyPromise = getHistory(query);
          const relatedPromise = getRelatedRecipes(query);

          const [recipeResult, historyResult, relatedResult] =
            await Promise.all([recipePromise, historyPromise, relatedPromise]);

          if (recipeResult && historyResult && relatedResult) {
            const recipe = {
              ...JSON.parse(recipeResult),
              history: historyResult,
              query: slug,
              search_count: 1,
              related_recipes: JSON.parse(relatedResult),
            };
            const uuid = await addRecipe(recipe);
            return {
              status: 'success',
              message: 'Recipe preview created successfully',
              recipe: { ...recipe, id: uuid },
            };
          } else {
            return {
              status: 'error',
              message: 'Unable to fetch all necessary data.',
              recipe: null,
            };
          }
        } else {
          await updateSearchCount(existingRecipe.id);
          return {
            status: 'redirect',
            message: `${slug} already exists.`,
            recipe: existingRecipe,
          };
        }
      } else {
        return {
          status: 'error',
          message: 'Input cannot be interpreted as a meal.',
          recipe: null,
        };
      }
    } else {
      return {
        status: 'error',
        message: 'No filter query results.',
        recipe: null,
      };
    }
  } catch (error) {
    return { status: 'error', message: `Server error: ${error}`, recipe: null };
  }
}

export async function processRecipeDetails(
  recipe: Recipe,
  email: string | undefined
) {
  try {
    const [historyImageResult, mealImageResult] = await Promise.all([
      getImage(recipe.name, 'History', undefined, recipe.history),
      getImage(recipe.name, 'Meal', recipe.recipe_ingredients, undefined),
    ]);
    if (historyImageResult && mealImageResult) {
      const res = await extractMainIngredients(recipe.recipe_ingredients);
      if (res) {
        try {
          const parsedIngredients = JSON.parse(res);
          appendIngredientsToCSV(parsedIngredients);
        } catch (error) {
          console.error('Error parsing ingredients JSON:', error);
        }
      }
      // Updating recipe images
      await updateRecipeImages(
        recipe.query,
        historyImageResult,
        mealImageResult
      );
      // Sending email if subscriber
      if (email) {
        const generatedRecipe = {
          ...recipe,
          meal_image: mealImageResult,
          history_image: historyImageResult,
        };
        const subscriber = await getActiveSubscriberByEmail(email);
        if (subscriber) await sendRecipeReadyEmail(subscriber, generatedRecipe);
      }
      return {
        status: 'success',
        message: 'Recipe details processed successfully.',
      };
    } else {
      return { status: 'error', message: 'Failed to generate images.' };
    }
  } catch (error) {
    console.error('Error in processRecipeDetails:', error);
    return { status: 'error', message: `Server error: ${error}` };
  }
}
