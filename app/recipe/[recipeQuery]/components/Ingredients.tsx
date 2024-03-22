'use client';

import IngredientsIcon from '@/app/assets/svgs/IngredientsIcon';
import RightArrowIcon from '@/app/assets/svgs/RightArrowIcon';
import useIngredientUrls from '@/app/hooks/useIngredientUrls';
import useWindowSize from '@/app/hooks/useWindowSize';
import { Accordion, AccordionItem } from '@nextui-org/react';
import Link from 'next/link';

export default function Ingredients({
  ingredients,
  className,
}: {
  ingredients: string[];
  className?: string;
}) {
  const { isMobile } = useWindowSize();
  const ingredientUrls = useIngredientUrls();
  const content = (
    <ul className='text-base font-medium list-disc px-10'>
      {ingredients.map((ingredient, index) => {
        const ingredientKey = ingredient.toLowerCase();

        // Find the first object in 'ingredientUrls' where any key is included in 'ingredientKey'
        const matchingIngredient = ingredientUrls.find((obj) =>
          Object.keys(obj).some((key) => ingredientKey.includes(key))
        );

        // If a match is found, extract the URL using the first matching key
        let url: string | null = null;
        if (matchingIngredient) {
          const matchingKey = Object.keys(matchingIngredient).find((key) =>
            ingredientKey.includes(key)
          );
          if (matchingKey) {
            url = matchingIngredient[matchingKey];
          }
        }

        return (
          <li key={index} className='py-0.5'>
            {url ? (
              <Link
                href={url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary'
              >
                {ingredient}
              </Link>
            ) : (
              ingredient
            )}
          </li>
        );
      })}
    </ul>
  );

  return isMobile ? (
    <Accordion variant='shadow' className={`font-medium ${className}`}>
      <AccordionItem
        key='1'
        aria-label='Ingredients'
        title='Ingredients'
        startContent={<IngredientsIcon />}
        indicator={<RightArrowIcon />}
      >
        {content}
      </AccordionItem>
    </Accordion>
  ) : (
    <section className={`w-full flex-col gap-4 flex mt-16 ${className}`}>
      <div className='flex gap-4 items-center'>
        <IngredientsIcon />
        <h3 className='font-medium text-2xl italic'>Ingredients</h3>
      </div>
      {content}
    </section>
  );
}
