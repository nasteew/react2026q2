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
}

export interface PokemonListItem {
  name: string;
}
