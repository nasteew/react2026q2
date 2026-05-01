import { BASE_URL } from '@/constants/api';
import type { Item } from '@/types/item';

export async function fetchPokemonList(page: number): Promise<Item[]> {
  const limit = 20;
  const offset = (page - 1) * limit;

  const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }

  const data = await response.json();

  const detailedRequests: Promise<Item>[] = data.results.map(
    (pokemon: { name: string }) => fetchPokemon(pokemon.name)
  );

  return Promise.all(detailedRequests);
}

export async function fetchPokemon(name: string): Promise<Item> {
  const response = await fetch(`${BASE_URL}/${name.toLowerCase()}`);

  if (!response.ok) {
    throw new Error('Pokémon not found');
  }

  const data = await response.json();

  return {
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    type: data.types[0].type.name,
    height: data.height,
    weight: data.weight,
  };
}
