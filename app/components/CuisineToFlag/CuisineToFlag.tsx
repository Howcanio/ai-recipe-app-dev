import { getCode, overwrite } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { overwriteData } from './overwriteData';

export default function CuisineToFlag({ cuisine }: { cuisine: string }) {
  overwrite(overwriteData);
  const countryCode = getCode(cuisine);
  if (countryCode) {
    return (
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{
          width: '2em',
          height: '2em',
        }}
        title={cuisine}
        alt={cuisine}
      />
    );
  } else {
    return (
      <p>
        Cuisine: <span className='italic'>{cuisine}</span>
      </p>
    );
  }
}
