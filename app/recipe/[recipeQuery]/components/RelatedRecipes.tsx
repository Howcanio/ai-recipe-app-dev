'use client';
import RelatedRecipeCard from './RelatedRecipeCard';

export default function RelatedRecipes({
  relatedRecipes,
  className,
}: {
  relatedRecipes: RelatedRecipe[];
  className?: string;
}) {
  return (
    <section className={`flex flex-col gap-4 md:gap-8 py-8 ${className}`}>
      <div className='text-base md:text-xl font-bold lg:text-2xl bg-white p-2 rounded-10 max-w-max'>
        Related Recipes:
      </div>
      <div className='flex flex-row items-start justify-center flex-wrap gap-4 lg:gap-10'>
        {relatedRecipes.map((recipe: RelatedRecipe) => (
          <RelatedRecipeCard key={recipe.name} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
