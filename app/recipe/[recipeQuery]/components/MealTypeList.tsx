import Link from 'next/link';

import { yanone } from '@/app/assets/fonts/fonts';
import MealTypeCard from './MealTypeCard';

export default function MealTypeList({
  className,
  mealTypeList,
  type,
}: {
  className?: string;
  mealTypeList: Category[] | Cuisine[] | [];
  type: MealType;
}) {
  const title = type === 'cuisine' ? 'cuisines' : 'occasions';
  return (
    <section
      className={`flex flex-col gap-4 md:gap-8 py-8 px-10 lg:px-0 ${className}`}
    >
      <div
        className={`text-3xl font-bold mx-auto bg-white p-2 rounded-10 ${yanone.className}`}
      >
        Popular {title}
      </div>
      <div className='flex items-center w-full justify-between'>
        <div className='flex flex-col  w-full items-center justify-center gap-2 border-r-1 border-dashed border-gray-400'>
          {mealTypeList?.slice(0, 3)?.map((mealType) => (
            <MealTypeCard key={mealType.name} mealType={mealType} type={type} />
          ))}
        </div>
        <div className='w-full flex flex-col items-center justify-center gap-2'>
          {mealTypeList?.slice(3, 5)?.map((mealType) => (
            <MealTypeCard key={mealType.name} mealType={mealType} type={type} />
          ))}
          <Link
            href={`/${type}`}
            className={`w-1/2 h-32 flex justify-center items-center font-bold text-lg text-center`}
          >
            More
          </Link>
          <div className='w-full border-b-1 border-dashed border-gray-400 '></div>
        </div>
      </div>
    </section>
  );
}
