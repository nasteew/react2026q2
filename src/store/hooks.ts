import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

export const selectSubmissions = (state: RootState) => state.submissions.items;
export const selectCountries = (state: RootState) => state.countries.list;
