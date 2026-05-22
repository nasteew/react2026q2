import { useSearchParams } from 'react-router-dom';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Pokeball from '@/components/ui/icons/Pokeball';
import { typeStyles } from '@/constants/typeStyles';
import { usePokemonDetailsQuery } from '@/hooks/usePokemonDetailsQuery';

export default function PokemonDetails() {
  const [params] = useSearchParams();
  const id = params.get('details');

  const { data, loading, error } = usePokemonDetailsQuery(id);

  if (!id) return <ErrorMessage message="Pokemon not found" />;
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return <ErrorMessage message="Something went wrong" />;

  const types = data.types;
  const primary = typeStyles[types[0]] || typeStyles.default;
  const secondary = typeStyles[types[1]] || primary;

  const gradient = `bg-gradient-to-br ${primary.from} ${secondary.to}`;

  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden border-2 border-black
        ${primary.border} shadow-lg
      `}
    >
      <div
        className={`relative h-60 flex items-center justify-center ${gradient}`}
      >
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />

        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className="relative z-10 max-h-50 object-contain drop-shadow-xl"
          />
        ) : (
          <Pokeball className="w-20 h-20 opacity-70" />
        )}

        <div className="absolute left-3 top-3 z-20 flex gap-2 flex-wrap">
          {types.map((type: string) => {
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
        <h2 className="text-2xl font-bold capitalize text-gray-900">
          {data.name}
        </h2>

        <div className={`border-t ${primary.border}`} />

        <div className="text-sm text-gray-700 space-y-2">
          <div className="flex gap-2">
            <span className="font-semibold">Height:</span>
            <span>{data.height}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Weight:</span>
            <span>{data.weight}</span>
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Base XP:</span>
            <span>{data.baseExperience}</span>
          </div>
        </div>

        {data.abilities && data.abilities.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Abilities</h3>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {data.abilities.map((a: string) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        )}

        {data.stats && data.stats.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Stats</h3>
            <div className="space-y-1">
              {data.stats.map((s: { name: string; value: number }) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="capitalize">{s.name}</span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.moves && data.moves.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Moves</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              {data.moves.slice(0, 20).map((m: string) => (
                <span
                  key={m}
                  className="px-2 py-1 bg-gray-200 rounded-full border border-black/20"
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
