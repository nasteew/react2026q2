import type { Item } from '@/types/item';

export const mockItem: Item = {
  id: 1,
  name: 'bulbasaur',
  image: 'https://example.com/bulbasaur.png',
  types: ['grass', 'poison'],
  height: 7,
  weight: 69,
  baseExperience: 64,
  abilities: ['overgrow', 'chlorophyll'],
  stats: [
    { name: 'hp', value: 45 },
    { name: 'attack', value: 49 },
    { name: 'defense', value: 49 },
  ],
  moves: [
    'tackle',
    'growl',
    'vine whip',
    'razor leaf',
    'sleep powder',
    'poison powder',
  ],
};
