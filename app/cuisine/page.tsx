import MealTypeList from '../components/MealType/MealTypeList';
import { yanone } from '../assets/fonts/fonts';
import { getAllCuisines } from '../lib/mealTypeActions';

export const dynamic = 'force-dynamic';

export default async function Cuisines() {
  const cuisines = (await getAllCuisines()) as Cuisine[] | [];
  return (
    <div className='flex flex-col gap-4 md:gap-8 p-5 md:p-10'>
      <p className={`font-bold text-3xl md:text-4xl ${yanone.className}`}>
        Cuisines
      </p>
      <MealTypeList mealTypeList={cuisines} type='cuisine' />
    </div>
  );
}
