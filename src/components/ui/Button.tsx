import { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const base = `
    rounded-xl px-6 py-3 text-sm font-medium
    transition duration-150 active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
    disabled:opacity-30 disabled:cursor-not-allowed
  `;

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-lg disabled:hover:bg-indigo-600',
    ghost:
      'bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/70 hover:text-white',
  };

  return (
    <button {...props} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
