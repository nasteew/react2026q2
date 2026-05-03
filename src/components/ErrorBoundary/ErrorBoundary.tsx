import { Component, type ReactNode, type ErrorInfo } from 'react';
import Pokeball from '../ui/icons/Pokeball';
import Button from '../ui/Button/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-4 p-4 rounded-2xl border-3 border-red-200
                       bg-gradient-to-br from-red-50 to-white text-red-700 shadow-sm
                       max-w-md w-full"
          >
            <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 border border-black/5 p-1">
              <Pokeball className="w-5 h-5" />
            </span>

            <div className="text-left">
              <p className="font-semibold text-sm text-red-800">
                Something went wrong
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                onClick={this.handleRetry}
                label="Retry"
                ariaLabel="Simulate error"
                className="bg-red-500 focus:ring-red-300"
              ></Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
