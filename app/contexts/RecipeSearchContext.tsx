'use client';

import React, {
  FormEvent,
  createContext,
  useState,
  useTransition,
  useContext,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  getOrCreateRecipePreview,
  processRecipeDetails,
} from '@/app/lib/gptActions';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type RecipeModalButton = {
  name: string | undefined;
  show: boolean;
  link: string | undefined;
};
type SearchContext = {
  meal: string | undefined;
  setMeal: React.Dispatch<React.SetStateAction<string | undefined>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalButton: RecipeModalButton;
  setModalButton: React.Dispatch<React.SetStateAction<RecipeModalButton>>;
  handleSearch: (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    isAdjustedMeal: boolean,
    meal?: string
  ) => void;
  storedEmail: string | undefined;
  setStoredEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
  handleOnHideModal: () => void;
};

const RecipeSearchContext = createContext<SearchContext | undefined>(undefined);

export const RecipeSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getAllData } = useLocalStorage('newsletterEmail');
  const router = useRouter();
  const [storedEmail, setStoredEmail] = useState(getAllData().at(-1)?.id);
  const [meal, setMeal] = useState<string | undefined>(undefined);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [modalButton, setModalButton] = useState<RecipeModalButton>({
    name: undefined,
    show: false,
    link: undefined,
  });

  const handleOnHideModal = () => {
    console.log('Called');
    setShowModal(false);
    setMeal(undefined);
    setModalButton({
      name: undefined,
      show: false,
      link: undefined,
    });
    setStoredEmail(getAllData().at(-1)?.id);
  };

  const handleSearch = (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    isAdjustedMeal: boolean,
    passedMeal: string | undefined
  ) => {
    if ('preventDefault' in e) {
      e.preventDefault();
    }
    const mealQuery = passedMeal || meal;
    setShowModal(true);
    if (mealQuery)
      startTransition(() => {
        getOrCreateRecipePreview(mealQuery, isAdjustedMeal).then((result) => {
          if (result?.status === 'error') {
            toast.error(result.message);
            handleOnHideModal();
          } else if (result?.status === 'success') {
            setModalButton({
              name: 'Preview',
              show: storedEmail ? true : false,
              link: result.recipe.query,
            });
            processRecipeDetails(result.recipe, storedEmail).then((res) => {
              if (res.status === 'success')
                setModalButton((prevState) => ({
                  ...prevState,
                  show: storedEmail ? true : false,
                  name: 'Full Recipe',
                }));
            });
          } else if (result?.status === 'redirect') {
            handleOnHideModal();
            router.push(`/recipe/${result.recipe.query}`);
          }
        });
      });
  };

  return (
    <RecipeSearchContext.Provider
      value={{
        meal,
        setMeal,
        showModal,
        setShowModal,
        handleOnHideModal,
        modalButton,
        setModalButton,
        handleSearch,
        storedEmail,
        setStoredEmail,
        isLoading: isPending,
      }}
    >
      {children}
    </RecipeSearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(RecipeSearchContext);
  if (!context) {
    throw new Error(
      'useSearchContext must be used within a RecipeSearchProvider'
    );
  }
  return context;
};
