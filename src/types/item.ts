export interface Item {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
  baseExperience: number;
  moves: string[];
}
