'use client';

import { Card, CardBody } from '@nextui-org/react';
import LoadingModal from '../../../components/CreateRecipeModal';
import { yanone } from '@/app/assets/fonts/fonts';
import { useSearchContext } from '@/app/contexts/RecipeSearchContext';

export default function MostPopularRecipeCard({
  recipe,
}: {
  recipe: RelatedRecipe;
}) {
  const { showModal, handleSearch } = useSearchContext();

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleSearch(e, false, recipe.name);
  };

  return (
    <>
      <button onClick={onClick}>
        <Card className='py-4 max-w-64 h-56'>
          <CardBody className='overflow-visible py-2 px-8 flex flex-col gap-2'>
            <p className={`text-xl font-bold ${yanone.className}`}>
              {recipe.name}
            </p>
            <p className='text-sm text-default-500'>{recipe.description}</p>
          </CardBody>
        </Card>
      </button>
      {showModal && <LoadingModal />}
    </>
  );
}
