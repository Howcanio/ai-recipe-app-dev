'use client';

import { Card, Image } from '@nextui-org/react';
import Link from 'next/link';
import MealInfo from '@/app/recipe/[recipeQuery]/components/MealInfo';
import { yanone } from '@/app/assets/fonts/fonts';

export default function ThreeRecipeSection({
  recipes,
  className,
}: {
  recipes: Recipe[] | [];
  className?: string;
}) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  return (
    recipes.length > 0 && (
      <section className={`flex gap-12 w-full ${className}`}>
        <div className={`w-1/2 flex flex-col gap-4`}>
          <Link href={`/recipe/${recipes[0].query}`} shallow={true}>
            <Image
              alt={recipes[0].name}
              src={imageBaseUrl + recipes[0].history_image}
              width={400}
              height={400}
            />
          </Link>
          <h3 className='font-bold text-xl'>{recipes[0].name}</h3>
          <MealInfo
            totalTime={recipes[0].total_time}
            recipeYield={recipes[0].recipe_yield}
            calories={recipes[0].calories.slice(0, 12)}
            className='w-full text-sm justify-start p-1 border border-dashed border-gray-500 rounded-10'
          />
          <p>{recipes[0].history.slice(0, 400)}...</p>
        </div>
        <div className='w-1/2 flex flex-col gap-4'>
          {recipes.slice(1, 4).map((recipe) => (
            <div key={recipe.id} className='flex flex-col gap-4'>
              <Card className='flex flex-col gap-4 p-4'>
                <div className='flex flex-row gap-4'>
                  <Link
                    href={`/recipe/${recipe.query}`}
                    shallow={true}
                    className='flex w-2/5'
                  >
                    <Image
                      alt={recipe.name}
                      src={
                        imageBaseUrl +
                        (recipe.meal_image || recipe.history_image)
                      }
                      width={400}
                      className='object-cover'
                    />
                  </Link>
                  <div className='flex flex-col gap-2 w-3/5'>
                    <h3 className={`font-bold text-xl ${yanone.className}`}>
                      {recipe.name}
                    </h3>
                    <p className='text-xs'>{recipe.description}</p>
                  </div>
                </div>
                <MealInfo
                  totalTime={recipe.total_time}
                  recipeYield={recipe.recipe_yield}
                  calories={recipe.calories.slice(0, 12)}
                  className='w-full text-xs md:gap-2 justify-start'
                />
              </Card>
            </div>
          ))}
        </div>
      </section>
    )
  );
}
