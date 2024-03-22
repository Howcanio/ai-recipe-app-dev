'use client';

import CreateRecipeModal from './CreateRecipeModal';

import SearchIcon from '../assets/svgs/SearchIcon';
import { FormEvent } from 'react';
import { useSearchContext } from '../contexts/RecipeSearchContext';

export default function Searchbar({ className }: { className?: string }) {
  const { meal, setMeal, showModal, handleSearch } = useSearchContext();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    handleSearch(e, false, undefined);
  };
  return (
    <>
      <form
        className={`flex items-center rounded-10 text-neutral-black placeholder:text-neutral-dark-gray border-2 border-primary p-2 ${className}`}
        onSubmit={onSubmit}
      >
        <button type='submit' disabled={meal === ''} className='cursos-pointer'>
          <SearchIcon />
        </button>
        <input
          type='text'
          placeholder='Search or create delicious recipes...'
          className='focus:ring-0 border-0 px-4 w-full placeholder:text-sm xl:text-xl xl:placeholder:text-base'
          onChange={(e) => setMeal(e.target.value)}
        />
      </form>
      {showModal && <CreateRecipeModal />}
    </>
  );
}
