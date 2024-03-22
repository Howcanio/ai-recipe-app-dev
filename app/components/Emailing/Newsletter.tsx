'use client';

import { yanone } from '@/app/assets/fonts/fonts';
import useLocalStorage from '@/app/hooks/useLocalStorage';
import { subscribeToNewsletter } from '@/app/lib/emailActions';
import { isValidEmail } from '@/app/lib/parsers';
import { ChangeEvent, FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

export default function Newsletter({ className }: { className?: string }) {
  const { addData } = useLocalStorage('newsletterEmail');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValid(isValidEmail(inputEmail));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.loading('Please wait while we subscribe you to the newsletter!');
    try {
      const result = await subscribeToNewsletter(email);
      addData({ id: email, createdAt: Date.now() });
      toast.dismiss();
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Error occurred, please try again!');
    }
  };
  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col px-5 gap-4 w-full h-56 items-center justify-center ${className}`}
    >
      <h3 className={`uppercase text-2xl ${yanone.className}`}>
        Our Newsletter
      </h3>
      <p className='border-t-1 border-dashed border-gray-500 py-3 opacity-80'>
        Subscribe for our weekly recipes tips, we promise to not spam you
      </p>
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
  );
}
