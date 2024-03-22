'use client';

import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/react';

import { useRouter } from 'next/navigation';
import { capitalizeFirstLetterOfEveryWord, stringToSlug } from '../lib/parsers';

// Change this so it fetches the recipe and create breadcrumb from it instead of this or pass the recipe here
export default function BreadcrumbsUI({
  className,
  recipe,
}: {
  className?: string;
  recipe: Recipe;
}) {
  const router = useRouter();
  if (recipe) {
    const cuisineSlug = stringToSlug(recipe.recipe_cuisine);
    const categorySlug = stringToSlug(recipe.recipe_category);
    const nameSlug = stringToSlug(recipe.name);

    const breadcrumbs = [
      { name: 'Home', path: '/' },
      {
        name: capitalizeFirstLetterOfEveryWord(recipe.recipe_category),
        path: `/category/${categorySlug}`,
      },
      {
        name: capitalizeFirstLetterOfEveryWord(recipe.recipe_cuisine),
        path: `/cuisine/${cuisineSlug}`,
      },
      {
        name: capitalizeFirstLetterOfEveryWord(recipe.name),
        path: `/recipe/${nameSlug}`,
      },
    ];

    return (
      <Breadcrumbs
        size='lg'
        className={`px-10 py-5 font-medium ${className}`}
        onAction={(key) => {
          const breadcrumb = breadcrumbs.find((b) => b.name === key);
          if (breadcrumb) {
            router.push(breadcrumb.path);
          }
        }}
      >
        {breadcrumbs.map((breadcrumb) => (
          <BreadcrumbItem key={breadcrumb.name}>
            {breadcrumb.name}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    );
  }
}
