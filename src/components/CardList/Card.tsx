import type { Item } from '@/types/item';

const Card = ({ item }: { item: Item }) => {
  return (
    <div>
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>Type: {item.type}</p>
      <p>Height: {item.height}</p>
      <p>Weight: {item.weight}</p>
    </div>
  );
};

export default Card;
