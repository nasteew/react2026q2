import { render, screen } from '@testing-library/react';
import CardList from './CardList';
import { mockItem } from '@/test-utils/mocks/mockItem';

describe('CardList', () => {
  it('renders correct number of items', () => {
    const items = [mockItem, { ...mockItem, name: 'charmander' }];
    render(<CardList items={items} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('renders nothing when items array is empty', () => {
    render(<CardList items={[]} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('displays item names', () => {
    render(<CardList items={[mockItem]} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });
});
