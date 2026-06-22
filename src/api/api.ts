import { request } from './client';
import { BASE_URL } from '@/constants/api';
import type { Item } from '@/types/item';
import type { PokemonListItem, PokemonResponse } from '@/types/pokemonApi';
import type { PokemonTypeEntry } from '@/types/pokemonType';
import { ApiError } from './errors';
import { ERROR_CODES } from '@/constants/errors';

export async function fetchPokemon(name: string): Promise<Item> {
  try {
    const data = await request<PokemonResponse>(
      `${BASE_URL}/${name.toLowerCase()}`
    );
    return {
      id: data.id,
      name: data.name,
      image: data.sprites?.other?.['official-artwork']?.front_default,
      types: data.types.map((t: PokemonTypeEntry) => t.type.name),
      height: data.height,
      weight: data.weight,
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
      baseExperience: data.base_experience,
      moves: data.moves.map((m) => m.move.name),
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Request failed with status 404'
    ) {
      throw new ApiError(ERROR_CODES.POKEMON_NOT_FOUND);
    }
    if (
      error instanceof Error &&
      error.message === 'Request failed with status 400'
    ) {
      throw new ApiError(ERROR_CODES.BAD_REQUEST);
    }
    throw new ApiError(ERROR_CODES.SERVER_ERROR);
  }
}

export async function fetchPokemonList(
  page: number
): Promise<{ items: Item[]; totalPages: number }> {
  try {
    const limit = 12;
    const offset = (page - 1) * limit;
    const data = await request<{ results: PokemonListItem[]; count: number }>(
      `${BASE_URL}?limit=${limit}&offset=${offset}`
    );
    const items = await Promise.all(
      data.results.map((pokemon) => fetchPokemon(pokemon.name))
    );
    return { items, totalPages: Math.ceil(data.count / limit) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(ERROR_CODES.SERVER_ERROR);
  }
}
