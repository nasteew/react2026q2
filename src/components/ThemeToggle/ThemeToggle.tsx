import Pokeball from '@/components/ui/icons/Pokeball';
import { useTheme } from '@/hooks/useTheme';

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        relative w-16 h-8 rounded-full
        bg-gradient-to-r from-blue-100 to-sky-400
        dark:from-gray-900 dark:to-indigo-950
        border-2 border-black shadow-md
        hover:scale-105 active:scale-95
        transition-all duration-500
        overflow-hidden cursor-pointer
      "
    >
      <span className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500">
        <span className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full" />
        <span className="absolute top-2 left-5 w-0.5 h-0.5 bg-white rounded-full" />
        <span className="absolute top-1 left-8 w-0.5 h-0.5 bg-white rounded-full" />
      </span>

      <span className="absolute right-1 top-1 opacity-100 dark:opacity-0 transition-opacity duration-300">
        <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none">
          <circle cx="8" cy="8" r="4" fill="#fbbf24" />
        </svg>
      </span>

      <span
        className="
          absolute top-0.5 left-0.5
          w-6 h-6 rounded-full
          flex items-center justify-center
          shadow-md border border-black/10
          transform transition-all duration-300
          ease-[cubic-bezier(0.34,1.56,0.64,1)]
          dark:translate-x-8 dark:rotate-180
        "
      >
        <Pokeball className="w-6 h-6" />
      </span>
    </button>
  );
};

export default ThemeToggle;
