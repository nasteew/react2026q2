import type { PokemonTypeEntry } from './pokemonType';

export interface PokemonResponse {
  name: string;
  height: number;
  weight: number;

  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };

  types: PokemonTypeEntry[];

  abilities: {
    ability: { name: string };
  }[];

  stats: {
    base_stat: number;
    stat: { name: string };
  }[];

  base_experience: number;

  moves: {
    move: { name: string };
  }[];
}

export interface PokemonListItem {
  name: string;
}
