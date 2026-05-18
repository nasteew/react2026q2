import { useState } from 'react';
import Button from '../ui/Button/Button';

function ErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Simulated error from ErrorButton');
  }

  return (
    <Button
      onClick={() => setShouldThrow(true)}
      label="Trigger Error"
      ariaLabel="Simulate error"
      className="bg-red-700 focus:ring-red-300 px-5 py-2"
    />
  );
}

export default ErrorButton;
