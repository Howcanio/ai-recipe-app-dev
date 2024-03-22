'use client';

import { useState, useEffect } from 'react';
import { parseIngredientsCsv } from '../lib/s3Actions';

export default function useIngredientUrls() {
  const [ingredientUrls, setIngredientUrls] = useState<IngredientUrl[]>([]);

  useEffect(() => {
    async function fetchIngredientUrls() {
      const data: IngredientUrl[] = await parseIngredientsCsv();
      setIngredientUrls(data);
    }

    fetchIngredientUrls();
  }, []);

  return ingredientUrls;
}
