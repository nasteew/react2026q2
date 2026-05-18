import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CardList from './CardList';
import { mockItem } from '@/test-utils/mocks/mockItem';

describe('CardList', () => {
  it('renders correct number of items', () => {
    const items = [mockItem, { ...mockItem, name: 'charmander' }];
    render(<CardList items={items} onCardClick={() => {}} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('renders nothing when items array is empty', () => {
    render(<CardList items={[]} onCardClick={() => {}} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('displays item names', () => {
    render(<CardList items={[mockItem]} onCardClick={() => {}} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('calls onCardClick when card is clicked', async () => {
    const user = userEvent.setup();
    const onCardClick = vi.fn();

    render(<CardList items={[mockItem]} onCardClick={onCardClick} />);

    await user.click(screen.getByRole('article'));

    expect(onCardClick).toHaveBeenCalledTimes(1);
    expect(onCardClick).toHaveBeenCalledWith(mockItem.id);
  });

  it('applies 3-column layout when isDetailOpen = false', () => {
    render(
      <CardList
        items={[mockItem]}
        onCardClick={() => {}}
        isDetailOpen={false}
      />
    );

    const grid = screen.getByRole('grid');

    expect(grid.className).toContain('lg:grid-cols-3');
  });

  it('applies 2-column layout when isDetailOpen = true', () => {
    render(
      <CardList items={[mockItem]} onCardClick={() => {}} isDetailOpen={true} />
    );

    const grid = screen.getByRole('grid');

    expect(grid.className).not.toContain('lg:grid-cols-3');
    expect(grid.className).toContain('sm:grid-cols-2');
  });
});
