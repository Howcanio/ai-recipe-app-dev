'use client';

import { usePathname } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ImageGallery from './ImageGallery';
import { useEffect, useRef, useState } from 'react';
import { parseCarouselUrl } from '@/app/lib/parsers';
import {
  getRecentCarouselRecipesByCategory,
  getRecentCarouselRecipesByCuisine,
} from '@/app/lib/dbActions';

export default function ImageGalleryCarousel({
  randomRecipes,
}: {
  randomRecipes: Recipe[] | [];
}) {
  const [recipes, setRecipes] = useState(randomRecipes);
  const paths = usePathname();
  const { type, lastSegment } = parseCarouselUrl(paths);
  const swiperRef = useRef<SwiperType>();
  const showCarousel =
    paths === '/' ||
    paths.includes('/category/') ||
    paths.includes('/cuisine/');

  useEffect(() => {
    async function fetchNewRecipes() {
      let newRecipes: Recipe[] | [] = [];
      if (type === 'cuisine') {
        newRecipes = (await getRecentCarouselRecipesByCuisine(lastSegment)) as
          | Recipe[]
          | [];
      } else if (type === 'category') {
        newRecipes = (await getRecentCarouselRecipesByCategory(lastSegment)) as
          | Recipe[]
          | [];
      }

      if (newRecipes.length > 0) {
        setRecipes(newRecipes);
      }
    }

    if (type === 'cuisine' || type === 'category') {
      fetchNewRecipes();
    } else {
      setRecipes(randomRecipes);
    }
  }, [type, lastSegment, randomRecipes]);

  const generateSlides = () => {
    let slides = [];
    for (let i = 0; i < recipes.length; i += 4) {
      // First slide with 1 recipe
      slides.push(
        <SwiperSlide key={`slide-${i}`}>
          <ImageGallery recipes={recipes.slice(i, i + 1)} />
        </SwiperSlide>
      );

      // Check if there are enough recipes for the next slide with 3 recipes
      if (i + 1 < recipes.length) {
        slides.push(
          <SwiperSlide key={`slide-${i + 1}`}>
            <ImageGallery recipes={recipes.slice(i + 1, i + 4)} />
          </SwiperSlide>
        );
      }
    }
    return slides;
  };

  return (
    showCarousel && (
      <>
        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation
          className='w-full bg-[url(https://wallpaper.dog/large/20355550.jpg)] rounded-10 absolute h-[25rem] top-56 md:top-64 lg:top-[19rem] xl:top-[24rem] left-0 py-5'
          spaceBetween={0}
          breakpoints={{
            360: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
            1560: {
              slidesPerView: 5,
            },
          }}
        >
          {generateSlides()}
        </Swiper>
      </>
    )
  );
}
