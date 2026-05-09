export default function Pokeball({
  className = 'w-5 h-5',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...props}>
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#fff"
        stroke="#000"
        strokeWidth="0.8"
      />
      <path d="M2 12a10 10 0 0 0 20 0H2z" fill="#ef4444" />
      <circle cx="12" cy="12" r="3" fill="#111827" />
      <circle cx="12" cy="12" r="1.2" fill="#fff" />
    </svg>
  );
}
