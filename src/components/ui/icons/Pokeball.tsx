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
        fill="#1a1a1a"
        opacity="0.08"
        transform="translate(0.5 0.5)"
      />

      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#f8f8f8"
        stroke="#222"
        strokeWidth="0.6"
      />

      <path d="M2 12a10 10 0 0 1 20 0H2z" fill="#e63030" />

      <path
        d="M5 7.5a10 10 0 0 1 14 0"
        stroke="#ff6b6b"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      <line x1="2" y1="12" x2="22" y2="12" stroke="#222" strokeWidth="0.8" />

      <circle cx="12" cy="12" r="3.2" fill="#222" />

      <circle cx="12" cy="12" r="2" fill="#f0f0f0" />

      <circle cx="11.2" cy="11.2" r="0.6" fill="#fff" opacity="0.9" />
    </svg>
  );
}
