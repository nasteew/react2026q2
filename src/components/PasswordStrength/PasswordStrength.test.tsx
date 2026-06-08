import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrength } from './PasswordStrength';
import { getPasswordStrength } from '@/utils/passwordStrength';

describe('PasswordStrength', () => {
  it('renders all strength checks', () => {
    render(<PasswordStrength strength={getPasswordStrength('Aa1!bbbb')} />);

    expect(screen.getByText('1 number')).toBeInTheDocument();
    expect(screen.getByText('1 uppercase')).toBeInTheDocument();
    expect(screen.getByText('1 lowercase')).toBeInTheDocument();
    expect(screen.getByText('1 number')).toBeInTheDocument();
  });

  it('renders default weak state when strength is null', () => {
    render(<PasswordStrength strength={null} />);
    expect(screen.getByText('1 number')).toHaveClass('text-white/30');
  });
});
