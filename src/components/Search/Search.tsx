import Pokeball from '../ui/icons/Pokeball';
import Button from '../ui/Button/Button';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

function Search({ value, onChange, onSubmit }: Props) {
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
          className="
            w-full border-2 border-black rounded-md px-3 py-2 pl-12
            bg-white dark:bg-gray-800
            text-sm text-gray-900 dark:text-gray-100
            placeholder-gray-600 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-white dark:focus:ring-gray-600
            transition-colors duration-200
          "
          placeholder="Enter Pokémon name..."
          aria-label="Enter Pokémon name"
        />
      </div>

      <Button
        onClick={onSubmit}
        label="Search"
        className="text-white bg-red-700 dark:bg-red-900 focus:ring-white px-5 py-2"
      />
    </form>
  );
}

export default Search;
