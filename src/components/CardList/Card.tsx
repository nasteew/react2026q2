import type { Item } from '@/types/item';
import Pokeball from '../ui/icons/Pokeball';
import { typeStyles } from '@/constants/typeStyles';

interface Props {
  item: Item;
}

const Card = ({ item }: Props) => {
  const types = item.types ?? [];

  const primary = typeStyles[types[0]] || typeStyles.default;
  const secondary = typeStyles[types[1]] || primary;

  const gradient = `bg-gradient-to-br ${primary.from} ${secondary.to}`;

  return (
    <article
      className={`
        group bg-white rounded-2xl overflow-hidden
        border-2 border-black ${primary.border}
        shadow-sm
        transition-transform duration-300
        hover:shadow-lg hover:-translate-y-1
      `}
    >
      <div
        className={`relative h-44 flex items-center justify-center ${gradient}`}
      >
        <div className="absolute inset-0 bg-black/6 pointer-events-none" />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute left-3 top-3 z-20 flex gap-2 flex-wrap">
          {types.map((type) => {
            const style = typeStyles[type] || typeStyles.default;

            return (
              <div
                key={type}
                className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-br ${style.accent}`}
              >
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white/90 p-[2px]">
                  <Pokeball className="w-2 h-2" />
                </span>
                <span className="uppercase">{type}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize truncate">
          {item.name}
        </h3>

        <div className={`my-2 border-t ${primary.border}`} />

        <p className="text-sm text-gray-600">Types: {types.join(', ')}</p>

        <div className="mt-2 text-sm text-gray-600">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="font-semibold">Height:</span>
              <span>{item.height ?? '—'}</span>
            </div>

            <div className="flex gap-2">
              <span className="font-semibold">Weight:</span>
              <span>{item.weight ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
