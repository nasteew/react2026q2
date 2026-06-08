import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function showModal(
    this: HTMLDialogElement
  ) {
    this.open = true;
  });

  HTMLDialogElement.prototype.close = vi.fn(function close(
    this: HTMLDialogElement
  ) {
    this.open = false;
  });
});
