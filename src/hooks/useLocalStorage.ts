import { useState } from 'react';

const SEARCH_KEY = 'searchTerm';

type UseLocalStorageReturn = [string, (value: string) => void, () => void];

function useLocalStorage(): UseLocalStorageReturn {
  const [searchTerm, setSearchTerm] = useState(
    () => localStorage.getItem(SEARCH_KEY) ?? ''
  );

  const setValue = (value: string) => {
    setSearchTerm(value);
    localStorage.setItem(SEARCH_KEY, value);
  };

  const clearValue = () => {
    setSearchTerm('');
    localStorage.removeItem(SEARCH_KEY);
  };

  return [searchTerm, setValue, clearValue];
}

export default useLocalStorage;
