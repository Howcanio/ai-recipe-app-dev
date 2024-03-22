import sendWeeklyEmails, {
  updateLastEmailedForRecipes,
} from '@/app/lib/emailActions';
import {
  getAllActiveSubscribers,
  getMostPopularEmailRecipes,
  getMostRecentEmailRecipes,
} from '@/app/lib/emailDbActions';
import { weeklyNewsletterIntroText } from '@/app/lib/gptActions';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Cron Job Started');
  // Last number of months that the recipe was not sent in an email
  const numberOfMonths = 3;
  // Getting recipes from db
  const mostPopularEmailRecipes = (await getMostPopularEmailRecipes(
    numberOfMonths
  )) as Recipe[] | [];
  const mostRecentEmailRecipes = (await getMostRecentEmailRecipes(
    numberOfMonths
  )) as Recipe[] | [];
  // All ids to update in db so they are not sent in the next number of months
  const allRecipeIdsToUpdate = [
    ...mostPopularEmailRecipes.map((recipe) => recipe.id),
    ...mostRecentEmailRecipes.map((recipe) => recipe.id),
  ];

  const mostPopularEmailRecipeList = [
    ...mostPopularEmailRecipes.map((recipe) => recipe.name),
  ];
  const mostRecentEmailRecipeList = [
    ...mostRecentEmailRecipes.map((recipe) => recipe.name),
  ];
  const text = await weeklyNewsletterIntroText(
    mostRecentEmailRecipeList,
    mostPopularEmailRecipeList
  );

  // Subscribers that are active
  const subscribers = await getAllActiveSubscribers();
  await sendWeeklyEmails(
    subscribers,
    mostRecentEmailRecipes,
    mostPopularEmailRecipes,
    text
  );
  // Update the last emailed
  await updateLastEmailedForRecipes(allRecipeIdsToUpdate);
  // @ts-ignore
  return Response.json({ message: 'Email Sent!' });
}
