import { screen, waitFor, within } from '@testing-library/react';

export function waitForOpenDialog() {
  return screen.findByRole('dialog');
}

export async function expectAllDialogsClosed() {
  await waitFor(() => {
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}

export { within };
