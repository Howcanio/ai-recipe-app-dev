'use client';

import { Image } from '@nextui-org/react';
import useWindowSize from '@/app/hooks/useWindowSize';
import MealInfo from '@/app/recipe/[recipeQuery]/components/MealInfo';
import Link from 'next/link';
import { yanone } from '@/app/assets/fonts/fonts';

export default function OneRecipeSection({
  className,
  recipe,
}: {
  className?: string;
  recipe: Recipe;
}) {
  const { isMobile } = useWindowSize();
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Link href={`/recipe/${recipe.query}`} shallow={true} className='mx-auto'>
        <Image
          alt={recipe.name}
          src={imageBaseUrl + (recipe.meal_image || recipe.history_image)}
          width={350}
        />
      </Link>
      <h3 className={`font-bold text-2xl ${yanone.className}`}>
        {recipe.name}
      </h3>
      <p className='border-b-1 border-gray-400 pb-2'>{recipe.description}</p>
      <MealInfo
        totalTime={recipe.total_time}
        recipeYield={recipe.recipe_yield}
        calories={isMobile ? recipe.calories.slice(0, 12) : recipe.calories}
        className='w-full text-sm border-b-1 border-dashed border-gray-400 pb-4'
      />
    </div>
  );
}
