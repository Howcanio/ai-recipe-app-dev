'use client';

import CreateRecipeModal from '@/app/components/CreateRecipeModal';
import SearchIcon from '@/app/assets/svgs/SearchIcon';
import { FormEvent, useState } from 'react';
import { useSearchContext } from '@/app/contexts/RecipeSearchContext';

export default function Searchbar({
  className,
  recipe,
}: {
  className?: string;
  recipe: Recipe;
}) {
  const { setMeal, showModal, handleSearch } = useSearchContext();
  const [userInput, setUserInput] = useState('');

  const onSubmit = (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    handleSearch(e, true, undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Calculate the prefix length to avoid hardcoding the number
    const prefix = `${recipe.name} but `;
    const fullInput = e.target.value;
    const prefixLength = prefix.length;

    // If the user attempts to delete part of the static prefix, reset to just the prefix
    if (fullInput.length < prefixLength) {
      setUserInput('');
      // Reset the input field to just contain the prefix
      e.target.value = prefix;
    } else {
      // Update only the user's input part, excluding the prefix
      const newUserInput = fullInput.slice(prefixLength);
      setUserInput(newUserInput);
      setMeal(`${recipe.name} but ${newUserInput}`);
    }
  };

  return (
    <div className='w-full pb-5 flex flex-col items-center gap-5'>
      <form
        className={`w-full flex items-center rounded-10 text-neutral-black placeholder:text-neutral-dark-gray border-2 border-primary px-2 ${className}`}
        onSubmit={onSubmit}
      >
        <button type='submit' disabled={!userInput} className='cursos-pointer'>
          <SearchIcon />
        </button>
        <input
          type='text'
          placeholder={`${recipe.name} but ...`}
          className='focus:ring-0 border-0 px-4 w-full placeholder:text-sm lg:text-lg xl:placeholder:text-base'
          value={`${recipe.name} but ${userInput ? userInput : ''}`}
          onChange={handleChange}
        />
      </form>
      <button
        className='max-w-min px-8 py-1 text-white rounded-10 bg-primary'
        disabled={!userInput}
        onClick={onSubmit}
      >
        Submit
      </button>
      {showModal && <CreateRecipeModal />}
    </div>
  );
}
