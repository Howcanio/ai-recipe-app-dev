'use client';

import { useRef, useState } from 'react';
import ThreeRecipeSection from './ThreeRecipeSection';
import { Pagination } from '@nextui-org/react';
import useWindowSize from '@/app/hooks/useWindowSize';
import OneRecipeSection from './OneRecipeSection';

export default function RecipesWithPagination({
  recipes,
  className,
}: {
  recipes: Recipe[] | [];
  className?: string;
}) {
  const [current, setCurrent] = useState(1);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const { isMobile } = useWindowSize();
  const numberOfPages =
    Math.floor(recipes.length / 12) > 0 ? Math.floor(recipes.length / 12) : 1;

  const step = (current - 1) * 12;
  const handleOnChange = (page: number) => {
    if (componentRef.current) {
      componentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setCurrent(page);
  };

  return !isMobile ? (
    <section
      ref={componentRef}
      className={`w-full flex flex-col gap-10 lg:w-2/3 px-10 ${className}`}
    >
      <ThreeRecipeSection recipes={recipes.slice(step, step + 4)} />
      <ThreeRecipeSection
        recipes={recipes.slice(step + 4, step + 8)}
        className='flex-row-reverse'
      />
      <ThreeRecipeSection recipes={recipes.slice(step + 8, step + 12)} />
      <Pagination
        isCompact
        page={current}
        onChange={handleOnChange}
        showControls
        total={numberOfPages}
        initialPage={1}
        className='ml-auto'
      />
    </section>
  ) : (
    <section ref={componentRef} className='flex flex-col gap-4'>
      {recipes.slice(step, step + 12).map((recipe) => (
        <OneRecipeSection key={recipe.id} recipe={recipe} className='px-5' />
      ))}
      <Pagination
        isCompact
        page={current}
        onChange={handleOnChange}
        showControls
        total={numberOfPages}
        initialPage={1}
        className='mx-auto md:ml-auto'
      />
    </section>
  );
}
