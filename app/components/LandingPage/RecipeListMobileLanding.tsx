import { Image, Card } from '@nextui-org/react';
import Link from 'next/link';
import MealInfo from '@/app/recipe/[recipeQuery]/components/MealInfo';
import { yanone } from '@/app/assets/fonts/fonts';

export default function RecipeListMobileLanding({
  className,
  recipes,
}: {
  className?: string;
  recipes: Recipe[];
}) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {recipes.slice(1, 4).map((recipe) => (
        <Link
          href={`/recipe/${recipe.query}`}
          shallow={true}
          key={recipe.id}
          className='flex flex-col gap-4'
        >
          <Card className='flex flex-row gap-4 p-4'>
            <Image
              alt={recipe.name}
              src={imageBaseUrl + (recipe.meal_image || recipe.history_image)}
              width={150}
              height={150}
              className='w-full'
            />
            <div className='flex flex-col gap-2'>
              <h3 className={`font-bold text-xl ${yanone.className}`}>
                {recipe.name}
              </h3>
              <p className='text-sm'>{recipe.description}</p>
            </div>
          </Card>
          <MealInfo
            totalTime={recipe.total_time}
            recipeYield={recipe.recipe_yield}
            calories={recipe.calories.slice(0, 12)}
            className='w-full text-sm justify-start'
          />
        </Link>
      ))}
    </div>
  );
}
