'use client';

import Image from 'next/image';
import cookingGIF from '@/app/assets/gifs/cooking-animation.gif';
import EmailInputModal from './loading/EmailInputModal';

export default function CreateRecipeModal() {
  return (
    <div className='fixed inset-0 backdrop-blur-md bg-black bg-opacity-20 flex justify-center items-center z-50'>
      <div className='w-80 md:w-556 bg-white p-7 rounded-10 flex flex-col items-center justify-center gap-4 z-50'>
        <Image alt='Cooking GIF' src={cookingGIF} width={150} height={150} />
        <EmailInputModal />
      </div>
    </div>
  );
}
