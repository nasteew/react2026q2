import Pokeball from '../ui/icons/Pokeball';
import Button from '../ui/Button/Button';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function Search({ value, onChange, onSubmit }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-4 items-center max-w-4xl mx-auto p-4"
      role="search"
      aria-label="Search Pokémon"
    >
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Pokeball className="w-5 h-5" />
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border-2 border-black rounded-md px-3 py-2 pl-12 bg-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white transition"
          placeholder="Enter Pokémon name..."
          aria-label="Enter Pokémon name"
        />
      </div>

      <Button
        onClick={onSubmit}
        label="Search"
        className="bg-red-700 to-yellow-400 focus:ring-white"
      />
    </form>
  );
}
