import { request } from './client';

import { BASE_URL } from '@/constants/api';

import type { Item } from '@/types/item';
import type { PokemonListItem, PokemonResponse } from '@/types/pokemonApi';
import type { PokemonTypeEntry } from '@/types/pokemonType';

export async function fetchPokemonList(page: number): Promise<Item[]> {
  const limit = 9;
  const offset = (page - 1) * limit;

  const data = await request<{
    results: PokemonListItem[];
  }>(`${BASE_URL}?limit=${limit}&offset=${offset}`);

  const detailedRequests: Promise<Item>[] = data.results.map((pokemon) =>
    fetchPokemon(pokemon.name)
  );

  return Promise.all(detailedRequests);
}

export async function fetchPokemon(name: string): Promise<Item> {
  try {
    const data = await request<PokemonResponse>(
      `${BASE_URL}/${name.toLowerCase()}`
    );

    return {
      name: data.name,

      image: data.sprites.other['official-artwork'].front_default,

      types: data.types.map((t: PokemonTypeEntry) => t.type.name),

      height: data.height,
      weight: data.weight,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Request failed with status 404'
    ) {
      throw new Error(`Pokémon "${name}" not found. Try a different name!`);
    }

    throw error;
  }
}
