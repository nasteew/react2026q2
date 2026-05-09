import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { mockItem } from '../mocks/mockItem';

const mockPokemonResponse = {
  name: mockItem.name,
  sprites: {
    other: {
      'official-artwork': {
        front_default: mockItem.image,
      },
    },
  },
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  height: mockItem.height,
  weight: mockItem.weight,
};

export const handlers = [
  http.get(BASE_URL, () => {
    return HttpResponse.json({ results: [{ name: 'bulbasaur' }] });
  }),

  http.get(`${BASE_URL}/:name`, () => {
    return HttpResponse.json(mockPokemonResponse);
  }),
];
