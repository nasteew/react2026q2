import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TermsCheckbox } from './TermsCheckbox';

describe('TermsCheckbox', () => {
  it('renders checkbox with htmlFor label association', () => {
    render(<TermsCheckbox id="terms" name="terms" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'terms');
    expect(screen.getByLabelText(/I accept the Terms & Conditions/i)).toBe(
      checkbox
    );
  });

  it('can be checked by user', async () => {
    const user = userEvent.setup();
    render(<TermsCheckbox id="terms" name="terms" />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('shows validation error', () => {
    render(
      <TermsCheckbox
        id="terms"
        name="terms"
        error="You must accept the Terms & Conditions"
      />
    );

    expect(
      screen.getByText('You must accept the Terms & Conditions')
    ).toBeInTheDocument();
  });
});
