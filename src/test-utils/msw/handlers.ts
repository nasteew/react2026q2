import { http, HttpResponse } from 'msw';
import { BASE_URL } from '@/constants/api';
import { mockItem } from '../mocks/mockItem';
import type { PokemonResponse } from '@/types/pokemonApi';

export const mockPokemonResponse: PokemonResponse = {
  id: mockItem.id,
  name: mockItem.name,

  sprites: {
    other: {
      'official-artwork': {
        front_default: mockItem.image,
      },
    },
  },

  types: mockItem.types.map((type) => ({
    type: { name: type },
  })),

  height: mockItem.height,
  weight: mockItem.weight,

  base_experience: mockItem.baseExperience,

  abilities: mockItem.abilities.map((ability) => ({
    ability: { name: ability },
  })),

  stats: mockItem.stats.map((stat) => ({
    base_stat: stat.value,
    stat: { name: stat.name },
  })),

  moves: mockItem.moves.map((move) => ({
    move: { name: move },
  })),
};

export const handlers = [
  http.get(BASE_URL, () => {
    return HttpResponse.json({
      results: [
        {
          name: 'bulbasaur',
          url: `${BASE_URL}/bulbasaur`,
        },
      ],
      count: 1302,
    });
  }),

  http.get(`${BASE_URL}/:name`, () => {
    return HttpResponse.json(mockPokemonResponse);
  }),
];
