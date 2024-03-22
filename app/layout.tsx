import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './components/Providers';
import Layout from './components/Layout';
import ImageGalleryCarousel from './components/LandingPage/ImageGalleryCarousel';
import { getMostRecentRecipes } from './lib/dbActions';
import GoogleAdSense from './components/seo/GoogleAdSense';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  metadataBase: new URL('https://howcan.io'),
  title: 'Howcan.io',
  description: 'Discover AI-crafted recipes tailored for any taste!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mostRecentRecipesPromise = getMostRecentRecipes();
  const randomRecipes = (await mostRecentRecipesPromise) as Recipe[] | [];
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <GoogleAdSense />
      </head>
      <body>
        <Providers>
          <ToastContainer
            position='top-center'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
          <ImageGalleryCarousel randomRecipes={randomRecipes} />
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
