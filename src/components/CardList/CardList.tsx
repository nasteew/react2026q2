import type { Item } from '@/types/item';
import Card from './Card';

interface Props {
  items: Item[];
  onCardClick: (id: number) => void;
  isDetailOpen?: boolean;
}

const CardList = ({ items, onCardClick, isDetailOpen }: Props) => {
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
        <Card key={item.name} item={item} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardList;
