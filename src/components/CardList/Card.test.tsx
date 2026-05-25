import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { mockItem } from '@/test-utils/mocks/mockItem';
import { useSelectedItemsStore } from '@/store/store';

beforeEach(() => {
  useSelectedItemsStore.setState({ items: [] });
});

describe('Card', () => {
  it('displays item name', () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('displays item image with correct alt', () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
  });

  it('displays item types', () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    expect(screen.getAllByText('grass', { exact: false })).toHaveLength(2);
    expect(screen.getAllByText('poison', { exact: false })).toHaveLength(2);
  });

  it('displays height and weight', () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('69')).toBeInTheDocument();
  });

  it('renders without types gracefully', () => {
    render(<Card item={{ ...mockItem, types: [] }} onClick={() => {}} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', async () => {
    const onClick = vi.fn();

    render(<Card item={mockItem} onClick={onClick} />);

    await userEvent.click(screen.getByTestId(`card-${mockItem.id}`));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(mockItem.id);
  });

  it('renders checkbox', () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    expect(screen.getByTestId(`checkbox-${mockItem.id}`)).toBeInTheDocument();
  });

  it('adds item to store when checkbox is clicked', async () => {
    render(<Card item={mockItem} onClick={() => {}} />);
    await userEvent.click(screen.getByTestId(`checkbox-input-${mockItem.id}`));
    expect(useSelectedItemsStore.getState().items).toHaveLength(1);
    expect(useSelectedItemsStore.getState().items[0].id).toBe(
      String(mockItem.id)
    );
  });

  it('removes item from store when checkbox is clicked again', async () => {
    render(<Card item={mockItem} onClick={() => {}} />);

    const checkbox = screen.getByTestId(`checkbox-input-${mockItem.id}`);

    await userEvent.click(checkbox);
    await userEvent.click(checkbox);

    expect(useSelectedItemsStore.getState().items).toHaveLength(0);
  });

  it('does not call onClick when checkbox is clicked', async () => {
    const onClick = vi.fn();

    render(<Card item={mockItem} onClick={onClick} />);

    await userEvent.click(screen.getByTestId(`checkbox-input-${mockItem.id}`));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('shows checkmark when item is selected', () => {
    useSelectedItemsStore.setState({
      items: [
        {
          id: String(mockItem.id),
          name: mockItem.name,
          types: mockItem.types.join(' | '),
          height: mockItem.height,
          weight: mockItem.weight,
          abilities: mockItem.abilities.join(' | '),
          baseExperience: mockItem.baseExperience,
          url: mockItem.image,
        },
      ],
    });

    render(<Card item={mockItem} onClick={() => {}} />);

    expect(
      screen.getByTestId(`checkbox-${mockItem.id}`).querySelector('svg')
    ).toBeInTheDocument();
  });

  it('renders Pokeball when image is missing', () => {
    render(<Card item={{ ...mockItem, image: '' }} onClick={() => {}} />);
    expect(screen.queryByAltText('bulbasaur')).not.toBeInTheDocument();
  });
});
