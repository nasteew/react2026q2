import { fireEvent, screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { createImageFile, VALID_PASSWORD } from './renderWithProviders';

function getScope(root?: HTMLElement) {
  return root ? within(root) : screen;
}

export async function fillUncontrolledForm(
  user: UserEvent,
  root?: HTMLElement
) {
  const scope = getScope(root);

  await user.type(scope.getByLabelText('Full name'), 'Ada');
  await user.type(scope.getByLabelText('Age'), '25');
  await user.selectOptions(scope.getByLabelText('Gender'), 'female');
  await user.type(scope.getByLabelText('Email'), 'ada@example.com');
  await user.type(scope.getByLabelText('Password'), VALID_PASSWORD);
  await user.type(scope.getByLabelText('Confirm password'), VALID_PASSWORD);
  fireEvent.change(scope.getByLabelText('Country'), {
    target: { value: 'United States' },
  });
  fireEvent.change(scope.getByLabelText('Photo'), {
    target: { files: [createImageFile()] },
  });
  await user.click(scope.getByRole('checkbox'));
}

export async function fillRHFForm(user: UserEvent, root?: HTMLElement) {
  const scope = getScope(root);

  await user.type(scope.getByLabelText('Full name'), 'Ada');
  await user.type(scope.getByLabelText('Age'), '25');
  await user.selectOptions(scope.getByLabelText('Gender'), 'female');
  await user.type(scope.getByLabelText('Email'), 'ada@example.com');
  await user.type(scope.getByLabelText('Password'), VALID_PASSWORD);
  await user.type(scope.getByLabelText('Confirm password'), VALID_PASSWORD);
  await user.type(scope.getByLabelText('Country'), 'United States');
  await user.upload(scope.getByLabelText('Photo'), createImageFile());
  await user.click(scope.getByLabelText(/I accept the Terms & Conditions/i));
}
