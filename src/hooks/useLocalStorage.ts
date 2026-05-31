import { useState } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const clearValue = () => {
    setStoredValue(initialValue);
    localStorage.removeItem(key);
  };

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;
