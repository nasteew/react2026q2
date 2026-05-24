import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSelectedItemsStore } from '@/store/store';
import Flyout from './Flyout';

const mockItem = {
  id: '1',
  name: 'bulbasaur',
  types: 'grass | poison',
  height: 7,
  weight: 69,
  abilities: 'overgrow',
  baseExperience: 64,
  url: 'https://pokeapi.co/api/v2/pokemon/1',
};

const mockItem2 = {
  id: '2',
  name: 'ivysaur',
  types: 'grass | poison',
  height: 10,
  weight: 130,
  abilities: 'overgrow',
  baseExperience: 142,
  url: 'https://pokeapi.co/api/v2/pokemon/2',
};

beforeEach(() => {
  useSelectedItemsStore.setState({ items: [] });
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
  URL.revokeObjectURL = vi.fn();
});

describe('Flyout', () => {
  it('should not render when no items selected', () => {
    render(<Flyout />);
    expect(screen.queryByTestId('flyout')).not.toBeInTheDocument();
  });

  it('should render when items are selected', () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    render(<Flyout />);
    expect(screen.getByTestId('flyout')).toBeInTheDocument();
  });

  it('should display correct items count for single item', () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    render(<Flyout />);
    expect(
      screen.getByText(
        (_, el) =>
          (el?.tagName === 'SPAN' &&
            el?.textContent?.includes('Selected') &&
            el?.textContent?.includes('1') &&
            el?.textContent?.includes('item')) ||
          false
      )
    ).toBeInTheDocument();
  });

  it('should display correct items count for multiple items', () => {
    useSelectedItemsStore.setState({ items: [mockItem, mockItem2] });
    render(<Flyout />);
    expect(
      screen.getByText(
        (_, el) =>
          (el?.tagName === 'SPAN' &&
            el?.textContent?.includes('Selected') &&
            el?.textContent?.includes('2') &&
            el?.textContent?.includes('items')) ||
          false
      )
    ).toBeInTheDocument();
  });

  it('should unselect all items when Clear All is clicked', async () => {
    useSelectedItemsStore.setState({ items: [mockItem, mockItem2] });
    render(<Flyout />);
    await userEvent.click(screen.getByText('Clear All ✕'));
    expect(useSelectedItemsStore.getState().items).toHaveLength(0);
  });

  it('should hide flyout after unselect all', async () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    render(<Flyout />);
    await userEvent.click(screen.getByText('Clear All ✕'));
    expect(screen.queryByTestId('flyout')).not.toBeInTheDocument();
  });

  it('should trigger download on Download button click', async () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    render(<Flyout />);
    const anchor = document.querySelector(
      'a[aria-hidden="true"]'
    ) as HTMLAnchorElement;
    vi.spyOn(anchor, 'click').mockImplementation(() => {});
    await userEvent.click(screen.getByText('Download ↓'));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('should set correct filename on download', async () => {
    useSelectedItemsStore.setState({ items: [mockItem, mockItem2] });
    render(<Flyout />);
    const anchor = document.querySelector(
      'a[aria-hidden="true"]'
    ) as HTMLAnchorElement;
    vi.spyOn(anchor, 'click').mockImplementation(() => {});
    await userEvent.click(screen.getByText('Download ↓'));
    expect(anchor.download).toBe('2_items.csv');
  });

  it('should show Ready to download text', () => {
    useSelectedItemsStore.setState({ items: [mockItem] });
    render(<Flyout />);
    expect(screen.getByText('Ready to download')).toBeInTheDocument();
  });
});
