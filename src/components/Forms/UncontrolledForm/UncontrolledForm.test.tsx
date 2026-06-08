import { describe, expect, it, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UncontrolledForm } from './UncontrolledForm';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { fillUncontrolledForm } from '@/test-utils/fillForm';
import { selectSubmissions } from '@/store/hooks';
import {
  createImageFile,
  VALID_PASSWORD,
} from '@/test-utils/renderWithProviders';

vi.mock('@/utils/toBase64', () => ({
  toBase64: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
}));

describe('UncontrolledForm', () => {
  it('renders all form fields with connected labels', () => {
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Photo')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('validates only on submit and shows errors', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });

  it('shows validation errors for invalid name and email on submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Full name'), 'ada');
    await user.type(screen.getByLabelText('Email'), 'bad-email');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('First letter must be uppercase')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Email must contain exactly one @')
    ).toBeInTheDocument();
  });

  it('shows country error when country is not in the list', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await fillUncontrolledForm(user);
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Atlantis' },
    });
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Country must be selected from the list')
    ).toBeInTheDocument();
  });

  it('shows image error for unsupported file type', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Full name'), 'Ada');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), VALID_PASSWORD);
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'United States' },
    });
    fireEvent.change(screen.getByLabelText('Photo'), {
      target: {
        files: [new File(['x'], 'doc.pdf', { type: 'application/pdf' })],
      },
    });
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Only PNG and JPEG files are allowed')
    ).toBeInTheDocument();
  });

  it('shows password mismatch error on submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Full name'), 'Ada');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), 'Different1!');
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'United States' },
    });
    fireEvent.change(screen.getByLabelText('Photo'), {
      target: { files: [createImageFile()] },
    });
    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Passwords do not match')
    ).toBeInTheDocument();
  });

  it('submits valid data to the store and calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { store } = renderWithProviders(
      <UncontrolledForm onClose={onClose} />
    );

    await fillUncontrolledForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(selectSubmissions(store.getState())).toHaveLength(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    const submissions = selectSubmissions(store.getState());
    expect(submissions[0].name).toBe('Ada');
    expect(submissions[0].image).toBe('data:image/png;base64,abc');
  });

  it('shows password strength while typing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UncontrolledForm onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), VALID_PASSWORD);

    expect(screen.getByText('1 number')).toHaveClass('text-emerald-400');
    expect(screen.getByText('1 uppercase')).toHaveClass('text-emerald-400');
  });
});
