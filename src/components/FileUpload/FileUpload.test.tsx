import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './FileUpload';
import { createImageFile } from '@/test-utils/renderWithProviders';

describe('FileUpload', () => {
  it('renders photo label connected with htmlFor', () => {
    render(<FileUpload id="photo" name="image" />);

    expect(screen.getByLabelText('Photo')).toHaveAttribute('type', 'file');
  });

  it('accepts file upload', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<FileUpload id="photo" name="image" onChange={onChange} />);

    const file = createImageFile();
    await user.upload(screen.getByLabelText('Photo'), file);

    expect(onChange).toHaveBeenCalled();
  });

  it('shows selected file name', async () => {
    const user = userEvent.setup();

    render(<FileUpload id="photo" name="image" />);

    await user.upload(
      screen.getByLabelText('Photo'),
      createImageFile('avatar.png')
    );

    expect(screen.getByText('avatar.png')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<FileUpload id="photo" name="image" error="Image is required" />);

    expect(screen.getByText('Image is required')).toBeInTheDocument();
  });
});
