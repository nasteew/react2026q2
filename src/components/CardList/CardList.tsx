import type { Item } from '@/types/item';
import Card from './Card';

interface Props {
  items: Item[];
}

const CardList = ({ items }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  );
};

export default CardList;
