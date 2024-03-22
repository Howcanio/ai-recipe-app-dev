import ImageGalleryCard from './ImageGalleryCard';

export default function ImageGallery({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 3)
    return (
      <div className='max-w-80 h-full flex flex-col gap-4 mx-auto'>
        <div className='h-full w-full flex gap-4'>
          {recipes.slice(0, 2).map((recipe) => (
            <ImageGalleryCard
              key={recipe.id}
              recipe={recipe}
              className='h-full'
              cardBodyStyles='flex flex-col gap-2'
              imageStyles='w-[7.5rem]'
              recipeCuisine={false}
              cookingTime={false}
            />
          ))}
        </div>
        <ImageGalleryCard
          key={recipes[2].id}
          recipe={recipes[2]}
          className='h-full'
          cardBodyStyles='items-start'
          imageStyles='w-52'
          recipeCuisine={true}
          cookingTime={false}
        />
      </div>
    );
  else if (recipes.length === 1)
    return (
      <div className='h-full items-center max-w-64 mx-auto'>
        <ImageGalleryCard
          key={recipes[0].id}
          recipe={recipes[0]}
          className='h-full'
          cardBodyStyles='flex-col'
          imageStyles='w-56'
          recipeCuisine={false}
          cookingTime={true}
        />
      </div>
    );
  else return null;
}
