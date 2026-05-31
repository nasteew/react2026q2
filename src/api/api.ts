import { request } from './client';
import { BASE_URL } from '@/constants/api';
import type { Item } from '@/types/item';
import type { PokemonListItem, PokemonResponse } from '@/types/pokemonApi';
import type { PokemonTypeEntry } from '@/types/pokemonType';

export async function fetchPokemonList(
  page: number,
  signal?: AbortSignal
): Promise<{ items: Item[]; totalPages: number }> {
  const limit = 12;
  const offset = (page - 1) * limit;

  const data = await request<{ results: PokemonListItem[]; count: number }>(
    `${BASE_URL}?limit=${limit}&offset=${offset}`,
    { signal }
  );

  const items = await Promise.all(
    data.results.map((pokemon) => fetchPokemon(pokemon.name, signal))
  );

  return { items, totalPages: Math.ceil(data.count / limit) };
}

export async function fetchPokemon(
  name: string,
  signal?: AbortSignal
): Promise<Item> {
  try {
    const data = await request<PokemonResponse>(
      `${BASE_URL}/${name.toLowerCase()}`,
      { signal }
    );

    return {
      id: data.id,
      name: data.name,
      image: data.sprites?.other?.['official-artwork']?.front_default,
      types: data.types.map((t: PokemonTypeEntry) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      baseExperience: data.base_experience,
      moves: data.moves.map((m) => m.move.name),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw error;

    if (
      error instanceof Error &&
      error.message === 'Request failed with status 404'
    ) {
      throw new Error(`Pokémon "${name}" not found. Try a different name!`);
    }

    throw error;
  }
}
