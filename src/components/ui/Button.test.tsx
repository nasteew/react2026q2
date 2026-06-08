import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and handles click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click me</Button>);

    await user.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('supports ref forwarding', () => {
    let buttonNode: HTMLButtonElement | null = null;

    render(
      <Button
        ref={(node) => {
          buttonNode = node;
        }}
      >
        Open
      </Button>
    );

    expect(buttonNode).toBe(screen.getByRole('button', { name: 'Open' }));
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });
});
