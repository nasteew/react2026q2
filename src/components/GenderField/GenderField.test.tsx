import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenderField } from './GenderField';

describe('GenderField', () => {
  it('renders select with htmlFor label', () => {
    render(<GenderField id="gender" name="gender" />);

    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'gender');
  });

  it('allows selecting gender option', async () => {
    const user = userEvent.setup();
    render(<GenderField id="gender" name="gender" />);

    await user.selectOptions(screen.getByLabelText('Gender'), 'female');

    expect(screen.getByLabelText('Gender')).toHaveValue('female');
  });

  it('shows validation error', () => {
    render(
      <GenderField id="gender" name="gender" error="Please select a gender" />
    );

    expect(screen.getByText('Please select a gender')).toBeInTheDocument();
  });
});
