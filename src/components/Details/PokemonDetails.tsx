import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { fetchPokemon } from '@/api/api';
import { typeStyles } from '@/constants/typeStyles';
import Pokeball from '@/components/ui/icons/Pokeball';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { DetailsRefreshButton } from '@/components/RefreshButton/DetailsRefreshButton';

interface Props {
  id: string;
  search: string;
  page: string;
}

export default async function PokemonDetails({ id, search, page }: Props) {
  const t = await getTranslations('errors');
  const closeQuery: Record<string, string> = { page };
  if (search) closeQuery.search = search;

  let data;
  try {
    data = await fetchPokemon(id);
  } catch (error) {
    return (
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4">
        <Link
          href={{ pathname: '/', query: closeQuery }}
          className="cursor-pointer inline-flex items-center justify-center
    font-semibold rounded-xl border-2 border-black shadow-lg
    active:scale-95 transform transition-transform duration-150 ease-out
    hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring-2
    motion-reduce:transition-none
    bg-red-700 dark:bg-red-900 text-white
    px-3 py-2"
        >
          ✕
        </Link>
        <ErrorMessage message={getErrorMessage(error, t)} />
      </div>
    );
  }

  const types = data.types;
  const primary = typeStyles[types[0]] || typeStyles.default;
  const secondary = typeStyles[types[1]] || primary;
  const gradient = `bg-gradient-to-br ${primary.from} ${secondary.to}`;

  return (
    <div
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
        border-2 border-black ${primary.border}
        shadow-lg transition-colors duration-300
      `}
    >
      <div className="absolute top-3 right-3 z-30 flex gap-2">
        <DetailsRefreshButton pokemonId={id} />
        <Link
          href={{ pathname: '/', query: closeQuery }}
          className={`
    cursor-pointer inline-flex items-center justify-center
    font-semibold rounded-xl border-2 border-black shadow-lg
    active:scale-95 transform transition-transform duration-150 ease-out
    hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring-2
    motion-reduce:transition-none
    bg-red-700 dark:bg-red-900 text-white
    px-3 py-2
  `}
        >
          ✕
        </Link>
      </div>
      <div
        className={`relative h-60 flex items-center justify-center ${gradient}`}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {data.image ? (
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes="500px"
            className="object-contain p-6 drop-shadow-xl"
            loading="eager"
            priority
          />
        ) : (
          <Pokeball className="relative z-10 w-20 h-20 opacity-70" />
        )}

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

      <div className="p-5 space-y-4">
        <h2 className="text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">
          {data.name}
        </h2>

        <div className={`border-t ${primary.border}`} />

        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Height:
            </span>
            <span>{data.height}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Weight:
            </span>
            <span>{data.weight}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Base XP:
            </span>
            <span>{data.baseExperience}</span>
          </div>
        </div>

        {data.abilities.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Abilities
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {data.abilities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {data.stats.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Stats
            </h3>
            <div className="space-y-1">
              {data.stats.map((s) => (
                <div
                  key={s.name}
                  className="flex justify-between text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="capitalize">{s.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.moves.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Moves
            </h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {data.moves.slice(0, 20).map((m) => (
                <span
                  key={m}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full border border-black/20 dark:border-white/10"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
