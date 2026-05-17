import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from './Card';
import { mockItem } from '@/test-utils/mocks/mockItem';

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
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Card item={mockItem} onClick={onClick} />);

    await user.click(screen.getByRole('article'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(mockItem.name);
  });
});
