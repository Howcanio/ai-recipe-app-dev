import Link from 'next/link';
import React from 'react';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`w-full bg-white lg:rounded-b-10 py-6 px-6 md:px-10 flex gap-5 items-center text-sm md:text-lg font-medium text-gray-800 ${className}`}
    >
      <Link href='/about' shallow={true}>
        About us
      </Link>
      <Link href='/terms-of-service' shallow={true}>
        Terms of service
      </Link>
      <Link href='/privacy-policy' shallow={true}>
        Privacy policy
      </Link>
    </footer>
  );
}
