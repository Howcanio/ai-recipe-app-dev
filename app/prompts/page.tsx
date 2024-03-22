import { addPrompt, getAllPrompts } from '../lib/promptDbActions';
import PromptList from './components/PromptList';

export const dynamic = 'force-dynamic';

export default async function Prompts() {
  // const prompt = {
  //   name: 'Recipe Ready Intro Text Prompt',
  //   description:
  //     'Prompt that generates intro text for specific recipe when fully created for email',
  //   value: `
  //      Craft a captivating and brief intro for our weekly recipe reveal, limited to 50 words, sprinkled with emojis for an extra touch of fun. Highlight this week's star: $\{generatedRecipe}. Include a nod to our latest culinary delights: three recent recipes (\${recentRecipes}) and three fan favorites (\${popularRecipes}). Let's ignite enthusiasm and curiosity for this week's gourmet adventure, showcasing our latest creation alongside our beloved selections.
  // `,
  // };
  // const res = await addPrompt(prompt);
  // console.log(res);
  const prompts = (await getAllPrompts()) as Prompt[] | [];
  return <PromptList prompts={prompts} className='p-8' />;
}
