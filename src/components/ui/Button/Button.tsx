interface ButtonProps {
  onClick?: () => void;
  label: string;
  ariaLabel?: string;
  className?: string;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  'data-testid'?: string;
}

function Button({
  onClick,
  label,
  ariaLabel,
  className,
  type = 'button',
  disabled = false,
  'data-testid': testId,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`cursor-pointer inline-flex items-center
        font-semibold rounded-xl border-2 border-black shadow-lg
        active:scale-95 transform transition-transform duration-150 ease-out
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2
        motion-reduce:transition-none ${className}`}
      type={type}
      disabled={disabled}
      data-testid={testId}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
}

export default Button;
