'use client';

import { yanone } from '@/app/assets/fonts/fonts';
import { Card, CardBody, Image } from '@nextui-org/react';
import Link from 'next/link';

export default function RecipeListCard({
  recipe,
  className,
}: {
  recipe: Recipe;
  className?: string;
}) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  return (
    <Link href={`/recipe/${recipe.query}`} shallow={true}>
      <Card className={`md:max-h-44 w-full ${className}`} isPressable>
        <CardBody className='overflow-visible flex flex-col md:flex-row items-center lg:items-start gap-2'>
          <Image
            alt='Card background'
            className='object-contain rounded-xl w-44 md:w-24 lg:w-36'
            src={imageBaseUrl + (recipe.meal_image || recipe.history_image)}
            width={1024}
            height={1024}
          />
          <div className='flex flex-col md:gap-3 w-2/3 md:px-3'>
            <p
              className={`text-lg lg:text-xl lg:text-start font-bold text-center ${yanone.className}`}
            >
              {recipe.name || recipe.query}
            </p>
            <p className='hidden md:block text-xs'>{recipe.description}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
