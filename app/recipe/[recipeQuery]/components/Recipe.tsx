'use client';

import { Image } from '@nextui-org/react';
import BreadcrumbsUI from '@/app/components/BreadcrumbsUI';
import Ingredients from './Ingredients';
import MagicWandModal from './MagicWandModal';
import Instructions from './Instructions';
import MealTypes from './MealTypes';
import MealInfo from './MealInfo';
import RelatedRecipes from './RelatedRecipes';
import RecipeList from './RecipeList';
import RecipeListMobileLanding from '@/app/components/LandingPage/RecipeListMobileLanding';
import GoogleRecipeScript from '@/app/components/seo/GoogleRecipeScript';
import { parsePostgreSQLArray, slugToString } from '@/app/lib/parsers';
import { yanone } from '@/app/assets/fonts/fonts';
import { useEffect, useState } from 'react';
import { getRecipeImagesByQuery } from '@/app/lib/dbActions';
import GoogleImageScript from '@/app/components/seo/GoogleImageScript';

export default function Recipe({
  recipe,
  mostRecentRecipes,
  mostPopularRecipes,
  recipeQuery,
}: {
  recipe: Recipe | undefined;
  mostRecentRecipes: Recipe[] | [];
  mostPopularRecipes: Recipe[] | [];
  recipeQuery: string;
}) {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  const [mealImage, setMealImage] = useState(recipe?.meal_image);
  const [historyImage, setHistoryImage] = useState(recipe?.history_image);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    // Define a function to fetch images
    const fetchImages = async () => {
      if (recipe && (!mealImage || !historyImage)) {
        // Only fetch if images are not already set
        const response = await getRecipeImagesByQuery(recipe.query);
        if (response.status === 'success' && response.images) {
          setMealImage(response.images.meal_image);
          setHistoryImage(response.images.history_image);
          clearInterval(intervalId);
        }
      }
    };

    // Set an interval to check for image updates every 10 seconds
    if (recipe && (!mealImage || !historyImage)) {
      // Only set interval if images are not already set
      intervalId = setInterval(fetchImages, 5000);
    }

    // Cleanup interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [recipe, mealImage, historyImage]);

  if (recipe) {
    const recipeIngredients = parsePostgreSQLArray(recipe.recipe_ingredients);
    const recipeInstructions = parsePostgreSQLArray(recipe.recipe_instructions);
    if (recipeIngredients && recipeInstructions)
      return (
        <main className='flex flex-col'>
          <BreadcrumbsUI className='hidden md:flex' recipe={recipe} />
          <div className='flex flex-col md:flex-row px-10 border-b-1 md:border-t-1 border-gray-300'>
            <div className='flex flex-col w-full md:w-2/5 md:border-r-1 md:border-gray-300 md:pr-10 pt-10'>
              {mealImage ? (
                <Image
                  alt='Recipe image'
                  className='w-full rounded-10 items-center object-cover object-center md:max-w-md'
                  src={imageBaseUrl + mealImage}
                  width={1920}
                  height={1024}
                />
              ) : (
                <div className='w-full h-[16rem] flex items-center justify-center text-2xl px-8 text-center'>
                  Generating Image... we will display image here when it is
                  ready
                </div>
              )}

              <Ingredients
                ingredients={recipeIngredients}
                className='hidden md:flex'
              />
            </div>
            <div className='relative flex flex-col md:w-3/5 md:pl-10'>
              <MagicWandModal
                recipe={recipe}
                className='absolute top-5 md:top-5 -right-5'
              />

              <h1
                className={`font-medium text-5xl text-center px-10 2xl:px-16 lg:text-7xl py-10 md:py-14 ${yanone.className}`}
              >
                {recipe.name}
              </h1>
              <Ingredients
                ingredients={recipeIngredients}
                className='bg-red-200 md:hidden'
              />
              <Instructions
                instructions={recipeInstructions}
                className='bg-green-200 md:hidden mt-5 mb-10'
              />
              <MealTypes
                category={recipe.recipe_category}
                cuisine={recipe.recipe_cuisine}
              />
              <p className='text-base font-medium italic text-gray-700 mt-10'>
                {recipe.history}
              </p>
              {historyImage && (
                <Image
                  src={imageBaseUrl + historyImage}
                  width={1920}
                  height={1024}
                  className='w-full mx-auto rounded-10 object-cover object-center h-96 mt-10'
                />
              )}
              <MealInfo
                totalTime={recipe.total_time}
                calories={recipe.calories}
                recipeYield={recipe.recipe_yield}
                className='my-10 text-sm md:text-lg lg:text-xl '
              />
              <Instructions
                instructions={recipeInstructions}
                className='hidden md:flex mb-10'
              />
            </div>
          </div>
          <div className='w-full h-64 text-4xl flex justify-center items-center my-10'>
            <p>ADS</p>
          </div>
          <RelatedRecipes
            relatedRecipes={recipe.related_recipes}
            className='px-10 bg-[url(https://img.freepik.com/premium-vector/food-background-vegetables-seamless-pattern-healthy-eating-tomato-garlic-carrot-pepper_787654-45.jpg)]'
          />
          <div className='flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between lg:px-10'>
            {/* Tablet and desktop */}
            <RecipeList
              listType='popular'
              recipes={mostPopularRecipes}
              className='hidden md:flex md:w-1/2'
            />
            <RecipeList
              listType='recent'
              recipes={mostRecentRecipes}
              className='md:w-1/2'
            />
          </div>

          {/* Mobile */}
          <div className='md:hidden my-5 flex flex-col gap-5'>
            <h3 className='text-center font-bold text-xl'>
              Most popular recipes
            </h3>
            <RecipeListMobileLanding
              recipes={mostPopularRecipes as Recipe[]}
              className='px-5'
            />
            <h3 className='text-center font-bold text-xl'>
              Most recent recipes
            </h3>
            <RecipeListMobileLanding
              recipes={mostRecentRecipes as Recipe[]}
              className='px-5'
            />
          </div>
          <GoogleRecipeScript recipe={recipe} />
          <GoogleImageScript recipe={recipe} />
        </main>
      );
  } else
    return (
      <main className='h-96 text-4xl p-8 text-danger-500'>
        We were not able to find the recipe {slugToString(recipeQuery)}! Try
        again with another query!
      </main>
    );
}
