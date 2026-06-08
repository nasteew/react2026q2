import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { fillRHFForm, fillUncontrolledForm } from '@/test-utils/fillForm';
import {
  expectAllDialogsClosed,
  waitForOpenDialog,
  within,
} from '@/test-utils/dialog';

vi.mock('@/utils/toBase64', () => ({
  toBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
}));

describe('App', () => {
  it('shows empty state before any submission', () => {
    renderWithProviders(<App />);

    expect(screen.getByText('No submissions yet')).toBeInTheDocument();
    expect(
      screen.getByText('Fill out a form above to see results here')
    ).toBeInTheDocument();
  });

  it('opens uncontrolled modal in a portal and marks page inert', async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Uncontrolled form' }));

    const dialog = await waitForOpenDialog();
    expect(container).not.toContainElement(dialog);
    expect(
      within(dialog).getByRole('heading', { name: 'Uncontrolled Form' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('page-root')).toHaveAttribute('inert');
  });

  it('submits uncontrolled form, closes modal and shows submission card', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Uncontrolled form' }));
    const dialog = await waitForOpenDialog();
    await fillUncontrolledForm(user, dialog);
    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Ada')).toBeInTheDocument();
    });

    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('1 submission')).toBeInTheDocument();
    expect(screen.getByText('new')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada' })).toBeInTheDocument();
    await expectAllDialogsClosed();
  });

  it('opens react hook form modal and submits successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));

    const dialog = await waitForOpenDialog();
    expect(
      within(dialog).getByRole('heading', { name: 'React Hook Form' })
    ).toBeInTheDocument();
    await fillRHFForm(user, dialog);

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', { name: 'Submit' })
      ).toBeEnabled();
    });

    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    });
  });

  it('keeps submission history from both forms', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Uncontrolled form' }));
    let dialog = await waitForOpenDialog();
    await fillUncontrolledForm(user, dialog);
    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('1 submission')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'React Hook Form' }));
    dialog = await waitForOpenDialog();
    await fillRHFForm(user, dialog);

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', { name: 'Submit' })
      ).toBeEnabled();
    });

    await user.click(within(dialog).getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('2 submissions')).toBeInTheDocument();
    });
  }, 20000);

  it('closes modal and resets form on reopen', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.click(screen.getByRole('button', { name: 'Uncontrolled form' }));
    const dialog = await waitForOpenDialog();
    await user.type(within(dialog).getByLabelText('Full name'), 'Ada');
    await user.click(
      within(dialog).getByRole('button', { name: 'Close modal' })
    );

    await expectAllDialogsClosed();

    await user.click(screen.getByRole('button', { name: 'Uncontrolled form' }));
    const reopenedDialog = await waitForOpenDialog();
    expect(within(reopenedDialog).getByLabelText('Full name')).toHaveValue('');
  });
});
