import { act } from 'react';
import { useSelectedItemsStore } from './store';

const mockItem = {
  id: '1',
  name: 'bulbasaur',
  types: 'grass | poison',
  height: 7,
  weight: 69,
  abilities: 'overgrow | chlorophyll',
  baseExperience: 64,
  url: 'https://pokeapi.co/api/v2/pokemon/1',
};

const mockItem2 = {
  id: '2',
  name: 'ivysaur',
  types: 'grass | poison',
  height: 10,
  weight: 130,
  abilities: 'overgrow | chlorophyll',
  baseExperience: 142,
  url: 'https://pokeapi.co/api/v2/pokemon/2',
};

beforeEach(() => {
  useSelectedItemsStore.setState({ items: [] });
});

describe('useSelectedItemsStore', () => {
  it('should have empty items initially', () => {
    const { items } = useSelectedItemsStore.getState();
    expect(items).toHaveLength(0);
  });

  it('should add item when toggleItem is called', () => {
    act(() => {
      useSelectedItemsStore.getState().toggleItem(mockItem);
    });
    expect(useSelectedItemsStore.getState().items).toHaveLength(1);
    expect(useSelectedItemsStore.getState().items[0].id).toBe('1');
  });

  it('should remove item when toggleItem is called on already selected item', () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    act(() => {
      useSelectedItemsStore.getState().toggleItem(mockItem);
    });
    expect(useSelectedItemsStore.getState().items).toHaveLength(0);
  });

  it('should add multiple items', () => {
    act(() => {
      useSelectedItemsStore.getState().toggleItem(mockItem);
      useSelectedItemsStore.getState().toggleItem(mockItem2);
    });
    expect(useSelectedItemsStore.getState().items).toHaveLength(2);
  });

  it('should remove only the toggled item', () => {
    useSelectedItemsStore.setState({ items: [mockItem, mockItem2] });
    act(() => {
      useSelectedItemsStore.getState().toggleItem(mockItem);
    });
    const { items } = useSelectedItemsStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('2');
  });

  it('should clear all items when unselectAll is called', () => {
    useSelectedItemsStore.setState({ items: [mockItem, mockItem2] });
    act(() => {
      useSelectedItemsStore.getState().unselectAll();
    });
    expect(useSelectedItemsStore.getState().items).toHaveLength(0);
  });

  it('should not fail when unselectAll is called on empty store', () => {
    act(() => {
      useSelectedItemsStore.getState().unselectAll();
    });
    expect(useSelectedItemsStore.getState().items).toHaveLength(0);
  });
});
