import Pokeball from '@/components/ui/icons/Pokeball';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-lg w-full overflow-hidden">
        <div className="bg-red-500 dark:bg-red-950 p-8 flex flex-col items-center gap-3 transition-colors duration-300">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
            <Pokeball className="h-20" />
          </div>
          <h1 className="text-2xl font-bold text-white">About</h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Author
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Anastasiya Smoler
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Frontend developer · RS School Student 2026
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              About the app
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              App built with React, TypeScript and React Router. Search for your
              favourite Pokémon and explore their stats, abilities and moves.
            </p>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700" />

          <div className="flex flex-col gap-3">
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="
                flex items-center justify-between px-4 py-3 rounded-xl
                bg-red-50 dark:bg-red-950
                border border-red-100 dark:border-red-800
                hover:bg-red-100 dark:hover:bg-red-900
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                RS School · React Course
              </span>
              <span className="text-red-400 dark:text-red-500">→</span>
            </a>

            <Link
              to="/?page=1"
              className="
                flex items-center justify-between px-4 py-3 rounded-xl
                bg-gray-50 dark:bg-gray-700
                border border-gray-100 dark:border-gray-600
                hover:bg-gray-100 dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Back to App
              </span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
