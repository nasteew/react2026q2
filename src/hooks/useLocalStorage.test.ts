import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initial value', () => {
    it('returns empty string when localStorage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      expect(result.current[0]).toBe('');
    });

    it('returns stored value when localStorage has data', () => {
      localStorage.setItem('searchTerm', JSON.stringify('pikachu'));
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      expect(result.current[0]).toBe('pikachu');
    });
  });

  describe('setValue', () => {
    it('saves value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      act(() => {
        result.current[1]('bulbasaur');
      });
      expect(JSON.parse(localStorage.getItem('searchTerm')!)).toBe('bulbasaur');
    });

    it('updates state value', () => {
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      act(() => {
        result.current[1]('bulbasaur');
      });
      expect(result.current[0]).toBe('bulbasaur');
    });
  });

  describe('clearValue', () => {
    it('removes value from localStorage', () => {
      localStorage.setItem('searchTerm', JSON.stringify('charmander'));
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      act(() => {
        result.current[2]();
      });
      expect(localStorage.getItem('searchTerm')).toBeNull();
    });

    it('resets state to empty string', () => {
      localStorage.setItem('searchTerm', JSON.stringify('charmander'));
      const { result } = renderHook(() => useLocalStorage('searchTerm', ''));
      act(() => {
        result.current[2]();
      });
      expect(result.current[0]).toBe('');
    });
  });
});
