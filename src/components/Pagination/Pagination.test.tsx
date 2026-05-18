import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from './Pagination';
import { vi } from 'vitest';

describe('Pagination', () => {
  it('renders current page number', () => {
    render(<Pagination page={5} totalPages={10} onChange={() => {}} />);

    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  it('disables previous button when page = 1', async () => {
    render(<Pagination page={1} totalPages={10} onChange={() => {}} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    expect(prevBtn).toBeDisabled();
  });

  it('enables previous button when page > 1', async () => {
    render(<Pagination page={3} totalPages={10} onChange={() => {}} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    expect(prevBtn).not.toBeDisabled();
  });

  it('calls onChange(page - 1) when clicking previous button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={4} totalPages={10} onChange={onChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    await user.click(prevBtn);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does NOT call onChange when clicking previous button at page = 1', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={1} totalPages={10} onChange={onChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Previous page' });

    await user.click(prevBtn);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onChange(page + 1) when clicking next button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Pagination page={10} totalPages={20} onChange={onChange} />);

    const nextBtn = screen.getByRole('button', { name: 'Next page' });

    await user.click(nextBtn);

    expect(onChange).toHaveBeenCalledWith(11);
  });

  it('disables next button on last page', async () => {
    render(<Pagination page={10} totalPages={10} onChange={() => {}} />);

    const nextBtn = screen.getByRole('button', { name: 'Next page' });

    expect(nextBtn).toBeDisabled();
  });
});
