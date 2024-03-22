import { yanone } from '../assets/fonts/fonts';
import RecipeList from '../recipe/[recipeQuery]/components/RecipeList';
import Newsletter from './Emailing/Newsletter';
import RecipeListMobileLanding from './LandingPage/RecipeListMobileLanding';
import RecipesWithPagination from './LandingPage/RecipesWithPagination';
import MealTypeList from '../recipe/[recipeQuery]/components/MealTypeList';
import Searchbar from './Searchbar';

export const maxDuration = 300;

export default async function LandingPage({
  cuisines,
  categories,
  recipes,
}: {
  cuisines: Cuisine[] | [];
  categories: Category[] | [];
  recipes: Recipe[] | [];
}) {
  return (
    <main className='flex flex-col pb-10'>
      <div className='w-full flex flex-col items-center justify-center gap-2'>
        <div className='flex items-center gap-8 -mt-2 md:-mt-3'>
          <h1
            className={`font-bold text-center  text-4xl md:text-5xl lg:text-7xl ${yanone.className}`}
          >
            How can
          </h1>
          <div className='relative flex items-center'>
            <p
              className='text-primary font-medium text-7xl md:text-[6rem] lg:text-[7.5rem] pb-8'
              style={{ fontFamily: "'HandwrittenFont', sans-serif" }}
            >
              I cook
            </p>
            <div
              className='absolute top-[60%] left-0 right-0 h-[2px] lg:h-[3px] bg-black'
              style={{ width: '140%', marginLeft: '-15%' }}
            ></div>
          </div>
        </div>
      </div>
      <Searchbar className='w-2/3 mx-auto -mt-4' />
      {/* Space for carousel */}
      <div className='h-[27rem] md:h-[28rem] lg:h-[28rem] w-full'></div>
      <div className='w-full flex gap-4 lg:gap-0'>
        {recipes.length > 0 && <RecipesWithPagination recipes={recipes} />}
        {/* Desktop design */}
        <div className='hidden lg:flex w-1/3 ml-auto pr-10 flex-col'>
          <Newsletter />
          <RecipeList
            listType='popular'
            recipes={recipes}
            className='text-medium'
          />
          <MealTypeList type={'category'} mealTypeList={categories} />
          <MealTypeList type={'cuisine'} mealTypeList={cuisines} />
        </div>
      </div>
      {/* This is a tablet design */}
      <>
        <div className='hidden md:flex lg:hidden'>
          <RecipeList
            listType='popular'
            recipes={recipes}
            className='w-1/2 md:py-0'
          />
          <MealTypeList
            type={'category'}
            className='w-1/2 md:py-0'
            mealTypeList={categories}
          />
        </div>
        <Newsletter className='hidden md:flex lg:hidden md:w-1/2 mx-auto' />
      </>
      {/* This is a mobile design */}
      <>
        <Newsletter className='flex my-8 md:hidden' />
        <div className='md:hidden'>
          <h3
            className={`text-center font-bold text-3xl mb-5 ${yanone.className}`}
          >
            Popular recipes
          </h3>
          <RecipeListMobileLanding
            recipes={recipes as Recipe[]}
            className='px-5'
          />
          <MealTypeList type={'category'} mealTypeList={categories} />
        </div>
      </>
    </main>
  );
}
