const SEARCH_KEY = 'searchTerm';

export const storage = {
  getSearch(): string {
    return localStorage.getItem(SEARCH_KEY) || '';
  },
  setSearch(value: string) {
    localStorage.setItem(SEARCH_KEY, value);
  },
  clearSearch() {
    localStorage.removeItem(SEARCH_KEY);
  },
};
