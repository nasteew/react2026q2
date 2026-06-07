import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
