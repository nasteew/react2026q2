import { create } from 'zustand';

interface SelectedItem {
  id: string;
  name: string;
  types: string;
  height: number;
  weight: number;
  abilities: string;
  baseExperience: number;
  url: string;
}

interface SelectedItemsStore {
  items: SelectedItem[];
  toggleItem: (item: SelectedItem) => void;
  unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsStore>((set) => ({
  items: [],
  toggleItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id);
      return {
        items: exists
          ? state.items.filter((i) => i.id !== item.id)
          : [...state.items, item],
      };
    }),
  unselectAll: () => set({ items: [] }),
}));
