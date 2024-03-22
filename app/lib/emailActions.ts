'use server';

import { sendEmail } from './sendgrid';
import WeeklyEmail from '../components/Emailing/emails/WeeklyEmail';
import { QueryResultRow } from '@vercel/postgres';
import RecipeReadyEmail from '../components/Emailing/emails/RecipeReadyEmail';
import {
  createSubscription,
  getCurrentEmailPopularRecipes,
  getCurrentEmailRecentRecipes,
  getMostPopularEmailRecipes,
  getMostRecentEmailRecipes,
  updateLastEmailed,
} from './emailDbActions';
import { render } from '@react-email/render';
import {
  recipeReadyEmailIntroText,
  weeklyNewsletterIntroText,
} from './gptActions';
import { getMostPopularRecipes, getMostRecentRecipes } from './dbActions';

export async function updateLastEmailedForRecipes(recipeIds: string[]) {
  const updatePromises = recipeIds.map((recipeId) =>
    updateLastEmailed(recipeId)
  );

  try {
    await Promise.all(updatePromises);
    console.log('Successfully updated last_emailed for all recipes');
  } catch (error) {
    console.error('Error updating last_emailed for recipes:', error);
  }
}

export const getCurrentEmailRecipes = async () => {
  try {
    const [popularRecipes, recentRecipes] = await Promise.all([
      getCurrentEmailPopularRecipes(),
      getCurrentEmailRecentRecipes(),
    ]);
    if (popularRecipes && recentRecipes)
      return { popularRecipes, recentRecipes };
    else return { popularRecipes: [], recentRecipes: [] };
  } catch (error) {
    console.error('Error fetching current email popular recipes:', error);
    return { popularRecipes: [], recentRecipes: [] };
  }
};

export const subscribeToNewsletter = async (email: string) => {
  try {
    const result = await createSubscription(email);
    if (
      result.status === 'success' &&
      result.action === 'resubscribe' &&
      result.subscriber
    ) {
      await sendResubscripstionEmail(result.subscriber);
    } else if (
      result.status === 'success' &&
      result.action === 'subscribe' &&
      result.subscriber
    ) {
      await sendWelcomeEmail(result.subscriber);
    }
    return result;
  } catch (error) {
    console.error('Error creating new subscription', error);
    return { status: 'error', message: 'Error creating new subscription' };
  }
};

export async function getWeeklyEmailData() {
  const recentRecipes = (await getCurrentEmailRecentRecipes()) as Recipe[] | [];
  const popularRecipes = (await getCurrentEmailPopularRecipes()) as
    | Recipe[]
    | [];

  const popularEmailRecipeList = [
    ...popularRecipes.map((recipe) => recipe.name),
  ];
  const recentEmailRecipeList = [...recentRecipes.map((recipe) => recipe.name)];
  const text = await weeklyNewsletterIntroText(
    recentEmailRecipeList,
    popularEmailRecipeList
  );
  return { recentRecipes, popularRecipes, text };
}

export async function getRecipeReadyEmailData(generatedRecipe: Recipe) {
  let recentRecipes = (await getMostRecentRecipes()) as Recipe[] | [];
  let popularRecipes = (await getMostPopularRecipes()) as Recipe[] | [];

  // Filter out the generatedRecipe from both recentRecipes and popularRecipes
  recentRecipes = recentRecipes.filter(
    (recipe) => recipe.id !== generatedRecipe.id
  );
  popularRecipes = popularRecipes.filter(
    (recipe) => recipe.id !== generatedRecipe.id
  );

  const shuffledPopularRecipes = popularRecipes
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, 3);

  const shuffledRecentRecipes = recentRecipes
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, 3);

  const popularEmailRecipeList = shuffledPopularRecipes.map(
    (recipe) => recipe.name
  );
  const recentEmailRecipeList = shuffledRecentRecipes.map(
    (recipe) => recipe.name
  );

  const text = await recipeReadyEmailIntroText(
    generatedRecipe.name,
    recentEmailRecipeList,
    popularEmailRecipeList
  );

  return {
    recentRecipes: shuffledRecentRecipes,
    popularRecipes: shuffledPopularRecipes,
    text,
  };
}

export async function sendWelcomeEmail(subscriber: QueryResultRow) {
  const { recentRecipes, popularRecipes, text } = await getWeeklyEmailData();
  const emailHtml = render(
    WeeklyEmail({
      unsubscribe_token: subscriber.unsubscribe_token,
      recentRecipes: recentRecipes,
      popularRecipes: popularRecipes,
      introText: text,
      title:
        'Welcome to Your Weekly Digest - Unveiling Fresh Insights Every Week!',
    })
  );
  try {
    await sendEmail({
      to: subscriber.email,
      subject: 'Hello from Howcan.io',
      text: 'Welcome to our weekly newsletter. Check out our weekly selection.',
      html: emailHtml,
      name: 'Welcome to Howcan.io',
    });
    console.log(`Email sent to ${subscriber.email}`);
  } catch (error) {
    console.error(`Error sending email to ${subscriber.email}:`, error);
  }
}
export async function sendResubscripstionEmail(subscriber: QueryResultRow) {
  const { recentRecipes, popularRecipes, text } = await getWeeklyEmailData();
  const emailHtml = render(
    WeeklyEmail({
      unsubscribe_token: subscriber.unsubscribe_token,
      recentRecipes: recentRecipes,
      popularRecipes: popularRecipes,
      introText: text,
      title: 'Back for More? Your Weekly Digest Awaits with Open Arms!',
    })
  );
  try {
    await sendEmail({
      to: subscriber.email,
      subject: 'Welcome back to Howcan.io',
      text: 'Welcome back to our weekly newsletter. This week selection you almost missed.',
      html: emailHtml,
      name: 'Welcome back to Howcan.io',
    });
    console.log(`Email sent to ${subscriber.email}`);
  } catch (error) {
    console.error(`Error sending email to ${subscriber.email}:`, error);
  }
}

export async function sendRecipeReadyEmail(
  subscriber: QueryResultRow,
  recipe: Recipe
) {
  const { recentRecipes, popularRecipes, text } = await getRecipeReadyEmailData(
    recipe
  );
  const emailHtml = render(
    RecipeReadyEmail({
      unsubscribe_token: subscriber.unsubscribe_token,
      introText: text,
      generatedRecipe: recipe,
      recentRecipes: recentRecipes,
      popularRecipes: popularRecipes,
    })
  );
  try {
    await sendEmail({
      to: subscriber.email,
      subject: `Your ${recipe.name} is ready!`,
      text: 'Your Recipe Is Ready to Savor!',
      html: emailHtml,
      name: 'Recipe ready!',
    });
    console.log(`Email sent to ${subscriber.email}`);
  } catch (error) {
    console.error(`Error sending email to ${subscriber.email}:`, error);
  }
}

export default async function sendWeeklyEmails(
  subscribers: QueryResultRow[],
  recentRecipes: Recipe[] | [],
  popularRecipes: Recipe[] | [],
  introText: string
) {
  for (const subscriber of subscribers) {
    const emailHtml = render(
      WeeklyEmail({
        unsubscribe_token: subscriber.unsubscribe_token,
        recentRecipes: recentRecipes,
        popularRecipes: popularRecipes,
        introText: introText,
        title: 'Your Weekly Digest',
      })
    );
    try {
      await sendEmail({
        to: subscriber.email,
        subject: 'Weekly newsletter from Howcan.io',
        text: 'Selection of our finest recipes this week!',
        html: emailHtml,
        name: 'Weekly Recipes',
      });
      console.log(`Email sent to ${subscriber.email}`);
    } catch (error) {
      console.error(`Error sending email to ${subscriber.email}:`, error);
    }
  }
}
