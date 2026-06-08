import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PasswordStrength } from './PasswordStrength';
import { getPasswordStrength } from '@/utils/passwordStrength';

describe('PasswordStrength', () => {
  it('renders all strength checks', () => {
    render(<PasswordStrength strength={getPasswordStrength('Aa1!bbbb')} />);

    expect(screen.getByText('123 number')).toBeInTheDocument();
    expect(screen.getByText('ABC uppercase')).toBeInTheDocument();
    expect(screen.getByText('abc lowercase')).toBeInTheDocument();
    expect(screen.getByText('!@# special')).toBeInTheDocument();
  });

  it('renders default weak state when strength is null', () => {
    render(<PasswordStrength strength={null} />);
    expect(screen.getByText('123 number')).toHaveClass('text-white/30');
  });
});
