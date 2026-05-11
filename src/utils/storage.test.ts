import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getSearch', () => {
    it('returns saved search term', () => {
      localStorage.setItem('searchTerm', 'pikachu');

      expect(storage.getSearch()).toBe('pikachu');
    });

    it('returns empty string when localStorage is empty', () => {
      expect(storage.getSearch()).toBe('');
    });
  });

  describe('setSearch', () => {
    it('saves search term to localStorage', () => {
      storage.setSearch('bulbasaur');

      expect(localStorage.getItem('searchTerm')).toBe('bulbasaur');
    });
  });

  describe('clearSearch', () => {
    it('removes search term from localStorage', () => {
      localStorage.setItem('searchTerm', 'charmander');

      storage.clearSearch();

      expect(localStorage.getItem('searchTerm')).toBeNull();
    });
  });
});
