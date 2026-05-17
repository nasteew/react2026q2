import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { Home } from '../pages/Home/Home';
import { About } from '../pages/About/About';
import { NotFound } from '../pages/NotFound/NotFound';
import { PokemonDetails } from '../pages/Details/PokemonDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        children: [
          {
            path: 'pokemon/:id',
            element: <PokemonDetails />,
          },
        ],
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
