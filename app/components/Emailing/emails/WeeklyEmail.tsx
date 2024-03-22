import {
  Text,
  Img,
  Link,
  Tailwind,
  Heading,
  Container,
  Html,
} from '@react-email/components';
import * as React from 'react';

export default function WeeklyEmail({
  unsubscribe_token,
  introText,
  recentRecipes,
  popularRecipes,
  title,
}: {
  unsubscribe_token: string;
  introText: string;
  recentRecipes: Recipe[];
  popularRecipes: Recipe[];
  title: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const s3Url = process.env.NEXT_PUBLIC_S3_BASE_URL;
  return (
    <Html>
      <Tailwind
        config={{
          theme: {
            extend: {
              fontSize: {
                xxs: '0.625rem',
              },

              colors: {
                primary: '#37B6FF',
                'dark-primary': '#238CC8',
                secondary: '#DD1717',
                'neutral-dark-gray': '#9C9CA4',
                'neutral-gray': '#DBDBDB',
                'neutral-black': '#141522',
              },
              lineHeight: {
                7.5: '1.875rem',
                3.5: '0.9375rem',
              },
              spacing: {
                4.5: '1.125rem',
              },
              width: {
                67.5: '16.875rem',
                556: '34.75rem',
              },
              height: {
                45: '11.25rem',
              },
              borderRadius: {
                10: '0.625rem',
              },
              backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
              },
            },
          },
        }}
      >
        <head></head>
        <Container>
          <div className='w-[650px] px-20 py-8 bg-white'>
            <div className='flex items-center'>
              <Img src={`${s3Url}logo.png`} alt='Logo' className='h-12' />
            </div>
            <div className='text-center flex-grow my-4'>
              <Heading
                as='h1'
                className='!text-3xl !lg:text-4xl font-bold my-4'
              >
                {title}
              </Heading>
            </div>
            <div className='text-gray-800'>
              <Text className='text-lg mb-12 opacity-90'>{introText}</Text>
              <div className='bg-gray-800 text-white py-3 px-5 mb-4 text-lg font-bold'>
                Recent Recipes
              </div>
              {recentRecipes?.map((recipe) => (
                <div key={recipe.id} className='flex mb-5'>
                  <Img
                    src={`${s3Url}${recipe.meal_image}`}
                    alt={recipe.name}
                    className='w-1/3 mr-8 rounded-10'
                  />
                  <div>
                    <p className='text-sm font-bold text-dark-primary'>
                      {recipe.recipe_category}
                    </p>
                    <p className='text-lg lg:text-3xl font-bold !m-0'>
                      {recipe.name}
                    </p>
                    <p className='text-sm lg:text-lg !m-0'>
                      {recipe.description}
                    </p>
                    <p className='my-4 w-full'></p>
                    <Link
                      href={`${baseUrl}/recipe/${recipe.query}`}
                      className='py-2 px-8 bg-primary text-white font-bold rounded-10 max-w-max whitespace-nowrap cursor-pointer no-underline'
                    >
                      View The Recipe
                    </Link>
                  </div>
                </div>
              ))}
              <div className='bg-gray-800 text-white py-3 px-5 mb-4 text-lg font-bold'>
                Popular Recipes
              </div>
              {popularRecipes?.map((recipe) => (
                <div key={recipe.id} className='flex mt-5'>
                  <Img
                    src={`${s3Url}${recipe.meal_image}`}
                    alt={recipe.name}
                    className='w-1/3 mr-8 rounded-10'
                  />
                  <div>
                    <p className='text-sm font-bold text-dark-primary '>
                      {recipe.recipe_category}
                    </p>
                    <p className='text-lg lg:text-3xl font-bold !m-0'>
                      {recipe.name}
                    </p>
                    <p className='text-sm lg:text-lg !m-0'>
                      {recipe.description}
                    </p>
                    <p className='my-4 w-full'></p>
                    <Link
                      href={`${baseUrl}/recipe/${recipe.query}`}
                      className='py-2 px-8 bg-primary text-white font-bold rounded-10 max-w-max whitespace-nowrap cursor-pointer no-underline'
                    >
                      View The Recipe
                    </Link>
                  </div>
                </div>
              ))}
              <div className='mt-12 flex flex-wrap justify-center'>
                {/* Footer links */}
                <Link
                  href={`${baseUrl}/about`}
                  className='font-bold text-sm text-black opacity-80 no-underline mr-3'
                >
                  About us
                </Link>
                <Link
                  href={`${baseUrl}/terms-of-service`}
                  className='font-bold text-sm text-black opacity-80 no-underline mr-3'
                >
                  Terms of service
                </Link>
                <Link
                  href={`${baseUrl}/privacy-policy`}
                  className='font-bold text-sm text-black opacity-80 no-underline mr-3'
                >
                  Privacy policy
                </Link>
                <Link
                  href={`${baseUrl}/unsubscribe/${unsubscribe_token}`}
                  className='font-bold text-sm text-black opacity-80 no-underline'
                >
                  Unsubscribe
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Tailwind>
    </Html>
  );
}
