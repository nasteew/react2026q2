import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import ErrorButton from './ErrorButton';
import { suppressConsoleError } from '@/test-utils/suppressConsoleError';

suppressConsoleError();

describe('ErrorButton', () => {
  it('render button', () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    expect(
      screen.getByRole('button', { name: 'Simulate error' })
    ).toBeInTheDocument();
  });

  it('throws error on click and triggers fallback UI', async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Simulate error' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Simulate error' })
    ).not.toBeInTheDocument();
  });
});
