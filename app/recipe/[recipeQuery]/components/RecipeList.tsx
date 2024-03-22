'use client';

import { yanone } from '@/app/assets/fonts/fonts';
import RecipeListCard from './RecipeListCard';
import { capitalizeFirstLetterOfEveryWord } from '@/app/lib/parsers';

export default function RecipeList({
  className,
  listType,
  recipes,
}: {
  className?: string;
  listType: 'popular' | 'recent';
  recipes: Recipe[] | [];
}) {
  if (recipes.length > 0)
    return (
      <section
        className={`hidden md:flex flex-col gap-4 md:gap-8 py-8 px-10 lg:px-0 ${className}`}
      >
        <div
          className={`text-xl md:text-3xl font-bold mx-auto bg-white p-2 rounded-10 max-w-max ${yanone.className}`}
        >
          {capitalizeFirstLetterOfEveryWord(listType)} recipes
        </div>
        <div className='flex flex-col items-center justify-center flex-wrap gap-4'>
          {recipes.slice(0, 3).map((recipe) => (
            <RecipeListCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    );
}
