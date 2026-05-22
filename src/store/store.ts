import { create } from 'zustand';

interface Item {
  id: string;
  name: string;
  description: string;
  url: string;
}

interface SelectedItemsStore {
  items: Item[];
  toggleItem: (item: Item) => void;
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
