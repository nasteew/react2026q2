import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';

import styles from './country-list.module.css';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
};

export const CountryList = ({
  countries,
  searchQuery,
  selectedColumns,
  selectedRegion,
  selectedYear,
  sortField,
  sortOrder,
}: CountryListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();

    const filtered = countries.filter((c) => {
      const matchesSearch = c.id.toLowerCase().includes(lowerSearch);
      const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);

      return matchesSearch && matchesRegion;
    });

    if (sortField === 'population') {
      const popMap = new Map<string, number>();

      for (const c of filtered) {
        const yearData = c.data.find((d) => d.year === selectedYear);
        popMap.set(c.id, yearData?.population || 0);
      }

      filtered.sort((a, b) => {
        const popA = popMap.get(a.id)!;
        const popB = popMap.get(b.id)!;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      });

      return filtered;
    }

    filtered.sort((a, b) =>
      sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    );

    return filtered;
  }, [countries, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

  const virtualizer = useVirtualizer({
    count: filteredCountries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    overscan: 3,
  });

  return (
    <div ref={parentRef} className={styles.countryList}>
      <div className={styles.listInner} style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => {
          const country = filteredCountries[item.index];

          return (
            <div
              key={country.id}
              className={styles.listItem}
              ref={virtualizer.measureElement}
              data-index={item.index}
              style={{ transform: `translateY(${item.start}px)` }}
            >
              <CountryCard
                country={country}
                selectedYear={selectedYear}
                selectedColumns={selectedColumns}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
