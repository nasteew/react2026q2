import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';

describe('Pagination', () => {
  it('renders current page number', () => {
    render(<Pagination page={5} onChange={() => {}} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('disables previous button when page = 1', async () => {
    render(<Pagination page={1} onChange={() => {}} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    expect(prevBtn).toBeDisabled();
  });

  it('enables previous button when page > 1', async () => {
    render(<Pagination page={3} onChange={() => {}} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    expect(prevBtn).not.toBeDisabled();
  });

  it('calls onChange(page - 1) when clicking previous button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={4} onChange={onChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    await user.click(prevBtn);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does NOT call onChange when clicking previous button at page = 1', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={1} onChange={onChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    await user.click(prevBtn);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange(page + 1) when clicking next button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={10} onChange={onChange} />);

    const nextBtn = screen.getByRole('button', { name: 'Next page' });

    await user.click(nextBtn);

    expect(onChange).toHaveBeenCalledWith(11);
  });
});
