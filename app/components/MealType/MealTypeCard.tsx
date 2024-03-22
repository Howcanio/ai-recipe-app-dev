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
    <Card
      isPressable
      onPress={() => router.push(`/${type}/${stringToSlug(mealType.name)}`)}
      className={`w-[13rem] h-[13rem] mx-auto md:mx-0 ${styles.mealCard}`}
    >
      <Image
        width={1920}
        height={1080}
        className={`w-[17rem] h-[17rem] ${styles.mealImage}`}
        src={imageBaseUrl + mealType.image_url}
        alt='MealType'
      />
      <p
        className={`font-bold text-2xl text-white z-10 absolute bottom-14 left-6 ${styles.mealText}`}
      >
        {mealType.name}
      </p>
      <div
        className={`absolute bottom-12 left-6 border-t-1 border-white w-52 z-10 ${styles.mealBorder}`}
      ></div>
      ;
    </Card>
  );
}
