export const typeStyles: Record<
  string,
  { border: string; accent: string; bg: string; gradient: string }
> = {
  fire: {
    border: 'border-red-200',
    accent: 'from-red-500 to-red-600 text-white',
    bg: 'bg-red-50',
    gradient: 'bg-gradient-to-br from-red-50 to-red-100',
  },
  water: {
    border: 'border-blue-200',
    accent: 'from-blue-500 to-blue-600 text-white',
    bg: 'bg-blue-50',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
  },
  grass: {
    border: 'border-green-200',
    accent: 'from-green-500 to-green-600 text-white',
    bg: 'bg-green-50',
    gradient: 'bg-gradient-to-br from-green-50 to-green-100',
  },
  electric: {
    border: 'border-yellow-200',
    accent: 'from-yellow-400 to-yellow-500 text-black',
    bg: 'bg-yellow-50',
    gradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
  },
  default: {
    border: 'border-gray-200',
    accent: 'from-gray-400 to-gray-500 text-white',
    bg: 'bg-gray-50',
    gradient: 'bg-gradient-to-br from-white to-gray-50',
  },
};
