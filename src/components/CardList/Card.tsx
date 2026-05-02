import type { Item } from '@/types/item';
import Pokeball from '../ui/icons/Pokeball';
import { typeStyles } from '@/constants/typeStyles';

interface Props {
  item: Item;
}

const Card = ({ item }: Props) => {
  const style = typeStyles[item.type] || typeStyles.default;

  return (
    <article
      className={`
        group bg-white rounded-2xl overflow-hidden
        border-2 border-black ${style.border}
        shadow-sm
        transition-transform duration-300
        hover:shadow-lg hover:-translate-y-1
      `}
    >
      <div
        className={`relative h-44 flex items-center justify-center ${style.gradient}`}
      >
        <div className="absolute inset-0 bg-black/6 pointer-events-none" />

        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            width={320}
            height={176}
            className="max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute left-3 top-3 z-20">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-white bg-gradient-to-br ${style.accent}`}
            title={item.type}
          >
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/90 p-[2px] border border-black/10">
              <Pokeball className="w-3 h-3" />
            </span>
            <span className="uppercase tracking-wide">{item.type}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 capitalize">
          {item.name}
        </h3>

        <div className={`my-1 border-t ${style.border}`} />

        <div className="mt-3 text-sm text-gray-600">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-gray-700">Height:</span>
              <span className="text-gray-800">{item.height ?? '—'}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-gray-700">Weight:</span>
              <span className="text-gray-800">{item.weight ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Card;
