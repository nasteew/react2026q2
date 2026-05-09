import type { Item } from '@/types/item';
import { fetchPokemon, fetchPokemonList } from './api';

export const pokemonService = {
  getPage(page: number): Promise<Item[]> {
    return fetchPokemonList(page);
  },

  getByName(name: string): Promise<Item> {
    return fetchPokemon(name);
  },
};
