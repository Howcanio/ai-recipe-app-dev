import { convertServingToInt, parsePostgreSQLArray } from '@/app/lib/parsers';
import Script from 'next/script';

const GoogleImageScript = ({ recipe }: { recipe: Recipe }) => {
  const imageBaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL as string;

  const jsonLdScriptContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    url: imageBaseUrl + recipe.meal_image,
    caption: `Image representing ${recipe.name}`,
  });
  return (
    <Script id='recipe' type='application/ld+json' strategy='lazyOnload'>
      {jsonLdScriptContent}
    </Script>
  );
};

export default GoogleImageScript;
