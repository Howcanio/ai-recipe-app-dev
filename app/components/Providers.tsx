'use client';

import { NextUIProvider } from '@nextui-org/react';
import { RecipeSearchProvider } from '../contexts/RecipeSearchContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <RecipeSearchProvider> {children}</RecipeSearchProvider>
    </NextUIProvider>
  );
}
