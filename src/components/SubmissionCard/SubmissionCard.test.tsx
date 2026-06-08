import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { SubmissionCard } from './SubmissionCard';
import type { FormSubmission } from '@/store/submissionsSlice';

const submission: FormSubmission = {
  id: '1',
  name: 'Ada',
  age: 25,
  email: 'ada@example.com',
  gender: 'female',
  password: 'Aa1!bbbb',
  confirmPassword: 'Aa1!bbbb',
  country: 'United States',
  terms: true,
  image: 'data:image/png;base64,abc',
  submittedAt: Date.now(),
};

describe('SubmissionCard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders submission data and image', () => {
    render(<SubmissionCard submission={submission} isNew={false} />);

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getByText('ada@example.com')).toBeInTheDocument();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveAttribute(
      'src',
      submission.image
    );
  });

  it('shows new badge for recent submission', () => {
    render(<SubmissionCard submission={submission} isNew />);
    expect(screen.getByText('new')).toBeInTheDocument();
  });

  it('removes new badge after timeout', () => {
    vi.useFakeTimers();
    render(<SubmissionCard submission={submission} isNew />);

    act(() => {
      vi.advanceTimersByTime(2600);
    });

    expect(screen.queryByText('new')).not.toBeInTheDocument();
  });
});
