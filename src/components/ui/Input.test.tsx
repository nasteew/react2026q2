import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders label connected with htmlFor', () => {
    render(<Input id="name" label="Full name" name="name" />);

    expect(screen.getByLabelText('Full name')).toHaveAttribute('id', 'name');
  });

  it('displays error with reserved space', () => {
    render(
      <Input id="name" label="Full name" name="name" error="Name is required" />
    );

    const error = screen.getByText('Name is required');
    expect(error).toHaveClass('min-h-[16px]');
  });
});
