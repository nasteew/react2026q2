import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Search from './Search';

const onSearch = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe('Search', () => {
  it('renders search input and button', () => {
    render(<Search value="" onSearch={onSearch} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows empty input when no value provided', () => {
    render(<Search value="" onSearch={onSearch} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('');
  });

  it('displays provided value in input', () => {
    render(<Search value="pikachu" onSearch={onSearch} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('pikachu');
  });

  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    render(<Search value="" onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Enter Pokémon name'), 'bulbasaur');
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue(
      'bulbasaur'
    );
  });

  it('calls onSearch with input value on button click', async () => {
    const user = userEvent.setup();
    render(<Search value="" onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Enter Pokémon name'), 'pikachu');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('pikachu');
  });

  it('calls onSearch on form submit', async () => {
    const user = userEvent.setup();
    render(<Search value="" onSearch={onSearch} />);

    await user.type(screen.getByLabelText('Enter Pokémon name'), 'charmander');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('charmander');
  });

  it('updates input when value prop changes', () => {
    const { rerender } = render(
      <Search value="bulbasaur" onSearch={onSearch} />
    );
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue(
      'bulbasaur'
    );

    rerender(<Search value="pikachu" onSearch={onSearch} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('pikachu');
  });
});
