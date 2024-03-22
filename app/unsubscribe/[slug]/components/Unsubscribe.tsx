'use client';

import { Spinner } from '@nextui-org/react';
import { deactivateSubscriber } from '@/app/lib/emailDbActions';
import { useState, useTransition } from 'react';
import useLocalStorage from '@/app/hooks/useLocalStorage';

export default function Unsubscribe({
  unsubscribeToken,
  isSubscribed,
}: {
  unsubscribeToken: string;
  isSubscribed: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { clearData } = useLocalStorage('newsletterEmail');
  const [result, setResult] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const onClick = () => {
    startTransition(() => {
      deactivateSubscriber(unsubscribeToken).then((res) => {
        setResult(res);
      });
      // Clears local storage
      clearData();
    });
  };
  return (
    <div className='flex flex-col gap-5 p-5'>
      <h1 className='text-xl md:text-4xl font-bold'>
        Unsubscribe from our weekly newsletter
      </h1>
      <h3 className='text-base md:text-lg'>
        If you no longer wish to receive our newsletters or updates, you can
        unsubscribe at any time by clicking the button below. We&apos;re sorry
        to see you go, but we understand the importance of keeping your inbox
        tidy. Should you decide to return, we&apos;ll be here to welcome you
        back.
      </h3>
      {/* Add subscribe */}
      {isPending ? (
        <div className='max-w-min'>
          <Spinner label='Unsubscribing' labelColor='foreground' />
        </div>
      ) : result ? (
        <p
          className={`text-xl font-medium ${
            result.status === 'success' ? 'text-success-700' : 'text-danger-500'
          }`}
        >
          {result.message}
        </p>
      ) : isSubscribed ? (
        <button
          onClick={onClick}
          className='rounded text-white bg-primary py-2 px-8 max-w-min'
        >
          Unsubscribe
        </button>
      ) : (
        <p className='text-xl text-success-700 font-medium'>
          Already unsubscibed!
        </p>
      )}
    </div>
  );
}
