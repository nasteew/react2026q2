import { createBrowserRouter, redirect } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { Home } from '@/pages/Home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { About } from '../pages/About/About';
import { NotFound } from '../pages/NotFound/NotFound';
import PokemonDetails from '../components/Details/PokemonDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AppLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
        loader: ({ request }) => {
          const url = new URL(request.url);

          if (!url.searchParams.get('page')) {
            url.searchParams.set('page', '1');
            return redirect(url.pathname + url.search);
          }

          return null;
        },
        children: [
          {
            index: true,
            element: <PokemonDetails />,
          },
        ],
      },
      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
