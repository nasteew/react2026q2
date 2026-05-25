import Pokeball from '@/components/ui/icons/Pokeball';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="relative flex justify-center items-center h-40">
          <Pokeball className="absolute w-48 h-48 opacity-5 rotate-12" />
          <div className="relative animate-bounce z-10">
            <Pokeball className="w-24 h-24 drop-shadow-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-black text-gray-900 dark:text-gray-100 leading-none tracking-tighter">
            404
          </h1>
          <div className="w-12 h-1 bg-red-500 dark:bg-red-700 rounded mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Page not found
          </p>
        </div>

        <Link
          to="/?page=1"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-red-500 dark:bg-red-800
            hover:bg-red-600 dark:hover:bg-red-700
            text-white font-semibold
            active:scale-95 transition-all shadow-md
          "
        >
          Back to App
        </Link>
      </div>
    </div>
  );
}
