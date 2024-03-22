'use client';

import styles from './MealTypeCard.module.css';
import { stringToSlug } from '@/app/lib/parsers';
import { Card, Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function MealTypeCard({
  mealType,
  type,
}: {
  mealType: Category | Cuisine;
  type: MealType;
}) {
  const router = useRouter();
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;
  return (
    <>
      <Card
        isPressable
        onPress={() => router.push(`/${type}/${stringToSlug(mealType.name)}`)}
        className={`w-32 h-32 mx-auto md:mx-0 ${styles.mealCard}`}
      >
        <Image
          width={1920}
          height={1080}
          className={`w-32 h-32 ${styles.mealImage}`}
          src={imageBaseUrl + mealType.image_url}
          alt='MealType'
        />
        <p
          className={`font-bold text-base text-white z-10 absolute bottom-8 left-4 ${styles.mealText}`}
        >
          {mealType.name}
        </p>
        <div
          className={`absolute bottom-7 left-4 border-t-1 border-white w-20 z-10 ${styles.mealBorder}`}
        ></div>
        ;
      </Card>
      <div className='w-full border-b-1 border-dashed border-b-gray-400'></div>
    </>
  );
}
