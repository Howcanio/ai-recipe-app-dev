'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/assets/imgs/logo.png';
import Searchbar from './Searchbar';
import { yanone } from '../assets/fonts/fonts';

export default function Navbar({ className }: { className?: string }) {
  const paths = usePathname();
  const showSearch = paths.split('/').at(1) === 'recipe';
  return (
    <nav
      className={`w-full bg-white border-b-1 border-gray-300 lg:rounded-t-10 ${className}`}
    >
      <div className='flex w-full items-center px-10 py-3 gap-10 md:gap-20'>
        <Link href='/' shallow={true}>
          <Image
            alt='Logo'
            className='w-20 md:24 lg:w-36'
            src={Logo}
            width={150}
            height={150}
          />
        </Link>
        <Link
          href='/cuisine'
          shallow={true}
          className={`font-bold text-2xl md:text-3xl ${yanone.className}`}
        >
          Cuisines
        </Link>
        <Link
          href='/category'
          shallow={true}
          className={`font-bold text-2xl md:text-3xl ${yanone.className}`}
        >
          Occasions
        </Link>

        {showSearch && (
          <Searchbar className='hidden md:flex md:w-1/3 ml-auto' />
        )}
      </div>
    </nav>
  );
}
