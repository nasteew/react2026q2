import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RHFForm } from './RHFForm';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { fillRHFForm } from '@/test-utils/fillForm';
import { selectSubmissions } from '@/store/hooks';
import {
  createImageFile,
  VALID_PASSWORD,
} from '@/test-utils/renderWithProviders';

vi.mock('@/utils/toBase64', () => ({
  toBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
}));

describe('RHFForm', () => {
  it('renders all form fields', () => {
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Photo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('disables submit while form has validation errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText('Full name'), 'ada');

    expect(submitButton).toBeDisabled();
    expect(
      await screen.findByText('First letter must be uppercase')
    ).toBeInTheDocument();
  });

  it('shows live password mismatch error and keeps submit disabled', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Full name'), 'Ada');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), 'Different1!');
    await user.type(screen.getByLabelText('Country'), 'United States');
    await user.upload(screen.getByLabelText('Photo'), createImageFile());
    await user.click(screen.getByLabelText(/I accept the Terms & Conditions/i));

    expect(
      await screen.findByText('Passwords do not match')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('disables submit for invalid country during live validation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Full name'), 'Ada');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), VALID_PASSWORD);
    await user.type(screen.getByLabelText('Country'), 'Atlantis');
    await user.upload(screen.getByLabelText('Photo'), createImageFile());
    await user.click(screen.getByLabelText(/I accept the Terms & Conditions/i));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  it('enables submit when all fields are valid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    await fillRHFForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });
  });

  it('submits valid data and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { store } = renderWithProviders(<RHFForm onClose={onClose} />);

    await fillRHFForm(user);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    const submissions = selectSubmissions(store.getState());
    expect(submissions).toHaveLength(1);
    expect(submissions[0].email).toBe('ada@example.com');
    expect(submissions[0].country).toBe('United States');
  });

  it('shows password strength indicator while typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RHFForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);

    expect(screen.getByText('1 lowercase')).toHaveClass('text-emerald-400');
    expect(screen.getByText('1 special character')).toHaveClass(
      'text-emerald-400'
    );
  });
});
