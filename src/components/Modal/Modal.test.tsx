import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

function fireTabOnDialog(
  dialog: HTMLElement,
  target: HTMLElement,
  shiftKey = false
) {
  const event = createEvent.keyDown(dialog, {
    key: 'Tab',
    shiftKey,
    bubbles: true,
  });
  Object.defineProperty(event, 'target', { value: target });
  fireEvent(dialog, event);
}

describe('Modal', () => {
  it('renders children in a portal when open', async () => {
    const { container } = render(
      <Modal isOpen title="Test Modal" onClose={vi.fn()}>
        <p>Form content</p>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog');
    expect(container).not.toContainElement(dialog);
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} title="Test Modal" onClose={vi.fn()}>
        <p>Form content</p>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('unmounts dialog when isOpen becomes false', async () => {
    const { rerender } = render(
      <Modal isOpen title="Test Modal" onClose={vi.fn()}>
        <p>Form content</p>
      </Modal>
    );

    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} title="Test Modal" onClose={vi.fn()}>
        <p>Form content</p>
      </Modal>
    );

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <p>Form content</p>
      </Modal>
    );

    await user.click(
      await screen.findByRole('button', { name: 'Close modal' })
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on Escape key', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <input aria-label="Name" />
      </Modal>
    );

    const input = await screen.findByLabelText('Name');
    await user.click(input);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop', async () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <p>Form content</p>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog');
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking modal content', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <p>Form content</p>
      </Modal>
    );

    await user.click(await screen.findByText('Form content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('traps focus with sentinel refs on Tab', async () => {
    render(
      <Modal isOpen title="Focus Trap" onClose={vi.fn()}>
        <button type="button">Action</button>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog');
    const trapStart = screen.getByTestId('modal-trap-start');
    const trapEnd = screen.getByTestId('modal-trap-end');

    fireTabOnDialog(dialog, trapEnd);
    expect(trapStart).toHaveFocus();

    fireTabOnDialog(dialog, trapStart, true);
    expect(trapEnd).toHaveFocus();
  });

  it('returns focus to trigger ref when closed', async () => {
    const returnFocusRef = createRef<HTMLButtonElement>();

    const closedView = (
      <>
        <button ref={returnFocusRef} type="button">
          Open form
        </button>
        <Modal
          isOpen={false}
          title="Return focus"
          onClose={vi.fn()}
          returnFocusRef={returnFocusRef}
        >
          <p>Form content</p>
        </Modal>
      </>
    );

    const { rerender } = render(closedView);

    rerender(
      <>
        <button ref={returnFocusRef} type="button">
          Open form
        </button>
        <Modal
          isOpen
          title="Return focus"
          onClose={vi.fn()}
          returnFocusRef={returnFocusRef}
        >
          <p>Form content</p>
        </Modal>
      </>
    );

    rerender(closedView);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Open form' })).toHaveFocus();
    });
  });

  it('has accessible dialog attributes', async () => {
    render(
      <Modal isOpen title="Accessible Modal" onClose={vi.fn()}>
        <p>Form content</p>
      </Modal>
    );

    const dialog = await screen.findByRole('dialog');
    expect(dialog.tagName).toBe('DIALOG');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
