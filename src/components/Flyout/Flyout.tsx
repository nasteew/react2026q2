import { useSelectedItemsStore } from '@/store/store';
import { useRef } from 'react';
import Pokeball from '../ui/icons/Pokeball';
import Button from '../ui/Button/Button';

const Flyout = () => {
  const items = useSelectedItemsStore((state) => state.items);
  const unselectAll = useSelectedItemsStore((state) => state.unselectAll);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    const separator = ';';
    const header = [
      'id',
      'name',
      'types',
      'height',
      'weight',
      'abilities',
      'base_experience',
      'url',
    ].join(separator);

    const rows = items.map((i) =>
      [
        i.id,
        i.name,
        i.types,
        i.height,
        i.weight,
        i.abilities,
        i.baseExperience,
        i.url,
      ]
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(separator)
    );

    const csv = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    if (anchorRef.current) {
      anchorRef.current.href = url;
      anchorRef.current.download = `${items.length}_items.csv`;
      anchorRef.current.click();
      URL.revokeObjectURL(url);
    }
  };

  if (items.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
      data-testid="flyout"
    >
      <a ref={anchorRef} className="hidden" aria-hidden="true" />

      <div
        className="
          flex items-center gap-4 px-5 py-3
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-md
          border border-red-100 dark:border-red-900
          rounded-2xl shadow-lg min-w-max
        "
      >
        <div className="w-8 h-8 rounded-full bg-red-400 dark:bg-red-700 flex items-center justify-center shadow-sm shrink-0">
          <Pokeball className="w-6 h-5" />
        </div>

        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
            Selected{' '}
            <span className="text-red-500 dark:text-red-400">
              {items.length}
            </span>{' '}
            {items.length === 1 ? 'item' : 'items'}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Ready to download
          </span>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 shrink-0" />

        <Button
          onClick={unselectAll}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            bg-gray-50/80 dark:bg-gray-800
            rounded-xl border border-gray-300 dark:border-gray-600
            hover:bg-gray-100 dark:hover:bg-gray-700
            text-sm font-semibold text-gray-600 dark:text-gray-300
            whitespace-nowrap shadow-sm transition
          "
          data-testid="unselect-all"
          label="Clear All ✕"
        />

        <Button
          onClick={handleDownload}
          className="
            px-3 py-1.5 rounded-xl
            bg-red-600 dark:bg-red-800
            hover:bg-red-700 dark:hover:bg-red-700
            text-white whitespace-nowrap shadow-sm transition
          "
          data-testid="download"
          label="Download ↓"
        />
      </div>
    </div>
  );
};

export default Flyout;
