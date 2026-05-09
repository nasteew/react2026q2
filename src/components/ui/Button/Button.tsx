import { Component } from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
  ariaLabel?: string;
  className?: string;
  type?: 'submit' | 'button' | 'reset';
}

class Button extends Component<ButtonProps> {
  render() {
    const { onClick, label, ariaLabel, className = '' } = this.props;

    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`cursor-pointer inline-flex items-center px-5 py-2
        text-white font-semibold rounded-xl border-2 border-black shadow-lg
        active:scale-95 transform transition-transform duration-150 ease-out
        hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2
        motion-reduce:transition-none ${className}`}
      >
        <span className="text-sm">{label}</span>
      </button>
    );
  }
}

export default Button;
