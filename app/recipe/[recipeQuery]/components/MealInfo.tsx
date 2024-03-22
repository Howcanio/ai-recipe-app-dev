'use client';

import { ChefHatIcon } from '@/app/assets/svgs';
import ClockIcon from '@/app/assets/svgs/ClockIcon';
import ScaleIcon from '@/app/assets/svgs/ScaleIcon';
import { convertISO8601ToReadable } from '@/app/lib/parsers';

export default function MealInfo({
  totalTime,
  recipeYield,
  calories,
  className,
}: {
  totalTime: string;
  recipeYield: string;
  calories: string;
  className?: string;
}) {
  const parsedTotalTime = convertISO8601ToReadable(totalTime);
  return (
    <section
      className={`flex items-center justify-between gap-2 font-medium ${className}`}
    >
      <div className='flex items-center gap-2'>
        <ClockIcon />
        <p>{parsedTotalTime}</p>
      </div>
      <div className='text-4xl text-gray-300 font-thin'>|</div>
      <div className='flex items-center gap-2'>
        <ChefHatIcon /> <p>{recipeYield}</p>{' '}
      </div>
      <div className='text-4xl text-gray-300 font-thin'>|</div>
      <div className='flex items-center gap-2'>
        <ScaleIcon />
        <p>{calories} calories</p>
      </div>
    </section>
  );
}
