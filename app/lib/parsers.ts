export const parsePostgreSQLArray = (array: string[]) => {
  return array[0].slice(2, -2).split('","');
};

export const capitalizeFirstLetterOfEveryWord = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const convertISO8601ToReadable = (duration: string) => {
  const pattern =
    /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
  const matches = duration.match(pattern);

  if (!matches) {
    return 'Invalid duration';
  }

  const hours = matches[4] ? parseInt(matches[4]) : 0;
  const minutes = matches[5] ? parseInt(matches[5]) : 0;
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes === 0) {
    return '0 min';
  } else {
    return `${totalMinutes} min`;
  }
};

export function isValidEmail(email: string) {
  const regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexPattern.test(email);
}

export function stringToSlug(query: string) {
  return query
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function slugToString(slug: string) {
  return slug.replace(/-/g, ' ');
}

export function substitutePlaceholders(
  template: string,
  values: { [key: string]: string }
): string {
  return template.replace(/\$\{(\w+)\}/g, (placeholder, key) => {
    return values.hasOwnProperty(key) ? values[key] : placeholder;
  });
}

export function convertServingToInt(serving: string) {
  const match = serving.match(/^\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  return null;
}

export function parseCarouselUrl(url: string) {
  // Identify if URL is for category or cuisine or something else
  let type = 'other';
  if (url.includes('/category/')) {
    type = 'category';
  } else if (url.includes('/cuisine/')) {
    type = 'cuisine';
  }

  // Extract the last part of the URL based on the type
  let lastSegment = '';
  if (type !== 'other') {
    lastSegment = url.split(`/${type}/`).pop() || '';
  }

  // Return the extracted data
  return {
    type,
    lastSegment: capitalizeFirstLetterOfEveryWord(slugToString(lastSegment)),
  };
}
