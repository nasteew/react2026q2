'use client';

import { Component, type ReactNode, type ErrorInfo } from 'react';
import Pokeball from '../ui/icons/Pokeball';
import Button from '../ui/Button/Button';

interface Props {
  children?: ReactNode;
  t: (key: string) => string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => window.location.reload();

  render() {
    const t = this.props.t;

    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
          <div
            role="alert"
            aria-live="polite"
            className="
              flex items-center gap-4 p-4 rounded-2xl
              border-3 border-red-200 dark:border-red-800
              bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-gray-900
              text-red-700 dark:text-red-400
              shadow-sm max-w-md w-full
            "
          >
            <span
              className="
                flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full
                bg-white/90 dark:bg-gray-800
                border border-black/5 dark:border-white/10
                p-1
              "
            >
              <Pokeball className="w-5 h-5" />
            </span>

            <div className="text-left">
              <p className="font-semibold text-sm text-red-800 dark:text-white">
                {t('somethingWrong')}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={this.handleRetry}
                label={t('retry')}
                ariaLabel={t('retry')}
                className="text-white px-3 py-2 bg-red-700 dark:bg-red-900 focus:ring-red-300 dark:focus:ring-red-700"
              />
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ErrorBoundary(props: Props) {
  return <ErrorBoundaryInner {...props} t={props.t} />;
}
