import { BASE_URL } from '@/constants/api';
import type { Item } from '@/types/item';
import type { PokemonTypeEntry } from '@/types/pokemonType';

export async function fetchPokemonList(page: number): Promise<Item[]> {
  const limit = 9;
  const offset = (page - 1) * limit;

  const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);

  if (!response.ok) {
    if (response.status >= 500)
      throw new Error('Server error. Please try again later.');
    throw new Error(`Failed to get Pokémon list (${response.status})`);
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
    if (response.status === 404)
      throw new Error(`Pokémon "${name}" not found. Try a different name!`);
    if (response.status >= 500)
      throw new Error('Server error. Please try again later.');
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  return {
    name: data.name,
    image: data.sprites.other['official-artwork'].front_default,
    types: data.types.map((t: PokemonTypeEntry) => t.type.name),
    height: data.height,
    weight: data.weight,
  };
}
