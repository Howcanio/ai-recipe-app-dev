import React from 'react';
import MealTypeCard from './MealTypeCard';

export default function MealTypeList({
  mealTypeList,
  type,
}: {
  mealTypeList: Category[] | Cuisine[] | [];
  type: MealType;
}) {
  return (
    <div className='flex flex-wrap gap-5 md:pl-7 2xl:pl-10'>
      {mealTypeList?.map((mealType) => (
        <MealTypeCard key={mealType.name} mealType={mealType} type={type} />
      ))}
    </div>
  );
}
