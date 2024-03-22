import CuisineToFlag from '@/app/components/CuisineToFlag/CuisineToFlag';

export default function MealTypes({
  category,
  cuisine,
}: {
  category: string;
  cuisine: string;
}) {
  return (
    <section className=' border-y-1 border-gray-300 py-3 flex justify-between text-gray-700 font-medium'>
      <p>
        Category: <span className='italic'>{category}</span>
      </p>
      <CuisineToFlag cuisine={cuisine} />
    </section>
  );
}
