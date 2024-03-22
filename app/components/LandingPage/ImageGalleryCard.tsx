'use client';

import { yanone } from '@/app/assets/fonts/fonts';
import { convertISO8601ToReadable } from '@/app/lib/parsers';
import { Card, CardBody, Image } from '@nextui-org/react';
import Link from 'next/link';

export default function RecipeListCard({
  recipe,
  className,
  cardBodyStyles,
  imageStyles,
  recipeCuisine,
  cookingTime,
}: {
  recipe: Recipe;
  className?: string;
  cardBodyStyles?: string;
  imageStyles?: string;
  recipeCuisine: boolean;
  cookingTime: boolean;
}) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  const parsedTotalTime = convertISO8601ToReadable(recipe.total_time);
  return (
    <Link
      href={`/recipe/${recipe.query}`}
      shallow={true}
      className={`w-full ${className}`}
    >
      <Card className={`w-full h-full`} isPressable>
        <CardBody
          className={`overflow-hidden flex flex-row items-center gap-4 ${cardBodyStyles}`}
        >
          <Image
            alt='Card background'
            className={`object-contain rounded-lg ${imageStyles}`}
            src={imageBaseUrl + (recipe.meal_image || recipe.history_image)}
            width={1024}
            height={1024}
          />
          <div className={`w-full flex flex-col gap-2 px-2 text-sm`}>
            <p className={`font-bold text-start text-xl ${yanone.className}`}>
              {recipe.name.slice(0, 27)}
            </p>
            {recipeCuisine && (
              <div className='flex items-center gap-2 text-gray-600 font-medium'>
                <p className='text-xs text-center p-1 border-1 border-gray-600 rounded-10'>
                  {recipe.recipe_category}
                </p>
                <p className='text-xs text-center p-1 border-1 border-gray-600 rounded-10'>
                  {recipe.recipe_cuisine}
                </p>
              </div>
            )}
            {cookingTime && (
              <div className='font-medium opacity-80 h-full text-sm border-t-1 border-gray-500 border-dashed pt-2.5'>
                Cooking time: {parsedTotalTime}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
