import { render, screen } from '@testing-library/react';
import Card from './Card';
import { mockItem } from '@/test-utils/mocks/mockItem';

describe('Card', () => {
  it('displays item name', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('displays item image with correct alt', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
  });

  it('displays item types', () => {
    render(<Card item={mockItem} />);
    expect(screen.getAllByText('grass', { exact: false })).toHaveLength(2);
    expect(screen.getAllByText('poison', { exact: false })).toHaveLength(2);
  });

  it('displays height and weight', () => {
    render(<Card item={mockItem} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('69')).toBeInTheDocument();
  });

  it('renders without types gracefully', () => {
    render(<Card item={{ ...mockItem, types: [] }} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('renders with single type', () => {
    render(<Card item={{ ...mockItem, types: ['fire'] }} />);
    expect(screen.getAllByText('fire', { exact: false })).toHaveLength(2);
  });

  it('renders badge with default style for unknown type', () => {
    render(<Card item={{ ...mockItem, types: ['unknown_type'] }} />);
    expect(screen.getAllByText('unknown_type', { exact: false })).toHaveLength(
      2
    );
  });

  it('uses default style for unknown secondary type', () => {
    render(<Card item={{ ...mockItem, types: ['fire', 'unknown'] }} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });
});
