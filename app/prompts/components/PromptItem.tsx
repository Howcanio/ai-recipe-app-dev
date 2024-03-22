'use client';

import { updatePrompt } from '@/app/lib/promptDbActions';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'react-toastify';

export default function PromptItem({
  prompt,
  className,
}: {
  prompt: Prompt;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [promptValue, setPromptValue] = useState(prompt.value);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const toastLoading = toast.loading('Updating prompt...');
    // Example async operation to update the prompt
    startTransition(() => {
      const promptToUpdate = { ...prompt, value: promptValue };
      updatePrompt(promptToUpdate).then((result) => {
        toast.dismiss(toastLoading);
        if (result.status === 'success') {
          toast.success(result.message);
        } else if (result.status === 'error')
          toast.error('Error updating prompt');
      });
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`flex flex-col gap-2 text-lg font-semibold ${className}`}
    >
      <h1>
        Prompt name: <span className='opacity-80'>{prompt.name}</span>
      </h1>
      <p>
        Prompt description:{' '}
        <span className='opacity-80'>{prompt.description}</span>
      </p>
      <textarea
        value={promptValue}
        onChange={(e) => setPromptValue(e.target.value)}
        className='w-full h-64 rounded-10 bg-inherit p-5 font-medium focus:outline-none focus:ring-primary focus:border-primary border-primary resize-none'
      />
      <button
        type='submit'
        disabled={isPending}
        className='bg-primary text-white font-bold py-2 px-8 max-w-min rounded-10 hover:bg-dark-primary transition duration-150 ease-in-out'
      >
        Update
      </button>
    </form>
  );
}
