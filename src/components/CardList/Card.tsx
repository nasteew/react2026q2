import type { Item } from '@/types/item';
import Pokeball from '../ui/icons/Pokeball';
import { typeStyles } from '@/constants/typeStyles';
import { useSelectedItemsStore } from '@/store/store';

interface Props {
  item: Item;
  onClick: (name: number) => void;
}

const Card = ({ item, onClick }: Props) => {
  const types = item.types;

  const primary = typeStyles[types[0]] || typeStyles.default;
  const secondary = typeStyles[types[1]] || primary;

  const gradient = `bg-gradient-to-br ${primary.from} ${secondary.to}`;

  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);
  const isChecked = useSelectedItemsStore((state) =>
    state.items.some((i) => i.id === String(item.id))
  );

  return (
    <article
      className={`
        group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden relative
        border-2 border-black ${primary.border}
        shadow-sm
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        cursor-pointer
      `}
      onClick={() => onClick(item.id)}
      data-testid={`card-${item.id}`}
    >
      <div
        className="absolute top-3 right-3 z-30"
        onClick={(e) => e.stopPropagation()}
        data-testid={`checkbox-${item.id}`}
      >
        <label className="cursor-pointer">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() =>
              toggleItem({
                id: String(item.id),
                name: item.name,
                types: item.types.join(' | '),
                height: item.height,
                weight: item.weight,
                abilities: item.abilities.join(' | '),
                baseExperience: item.baseExperience,
                url: item.image,
              })
            }
            className="sr-only"
          />

          <div
            className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 border-white
        ${
          isChecked
            ? `${primary.solid} border-transparent shadow-md scale-110`
            : 'bg-white/70 hover:bg-white hover:scale-110 backdrop-blur-sm'
        }
      `}
          >
            {isChecked && (
              <svg
                className="w-3 h-3 text-white"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6l3 3 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </label>
      </div>

      <div
        className={`relative h-50 flex items-center justify-center ${gradient}`}
      >
        <div className="absolute inset-0 bg-black/6 pointer-events-none" />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Pokeball className="w-20 h-20 opacity-70" />
          )}
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize truncate">
          {item.name}
        </h3>

        <div className={`my-2 border-t ${primary.border}`} />

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Types: {types.join(', ')}
        </p>

        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Height:
              </span>
              <span>{item.height}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Weight:
              </span>
              <span>{item.weight}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
