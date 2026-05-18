import Pokeball from '@/components/ui/icons/Pokeball';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full overflow-hidden">
        <div className="bg-red-500 p-8 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md text-4xl">
            <Pokeball className="h-20" />
          </div>
          <h1 className="text-2xl font-bold text-white">About</h1>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Author
            </p>
            <p className="text-xl font-bold text-gray-900">Anastasiya Smoler</p>
            <p className="text-sm text-gray-500">
              Frontend developer · RS School Student 2026
            </p>
          </div>

          <div className="border-t border-gray-100" />

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              About the app
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              App built with React, TypeScript and React Router. Search for your
              favourite Pokémon and explore their stats, abilities and moves.
            </p>
          </div>

          <div className="border-t border-gray-100" />

          <div className="flex flex-col gap-3">
            <a
              href="https://rs.school/courses/reactjs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-4 py-3 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 transition"
            >
              <span className="text-sm font-semibold text-red-700">
                RS School · React Course
              </span>
              <span className="text-red-400">→</span>
            </a>

            <Link
              to="/?page=1"
              className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition"
            >
              <span className="text-sm font-semibold text-gray-700">
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
