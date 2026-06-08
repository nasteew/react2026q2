import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CountryField } from './CountryField';

const countries = ['United States', 'Germany', 'France'];

describe('CountryField', () => {
  it('renders label connected with htmlFor and datalist options', () => {
    render(<CountryField id="country" name="country" countries={countries} />);

    const input = screen.getByLabelText('Country');
    expect(input).toHaveAttribute('list', 'country-list');

    const options = screen.getAllByRole('option', { hidden: true });
    expect(options).toHaveLength(3);
    expect(options.map((option) => option.getAttribute('value'))).toContain(
      'Germany'
    );
  });

  it('displays validation error', () => {
    render(
      <CountryField
        id="country"
        name="country"
        countries={countries}
        error="Country must be selected from the list"
      />
    );

    expect(
      screen.getByText('Country must be selected from the list')
    ).toBeInTheDocument();
  });
});
