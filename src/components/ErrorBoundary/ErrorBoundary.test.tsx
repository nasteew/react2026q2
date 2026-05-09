import { suppressConsoleError } from '@/test-utils/suppressConsoleError';
import ErrorBoundary from './ErrorBoundary';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { ThrowError } from '@/test-utils/throw-error';

suppressConsoleError();

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <p>Normal content</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('shows fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('reloads page on retry click', async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(reloadMock).toHaveBeenCalledOnce();
  });
});
