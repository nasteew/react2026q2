import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Search from './Search';

const onChange = vi.fn();
const onSubmit = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe('Search', () => {
  it('renders search input and button', () => {
    render(<Search value="" onChange={onChange} onSubmit={onSubmit} />);

    expect(screen.getByLabelText('Enter Pokémon name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows empty input when no value provided', () => {
    render(<Search value="" onChange={onChange} onSubmit={onSubmit} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('');
  });

  it('displays provided value in input', () => {
    render(<Search value="pikachu" onChange={onChange} onSubmit={onSubmit} />);
    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('pikachu');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    render(<Search value="" onChange={onChange} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Enter Pokémon name'), 'bulbasaur');

    expect(onChange).toHaveBeenCalledTimes('bulbasaur'.length);
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('calls onSubmit when clicking Search button', async () => {
    const user = userEvent.setup();
    render(<Search value="pikachu" onChange={onChange} onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when pressing Enter', async () => {
    const user = userEvent.setup();
    render(
      <Search value="charmander" onChange={onChange} onSubmit={onSubmit} />
    );
    await user.click(screen.getByLabelText('Enter Pokémon name'));
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('updates input when value prop changes', () => {
    const { rerender } = render(
      <Search value="bulbasaur" onChange={onChange} onSubmit={onSubmit} />
    );

    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue(
      'bulbasaur'
    );

    rerender(
      <Search value="pikachu" onChange={onChange} onSubmit={onSubmit} />
    );

    expect(screen.getByLabelText('Enter Pokémon name')).toHaveValue('pikachu');
  });
});
