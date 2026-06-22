'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '../ui/Button/Button';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

function ErrorButton() {
  const [shouldThrow, setShouldThrow] = useState(false);
  const t = useTranslations('errors');

  if (shouldThrow) {
    throw new Error('Simulated error from ErrorButton');
  }

  return (
    <ErrorBoundary t={t}>
      <Button
        onClick={() => setShouldThrow(true)}
        label={t('triggerError')}
        ariaLabel={t('triggerError')}
        className="bg-red-700 dark:bg-red-900 focus:ring-red-300 px-5 py-2 text-white"
      />
    </ErrorBoundary>
  );
}

export default ErrorButton;
