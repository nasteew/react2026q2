import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-500 shadow-lg p-4">
        <nav className="flex gap-4 text-white font-semibold">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
