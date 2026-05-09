import { render, screen } from '@testing-library/react';
import Loader from './Loader';

test('renders loader spinner', () => {
  render(<Loader />);

  const spinner = screen.getByRole('status');

  expect(spinner).toBeInTheDocument();
});
