import type { Item } from '@/types/item';
import Card from './Card';

interface Props {
  items: Item[];
  search: string;
  page: string;
  isDetailOpen?: boolean;
}

export default function CardList({ items, search, page, isDetailOpen }: Props) {
  return (
    <div
      role="grid"
      className={`grid gap-4 ${
        isDetailOpen
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}
    >
      {items.map((item) => (
        <Card key={item.id} item={item} search={search} page={page} />
      ))}
    </div>
  );
}
