'use client';

import { yanone } from '@/app/assets/fonts/fonts';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { isValidEmail } from '@/app/lib/parsers';
import { ChangeEvent, FormEvent, useState, useTransition } from 'react';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useSearchContext } from '@/app/contexts/RecipeSearchContext';
import { subscribeToNewsletter } from '@/app/lib/emailActions';

export default function EmailInputModal() {
  const {
    handleOnHideModal,
    modalButton,
    storedEmail,
    setStoredEmail,
    setModalButton,
  } = useSearchContext();

  const { addData, removeData } = useLocalStorage('newsletterEmail');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValid(isValidEmail(inputEmail));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      subscribeToNewsletter(email).then((res) => {
        if (res.status === 'success') {
          addData({ id: email, createdAt: Date.now() });
          setStoredEmail(email);
          setModalButton((prevState) => ({
            ...prevState,
            show: true,
          }));
          // handle email sending here (of the recipe created when its created (dont know how))
        } else if (res.status === 'error') {
          // Handle error case
        }
      });
    });
  };

  const handleNotYou = () => {
    if (storedEmail) {
      removeData(storedEmail);
      setStoredEmail(undefined);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col px-5 gap-4 w-full max-h-64 items-center justify-center`}
      >
        <h3 className={`uppercase text-2xl font-bold ${yanone.className}`}>
          {storedEmail ? storedEmail : 'Enter email to see preview'}
          {'\t'}
          {storedEmail && (
            <span onClick={handleNotYou} className='cursor-pointer opacity-80'>
              (Not you?)
            </span>
          )}
        </h3>
        <p className='border-t-1 border-dashed border-gray-500 py-3 opacity-80 italic font-bold'>
          {storedEmail
            ? 'We are generating your recipe.  As a subscriber, you can view the preview of the recipe page and we will inform you of when the recipe is completed.'
            : 'We are generating your recipe.  To see an early preview of your recipe, subscribe to our weekly emails of great recipes.  Once you have subscribed, we will bring you to the preview of the recipe page and inform you of when the recipe is completed.'}
        </p>
        {!isPending && !storedEmail && (
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-center gap-4 w-full'
          >
            <input
              type='text'
              value={email}
              onChange={handleEmailChange}
              placeholder='Your email address'
              className='w-full rounded-10 text-neutral-black placeholder:text-neutral-dark-gray text-center border-1 border-primary focus:ring-primary focus:border-primary'
            />

            <button
              type='submit'
              className='px-8 py-1 text-white rounded-10 bg-primary'
              disabled={!isValid}
            >
              Submit
            </button>
          </form>
        )}
      </div>
      {isPending && <Spinner label='Subscribing...' labelColor='foreground' />}
      {modalButton.show && modalButton.link !== undefined && storedEmail && (
        <button
          onClick={() => {
            handleOnHideModal();
            router.push(`/recipe/${modalButton.link}`);
          }}
          className={`px-8 py-1 text-white rounded-10 ${
            modalButton.name === 'Preview' ? 'bg-gray-500' : 'bg-primary'
          }`}
        >
          {modalButton.name}
        </button>
      )}
      {!modalButton.show && !modalButton.name && (
        <Spinner label='Generating recipe...' labelColor='foreground' />
      )}
    </>
  );
}
